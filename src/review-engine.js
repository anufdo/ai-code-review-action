const core = require('@actions/core');
require('marked');

/**
 * Main engine for orchestrating code reviews
 */
class ReviewEngine {
  constructor(githubService, aiService, fileAnalyzer, config) {
    this.github = githubService;
    this.ai = aiService;
    this.analyzer = fileAnalyzer;
    this.config = config;
  }

  /**
   * Perform comprehensive code review
   */
  async performReview(pullNumber, files, baseCommit, headCommit) {
    const startTime = Date.now();
    core.info(`🔍 Starting review of ${files.length} files...`);

    const reviews = [];
    const reviewComments = [];
    let totalIssues = 0;

    // Get existing comments to avoid duplicates
    const existingComments = await this.github.getExistingReviewComments(pullNumber);
    const existingCommentPaths = new Set(existingComments.map(c => `${c.path}:${c.line}`));

    // Review each file
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      core.info(`📄 Reviewing file ${i + 1}/${files.length}: ${file.filename}`);

      try {
        const review = await this.reviewFile(file, baseCommit, headCommit);
        reviews.push(review);
        totalIssues += review.issues.length;

        // Create review comments for specific issues
        const comments = await this.createReviewComments(
          file,
          review,
          headCommit,
          existingCommentPaths
        );
        reviewComments.push(...comments);

      } catch (error) {
        core.warning(`Failed to review ${file.filename}: ${error.message}`);
        reviews.push({
          filename: file.filename,
          summary: `Review failed: ${error.message}`,
          issues: [],
          suggestions: [],
          score: 0
        });
      }
    }

    // Generate overall summary
    const context = await this.getPullRequestContext(pullNumber);
    const overallSummary = await this.ai.generateSummary(reviews, context);

    // Create comprehensive review comment
    const reviewBody = this.formatReviewComment(reviews, overallSummary, files.length, totalIssues);

    // Submit review
    let reviewUrl;
    try {
      if (reviewComments.length > 0) {
        // Submit review with inline comments
        const submitResponse = await this.github.submitReview(
          pullNumber,
          headCommit,
          reviewBody,
          this.determineReviewEvent(totalIssues),
          reviewComments
        );
        reviewUrl = submitResponse.html_url;
      } else {
        // Post as regular comment
        reviewUrl = await this.github.postComment(pullNumber, reviewBody);
      }
    } catch (error) {
      core.warning(`Failed to submit review: ${error.message}`);
      // Fallback to posting as comment
      reviewUrl = await this.github.postComment(pullNumber, reviewBody);
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    core.info(`✅ Review completed in ${duration}s`);

    return {
      summary: overallSummary,
      reviews: reviews,
      issuesFound: totalIssues,
      filesReviewed: files.length,
      reviewUrl: reviewUrl,
      duration: duration
    };
  }

  /**
   * Review a single file
   */
  async reviewFile(file, baseCommit, headCommit) {
    const filename = file.filename;
    const language = file.language;

    // Get file contents
    const [oldContent, newContent] = await Promise.all([
      file.status === 'added' ? null : this.github.getFileContent(filename, baseCommit),
      this.github.getFileContent(filename, headCommit)
    ]);

    if (!newContent && file.status !== 'removed') {
      throw new Error('Unable to fetch file content');
    }

    // Parse diff for context
    const diffContext = this.analyzer.parseDiff(file.patch);

    // Analyze with AI
    const analysis = await this.ai.analyzeCode(
      filename,
      oldContent,
      newContent,
      language,
      {
        diffContext,
        fileStatus: file.status,
        additions: file.additions,
        deletions: file.deletions,
        changes: file.changes
      }
    );

    return {
      filename,
      language,
      status: file.status,
      ...analysis
    };
  }

  /**
   * Create review comments for specific issues
   */
  async createReviewComments(file, review, commitSha, existingCommentPaths) {
    const comments = [];

    for (const issue of review.issues) {
      if (issue.line && issue.line > 0) {
        const commentKey = `${file.filename}:${issue.line}`;

        // Skip if comment already exists
        if (existingCommentPaths.has(commentKey)) {
          continue;
        }

        const commentBody = this.formatIssueComment(issue);

        comments.push({
          path: file.filename,
          line: issue.line,
          body: commentBody
        });
      }
    }

    return comments;
  }

  /**
   * Get pull request context for better analysis
   */
  async getPullRequestContext(pullNumber) {
    try {
      const pr = await this.github.octokit.rest.pulls.get({
        owner: this.github.context.repo.owner,
        repo: this.github.context.repo.repo,
        pull_number: pullNumber
      });

      return {
        pullRequestTitle: pr.data.title,
        pullRequestDescription: pr.data.body,
        author: pr.data.user.login,
        baseBranch: pr.data.base.ref,
        headBranch: pr.data.head.ref
      };
    } catch (error) {
      core.warning(`Failed to get PR context: ${error.message}`);
      return {};
    }
  }

