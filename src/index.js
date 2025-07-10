const core = require('@actions/core');
const github = require('@actions/github');
const { ReviewEngine } = require('./review-engine');
const { GitHubService } = require('./github-service');
const { AIService } = require('./ai-service');
const { FileAnalyzer } = require('./file-analyzer');
const { ConfigValidator } = require('./config-validator');

/**
 * Main entry point for the AI Code Review Action
 */
async function run() {
  try {
    core.info('🚀 Starting AI Code Review Action...');

    // Validate configuration
    const config = ConfigValidator.validate();
    core.info(`✅ Configuration validated. Using ${config.aiProvider} with model ${config.model}`);

    // Initialize services
    const githubService = new GitHubService(config.githubToken);
    const aiService = new AIService(config);
    const fileAnalyzer = new FileAnalyzer(config);
    const reviewEngine = new ReviewEngine(githubService, aiService, fileAnalyzer, config);

    // Get PR context
    const context = github.context;
    if (context.eventName !== 'pull_request' && context.eventName !== 'pull_request_target') {
      core.warning('⚠️  This action is designed to run on pull request events');
      return;
    }

    const pullRequest = context.payload.pull_request;
    if (!pullRequest) {
      throw new Error('Pull request data not found in context');
    }

    core.info(`🔍 Reviewing PR #${pullRequest.number}: ${pullRequest.title}`);

    // Get changed files
    const changedFiles = await githubService.getChangedFiles(
      pullRequest.base.sha,
      pullRequest.head.sha
    );

    core.info(`📁 Found ${changedFiles.length} changed files`);

    // Filter files based on exclude patterns
    const filesToReview = fileAnalyzer.filterFiles(changedFiles);

    if (filesToReview.length === 0) {
      core.info('ℹ️  No files to review after applying filters');
      await githubService.postComment(pullRequest.number,
        '🤖 **AI Code Review**: No files found for review after applying exclusion filters.');
      return;
    }

    core.info(`📝 Reviewing ${filesToReview.length} files...`);

    // Perform the review
    const reviewResult = await reviewEngine.performReview(
      pullRequest.number,
      filesToReview,
      pullRequest.base.sha,
      pullRequest.head.sha
    );

    // Set outputs
    core.setOutput('review-summary', reviewResult.summary);
    core.setOutput('issues-found', reviewResult.issuesFound.toString());
    core.setOutput('files-reviewed', reviewResult.filesReviewed.toString());
    core.setOutput('review-url', reviewResult.reviewUrl || '');

    core.info('✅ AI Code Review completed successfully!');

  } catch (error) {
    core.error(`❌ Error during code review: ${error.message}`);
    core.debug(error.stack);
    core.setFailed(error.message);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  core.error(`Unhandled promise rejection: ${error.message}`);
  core.setFailed(error.message);
});

// Run the action
if (require.main === module) {
  run();
}

module.exports = { run };
