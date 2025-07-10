const github = require('@actions/github');
const core = require('@actions/core');

/**
 * Service for interacting with GitHub API
 */
class GitHubService {
  constructor(token) {
    this.octokit = github.getOctokit(token);
    this.context = github.context;
  }

  /**
   * Get changed files between two commits
   */
  async getChangedFiles(baseCommit, headCommit) {
    try {
      const response = await this.octokit.rest.repos.compareCommits({
        owner: this.context.repo.owner,
        repo: this.context.repo.repo,
        base: baseCommit,
        head: headCommit
      });

      return response.data.files || [];
    } catch (error) {
      core.error(`Failed to get changed files: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get file content from repository
   */
  async getFileContent(path, ref) {
    try {
      const response = await this.octokit.rest.repos.getContent({
        owner: this.context.repo.owner,
        repo: this.context.repo.repo,
        path: path,
        ref: ref
      });

      if (response.data.type === 'file') {
        return Buffer.from(response.data.content, 'base64').toString('utf-8');
      }

      throw new Error('Path is not a file');
    } catch (error) {
      if (error.status === 404) {
        return null; // File doesn't exist
      }
      throw error;
    }
  }

  /**
   * Post a comment on the pull request
   */
  async postComment(pullNumber, body) {
    try {
      const response = await this.octokit.rest.issues.createComment({
        owner: this.context.repo.owner,
        repo: this.context.repo.repo,
        issue_number: pullNumber,
        body: body
      });

      return response.data.html_url;
    } catch (error) {
      core.error(`Failed to post comment: ${error.message}`);
      throw error;
    }
  }

  /**
   * Post a review comment on specific lines
   */
  async postReviewComment(pullNumber, commitSha, path, line, body) {
    try {
      const response = await this.octokit.rest.pulls.createReviewComment({
        owner: this.context.repo.owner,
        repo: this.context.repo.repo,
        pull_number: pullNumber,
        commit_id: commitSha,
        path: path,
        line: line,
        body: body
      });

      return response.data;
    } catch (error) {
      core.warning(`Failed to post review comment on ${path}:${line}: ${error.message}`);
      return null;
    }
  }

  /**
   * Submit a pull request review
   */
  async submitReview(pullNumber, commitSha, body, event = 'COMMENT', comments = []) {
    try {
      const response = await this.octokit.rest.pulls.createReview({
        owner: this.context.repo.owner,
        repo: this.context.repo.repo,
        pull_number: pullNumber,
        commit_id: commitSha,
        body: body,
        event: event,
        comments: comments
      });

      return response.data;
    } catch (error) {
      core.error(`Failed to submit review: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get existing review comments to avoid duplicates
   */
  async getExistingReviewComments(pullNumber) {
    try {
      const comments = await this.octokit.paginate(
        this.octokit.rest.pulls.listReviewComments,
        {
          owner: this.context.repo.owner,
          repo: this.context.repo.repo,
          pull_number: pullNumber
        }
      );

      return comments;
    } catch (error) {
      core.warning(`Failed to get existing review comments: ${error.message}`);
      return [];
    }
  }

  /**
   * Check if user is a repository collaborator
   */
  async isCollaborator(username) {
    try {
      await this.octokit.rest.repos.checkCollaborator({
        owner: this.context.repo.owner,
        repo: this.context.repo.repo,
        username: username
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}

module.exports = { GitHubService };
