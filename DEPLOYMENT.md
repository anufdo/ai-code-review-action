# Deployment Guide

This guide will help you deploy and use the AI Code Review Action in your GitHub repository.

## 🚀 Quick Deployment

### Step 1: Get API Keys

#### Option A: OpenAI (Recommended)
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key (starts with `sk-`)

#### Option B: Anthropic Claude
1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Sign up or log in to your account
3. Navigate to API Keys
4. Create a new API key
5. Copy the key

### Step 2: Add Secrets to Repository

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add one of these secrets:
   - Name: `OPENAI_API_KEY`, Value: your OpenAI API key
   - Name: `ANTHROPIC_API_KEY`, Value: your Anthropic API key

### Step 3: Create Workflow File

Create `.github/workflows/ai-code-review.yml` in your repository:

```yaml
name: AI Code Review
on:
  pull_request:
    types: [opened, synchronize, reopened]

permissions:
  contents: read
  pull-requests: write
  issues: write

jobs:
  ai-review:
    runs-on: ubuntu-latest
    if: github.event.pull_request.draft == false
    
    steps:
      - name: AI Code Review
        uses: anufdo/ai-code-review-action@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          openai-api-key: ${{ secrets.OPENAI_API_KEY }}
          # anthropic-api-key: ${{ secrets.ANTHROPIC_API_KEY }} # Alternative
          ai-provider: 'openai'
          model: 'gpt-4'
          review-level: 'standard'
          max-files: 20
          exclude-patterns: '*.lock,*.min.js,*.map,node_modules/**,dist/**'
          enable-security-review: true
          enable-performance-review: true
          enable-best-practices: true
```

### Step 4: Test the Action

1. Create a pull request with some code changes
2. The action will automatically run and provide feedback
3. Check the PR comments for the AI review

## ⚙️ Advanced Configuration

### Environment-Specific Settings

```yaml
# For development repositories
- uses: anufdo/ai-code-review-action@v1
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    openai-api-key: ${{ secrets.OPENAI_API_KEY }}
    review-level: 'basic'
    max-files: 15
    enable-security-review: true

# For production repositories
- uses: anufdo/ai-code-review-action@v1
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    openai-api-key: ${{ secrets.OPENAI_API_KEY }}
    review-level: 'detailed'
    max-files: 25
    enable-security-review: true
    enable-performance-review: true
    custom-prompts: |
      {
        "security": "Focus on authentication, authorization, and data validation",
        "performance": "Analyze database queries, API calls, and algorithm efficiency"
      }
```

### Conditional Reviews

```yaml
# Only review specific file types
on:
  pull_request:
    paths:
      - 'src/**'
      - 'lib/**'
      - '!**/*.test.js'

# Only review non-draft PRs
jobs:
  ai-review:
    if: github.event.pull_request.draft == false

# Only review PRs with specific labels
jobs:
  ai-review:
    if: contains(github.event.pull_request.labels.*.name, 'needs-review')
```

### Multiple Review Types

```yaml
jobs:
  security-review:
    if: contains(github.event.pull_request.labels.*.name, 'security')
    steps:
      - uses: anufdo/ai-code-review-action@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          openai-api-key: ${{ secrets.OPENAI_API_KEY }}
          review-level: 'detailed'
          enable-security-review: true
          enable-performance-review: false
          enable-best-practices: false

  performance-review:
    if: contains(github.event.pull_request.labels.*.name, 'performance')
    steps:
      - uses: anufdo/ai-code-review-action@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          openai-api-key: ${{ secrets.OPENAI_API_KEY }}
          review-level: 'detailed'
          enable-performance-review: true
          enable-security-review: false
```

## 🔧 Troubleshooting

### Common Issues

#### 1. Action Not Running
- Check that the workflow file is in `.github/workflows/`
- Ensure the trigger events match your use case
- Verify repository permissions

#### 2. API Key Issues
- Confirm the secret name matches the workflow input
- Check that the API key is valid and has credits
- Verify the AI provider setting matches your key type