  /**
   * Format the main review comment
   */
  formatReviewComment(reviews, overallSummary, totalFiles, totalIssues) {
    const stats = this.calculateReviewStats(reviews);

    let comment = '# 🤖 AI Code Review\n\n';

    // Overall summary
    comment += `${overallSummary}\n\n`;

    // Statistics
    comment += '## 📊 Review Statistics\n\n';
    comment += '| Metric | Value |\n';
    comment += '|--------|-------|\n';
    comment += `| Files Reviewed | ${totalFiles} |\n`;
    comment += `| Issues Found | ${totalIssues} |\n`;
    comment += `| Average Score | ${stats.averageScore}/100 |\n`;
    comment += `| Security Issues | ${stats.securityIssues} |\n`;
    comment += `| Performance Issues | ${stats.performanceIssues} |\n\n`;

    // Issue breakdown by severity
    if (totalIssues > 0) {
      comment += '## 🔍 Issues by Severity\n\n';
      comment += `- 🚨 **Errors**: ${stats.errorCount}\n`;
      comment += `- ⚠️ **Warnings**: ${stats.warningCount}\n`;
      comment += `- 💡 **Suggestions**: ${stats.suggestionCount}\n\n`;
    }

    // File-by-file breakdown
    if (reviews.length > 0) {
      comment += '## 📁 File Review Summary\n\n';

      for (const review of reviews) {
        const emoji = this.getScoreEmoji(review.score);
        const issueCount = review.issues.length;

        comment += `### ${emoji} \`${review.filename}\`\n`;
        comment += `**Score**: ${review.score}/100 | **Issues**: ${issueCount}\n\n`;

        if (review.summary) {
          comment += `${review.summary}\n\n`;
        }

        // Show top issues for this file
        const topIssues = review.issues
          .filter(issue => issue.type === 'error' || issue.type === 'warning')
          .slice(0, 3);

        if (topIssues.length > 0) {
          comment += '**Key Issues:**\n';
          for (const issue of topIssues) {
            const icon = issue.type === 'error' ? '🚨' : '⚠️';
            comment += `- ${icon} ${issue.message}\n`;
          }
          comment += '\n';
        }
      }
    }

    // Recommendations
    comment += '## 🎯 Recommendations\n\n';

    if (stats.averageScore >= 90) {
      comment += '✅ **Excellent work!** The code quality is very high. Minor suggestions have been provided for further improvement.\n';
    } else if (stats.averageScore >= 75) {
      comment += '👍 **Good work!** The code is generally well-written with some areas for improvement.\n';
    } else if (stats.averageScore >= 60) {
      comment += '⚠️ **Needs attention.** Several issues have been identified that should be addressed before merging.\n';
    } else {
      comment += '🚨 **Significant issues found.** Please review and address the identified problems before proceeding.\n';
    }

    comment += '\n---\n';
    comment += '*Generated by AI Code Review Action* | [Report Issues](https://github.com/your-username/ai-code-review-action/issues)';

    return comment;
  }

  /**
   * Format individual issue comments
   */
  formatIssueComment(issue) {
    const typeEmojis = {
      error: '🚨',
      warning: '⚠️',
      suggestion: '💡'
    };

    const categoryEmojis = {
      security: '🔒',
      performance: '⚡',
      maintainability: '🔧',
      style: '🎨',
      logic: '🧠',
      'best-practices': '📚'
    };

    const emoji = typeEmojis[issue.type] || '💡';
    const categoryEmoji = categoryEmojis[issue.category] || '';

    let comment = `${emoji} **${issue.type.toUpperCase()}** ${categoryEmoji}\n\n`;
    comment += `${issue.message}\n\n`;

    if (issue.suggestion) {
      comment += `**Suggestion:**\n${issue.suggestion}\n\n`;
    }

    comment += `*Category: ${issue.category}*`;

    return comment;
  }

  /**
   * Calculate review statistics
   */
  calculateReviewStats(reviews) {
    const totalReviews = reviews.length;
    const totalScore = reviews.reduce((sum, review) => sum + review.score, 0);
    const averageScore = totalReviews > 0 ? Math.round(totalScore / totalReviews) : 0;

    let errorCount = 0;
    let warningCount = 0;
    let suggestionCount = 0;
    let securityIssues = 0;
    let performanceIssues = 0;

    for (const review of reviews) {
      for (const issue of review.issues) {
        switch (issue.type) {
        case 'error':
          errorCount++;
          break;
        case 'warning':
          warningCount++;
          break;
        case 'suggestion':
          suggestionCount++;
          break;
        }

        if (issue.category === 'security') {
          securityIssues++;
        }

        if (issue.category === 'performance') {
          performanceIssues++;
        }
      }
    }

    return {
      averageScore,
      errorCount,
      warningCount,
      suggestionCount,
      securityIssues,
      performanceIssues
    };
  }

  /**
   * Get emoji based on score
   */
  getScoreEmoji(score) {
    if (score >= 90) return '🟢';
    if (score >= 75) return '🟡';
    if (score >= 60) return '🟠';
    return '🔴';
  }

  /**
   * Determine review event based on issues found
   */
  determineReviewEvent(totalIssues) {
    if (totalIssues > 0) {
      return 'REQUEST_CHANGES';
    }
    return 'COMMENT';
  }
}

module.exports = { ReviewEngine };