#### 3. Permission Errors
- Ensure the workflow has `pull-requests: write` permission
- Check if branch protection rules are blocking the action
- Verify the GITHUB_TOKEN has sufficient permissions

#### 4. No Comments Posted
- Check the action logs for errors
- Verify the exclude patterns aren't filtering all files
- Ensure the files are in supported languages

### Debugging Steps

1. **Check Action Logs**
   ```yaml
   - uses: anufdo/ai-code-review-action@v1
     with:
       # ... other inputs
     env:
       ACTIONS_STEP_DEBUG: true
   ```

2. **Test with Minimal Configuration**
   ```yaml
   - uses: anufdo/ai-code-review-action@v1
     with:
       github-token: ${{ secrets.GITHUB_TOKEN }}
       openai-api-key: ${{ secrets.OPENAI_API_KEY }}
   ```

3. **Check File Patterns**
   - Review the `exclude-patterns` setting
   - Test with a simple file like `test.js`

## 📊 Cost Optimization

### Reducing API Costs

1. **Limit File Count**
   ```yaml
   max-files: 10  # Reduce from default 20
   ```

2. **Use Basic Review Level**
   ```yaml
   review-level: 'basic'  # Less detailed analysis
   ```

3. **Smart Exclusions**
   ```yaml
   exclude-patterns: '*.lock,*.min.js,*.map,node_modules/**,dist/**,coverage/**,*.svg,*.png'
   ```

4. **Conditional Reviews**
   ```yaml
   # Only review PRs with more than 5 files changed
   if: github.event.pull_request.changed_files > 5
   ```

### Cost Estimation

- **GPT-4**: ~$0.01-0.05 per file reviewed
- **GPT-3.5**: ~$0.001-0.01 per file reviewed
- **Claude**: ~$0.01-0.03 per file reviewed

*Costs vary based on file size and review complexity*

## 🔒 Security Best Practices

### Repository Secrets
- Use repository secrets, not environment variables
- Regularly rotate API keys
- Use least-privilege API keys when possible

### Workflow Security
```yaml
permissions:
  contents: read      # Minimum required
  pull-requests: write # For posting comments
  # Don't grant unnecessary permissions
```

### Private Repositories
- Ensure your AI provider's terms allow code analysis
- Consider self-hosted runners for sensitive code
- Review data retention policies

## 📈 Monitoring and Analytics

### Track Review Quality
- Monitor the action outputs
- Collect feedback on review accuracy
- Track issues caught vs. missed

### Usage Analytics
```yaml
- name: Track Usage
  run: |
    echo "Files reviewed: ${{ steps.review.outputs.files-reviewed }}"
    echo "Issues found: ${{ steps.review.outputs.issues-found }}"
    echo "Review score: ${{ steps.review.outputs.review-summary }}"
```

## 🆙 Upgrading

### Version Pinning
```yaml
# Pin to specific version (recommended)
uses: anufdo/ai-code-review-action@v1.2.3

# Use latest major version
uses: anufdo/ai-code-review-action@v1

# Use latest (not recommended for production)
uses: anufdo/ai-code-review-action@main
```

### Migration Guide
When upgrading between major versions:
1. Check the changelog for breaking changes
2. Update your workflow configuration
3. Test with a non-critical PR first
4. Monitor for any issues

## 🆘 Support

### Getting Help
1. Check the [troubleshooting guide](#troubleshooting)
2. Search [existing issues](https://github.com/anufdo/ai-code-review-action/issues)
3. Create a new issue with:
   - Workflow configuration
   - Error logs
   - Example PR link

### Feature Requests
- Use the [discussions](https://github.com/your-username/ai-code-review-action/discussions) for ideas
- Create an issue for specific feature requests
- Include use cases and examples

---

**Need more help?** Check our [FAQ](FAQ.md) or [create an issue](https://github.com/anufdo/ai-code-review-action/issues/new).
