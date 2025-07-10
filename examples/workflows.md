# Example Workflow Configurations

## Basic Usage

```yaml
name: Code Review
on:
  pull_request:
    types: [opened, synchronize, reopened]

permissions:
  contents: read
  pull-requests: write

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: anufdo/ai-code-review-action@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          openai-api-key: ${{ secrets.OPENAI_API_KEY }}
```

## Advanced Configuration

```yaml
name: Comprehensive Code Review
on:
  pull_request:
    types: [opened, synchronize, reopened]

permissions:
  contents: read
  pull-requests: write

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: anufdo/ai-code-review-action@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          openai-api-key: ${{ secrets.OPENAI_API_KEY }}
          ai-provider: 'openai'
          model: 'gpt-4'
          review-level: 'detailed'
          max-files: 25
          exclude-patterns: '*.lock,*.min.js,*.map,node_modules/**,dist/**,coverage/**'
          enable-security-review: true
          enable-performance-review: true
          enable-best-practices: true
          language-hints: 'javascript,typescript,python'
          custom-prompts: |
            {
              "security": "Pay special attention to authentication and authorization",
              "performance": "Focus on database queries and API efficiency"
            }
```

## Using Anthropic Claude

```yaml
name: Code Review with Claude
on:
  pull_request:
    types: [opened, synchronize, reopened]

permissions:
  contents: read
  pull-requests: write

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: anufdo/ai-code-review-action@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          anthropic-api-key: ${{ secrets.ANTHROPIC_API_KEY }}
          ai-provider: 'anthropic'
          model: 'claude-3-sonnet-20240229'
          review-level: 'standard'
```

## Conditional Review (only for specific files)

```yaml
name: Conditional Code Review
on:
  pull_request:
    types: [opened, synchronize, reopened]
    paths:
      - 'src/**'
      - 'lib/**'
      - '!src/tests/**'

permissions:
  contents: read
  pull-requests: write

jobs:
  review:
    runs-on: ubuntu-latest
    if: github.event.pull_request.draft == false
    steps:
      - uses: anufdo/ai-code-review-action@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          openai-api-key: ${{ secrets.OPENAI_API_KEY }}
          review-level: 'basic'
          max-files: 15
```

## Multi-environment Setup

```yaml
name: Environment-specific Review
on:
  pull_request:
    types: [opened, synchronize, reopened]

permissions:
  contents: read
  pull-requests: write

jobs:
  security-review:
    runs-on: ubuntu-latest
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
          custom-prompts: |
            {
              "security": "Conduct a thorough security audit focusing on vulnerabilities, input validation, and secure coding practices"
            }

  performance-review:
    runs-on: ubuntu-latest
    if: contains(github.event.pull_request.labels.*.name, 'performance')
    steps:
      - uses: anufdo/ai-code-review-action@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          openai-api-key: ${{ secrets.OPENAI_API_KEY }}
          review-level: 'detailed'
          enable-security-review: false
          enable-performance-review: true
          enable-best-practices: false
```

## Using OpenRouter

```yaml
name: Code Review with OpenRouter
on:
  pull_request:
    types: [opened, synchronize, reopened]

permissions:
  contents: read
  pull-requests: write

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: anufdo/ai-code-review-action@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          openrouter-api-key: ${{ secrets.OPENROUTER_API_KEY }}
          ai-provider: 'openrouter'
          model: 'anthropic/claude-3-sonnet'
          review-level: 'detailed'
          enable-security-review: true
```

## OpenRouter with Custom Base URL

```yaml
name: OpenRouter Custom Configuration
on:
  pull_request:
    types: [opened, synchronize, reopened]

permissions:
  contents: read
  pull-requests: write

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: anufdo/ai-code-review-action@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          openrouter-api-key: ${{ secrets.OPENROUTER_API_KEY }}
          openrouter-base-url: 'https://openrouter.ai/api/v1'
          ai-provider: 'openrouter'
          model: 'openai/gpt-4-turbo-preview'
          review-level: 'standard'
          max-files: 20
```

## Multi-Provider Strategy (Matrix Build)

```yaml
name: Multi-Provider Code Review
on:
  pull_request:
    types: [opened, synchronize, reopened]

permissions:
  contents: read
  pull-requests: write

jobs:
  review:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        provider:
          - name: 'OpenAI GPT-4'
            provider: 'openai'
            model: 'gpt-4'
            api_key_secret: 'OPENAI_API_KEY'
          - name: 'Anthropic Claude'
            provider: 'anthropic'
            model: 'claude-3-sonnet-20240229'
            api_key_secret: 'ANTHROPIC_API_KEY'
          - name: 'OpenRouter Claude'
            provider: 'openrouter'
            model: 'anthropic/claude-3-sonnet'
            api_key_secret: 'OPENROUTER_API_KEY'
    name: Review with ${{ matrix.provider.name }}
    steps:
      - uses: anufdo/ai-code-review-action@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          openai-api-key: ${{ matrix.provider.provider == 'openai' && secrets[matrix.provider.api_key_secret] || '' }}
          anthropic-api-key: ${{ matrix.provider.provider == 'anthropic' && secrets[matrix.provider.api_key_secret] || '' }}
          openrouter-api-key: ${{ matrix.provider.provider == 'openrouter' && secrets[matrix.provider.api_key_secret] || '' }}
          ai-provider: ${{ matrix.provider.provider }}
          model: ${{ matrix.provider.model }}
          review-level: 'standard'
```

## Cost-Optimized Review

```yaml
name: Cost-Optimized Review
on:
  pull_request:
    types: [opened, synchronize, reopened]

permissions:
  contents: read
  pull-requests: write

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: anufdo/ai-code-review-action@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          openrouter-api-key: ${{ secrets.OPENROUTER_API_KEY }}
          ai-provider: 'openrouter'
          model: 'meta-llama/llama-3-8b-instruct'  # Cost-effective option
          review-level: 'basic'
          max-files: 10
          exclude-patterns: '*.lock,*.min.js,*.map,node_modules/**,dist/**,build/**,coverage/**,.git/**'
```

## Enterprise Configuration with Fallback

```yaml
name: Enterprise Code Review with Fallback
on:
  pull_request:
    types: [opened, synchronize, reopened]

permissions:
  contents: read
  pull-requests: write

jobs:
  primary-review:
    runs-on: ubuntu-latest
    continue-on-error: true
    outputs:
      success: ${{ steps.review.outcome == 'success' }}
    steps:
      - id: review
        uses: anufdo/ai-code-review-action@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          openai-api-key: ${{ secrets.OPENAI_API_KEY }}
          ai-provider: 'openai'
          model: 'gpt-4'
          review-level: 'detailed'
          enable-security-review: true
          enable-performance-review: true

  fallback-review:
    runs-on: ubuntu-latest
    needs: primary-review
    if: needs.primary-review.outputs.success != 'true'
    steps:
      - uses: anufdo/ai-code-review-action@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          openrouter-api-key: ${{ secrets.OPENROUTER_API_KEY }}
          ai-provider: 'openrouter'
          model: 'anthropic/claude-3-haiku'
          review-level: 'standard'
```

## Team-Specific Configuration

```yaml
name: Team-Specific Review Rules
on:
  pull_request:
    types: [opened, synchronize, reopened]

permissions:
  contents: read
  pull-requests: write

jobs:
  frontend-review:
    runs-on: ubuntu-latest
    if: contains(github.event.pull_request.changed_files, 'frontend/') || contains(github.event.pull_request.changed_files, 'ui/')
    steps:
      - uses: anufdo/ai-code-review-action@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          openrouter-api-key: ${{ secrets.OPENROUTER_API_KEY }}
          ai-provider: 'openrouter'
          model: 'openai/gpt-4-turbo-preview'
          review-level: 'detailed'
          language-hints: 'javascript,typescript,react,vue,css'
          custom-prompts: |
            {
              "ui": "Focus on accessibility, responsive design, and user experience",
              "performance": "Check for unnecessary re-renders and bundle size impact"
            }

  backend-review:
    runs-on: ubuntu-latest
    if: contains(github.event.pull_request.changed_files, 'backend/') || contains(github.event.pull_request.changed_files, 'api/')
    steps:
      - uses: anufdo/ai-code-review-action@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          anthropic-api-key: ${{ secrets.ANTHROPIC_API_KEY }}
          ai-provider: 'anthropic'
          model: 'claude-3-sonnet-20240229'
          review-level: 'detailed'
          enable-security-review: true
          language-hints: 'python,node,java,go'
          custom-prompts: |
            {
              "security": "Focus on SQL injection, authentication, and data validation",
              "performance": "Check database queries, caching strategies, and API efficiency"
            }
```

## Size-Based Review Strategy

```yaml
name: Size-Based Review Strategy
on:
  pull_request:
    types: [opened, synchronize, reopened]

permissions:
  contents: read
  pull-requests: write

jobs:
  quick-review:
    runs-on: ubuntu-latest
    if: github.event.pull_request.changed_files <= 5
    steps:
      - uses: anufdo/ai-code-review-action@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          openrouter-api-key: ${{ secrets.OPENROUTER_API_KEY }}
          ai-provider: 'openrouter'
          model: 'meta-llama/llama-3-8b-instruct'
          review-level: 'basic'

  standard-review:
    runs-on: ubuntu-latest
    if: github.event.pull_request.changed_files > 5 && github.event.pull_request.changed_files <= 20
    steps:
      - uses: anufdo/ai-code-review-action@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          openai-api-key: ${{ secrets.OPENAI_API_KEY }}
          ai-provider: 'openai'
          model: 'gpt-3.5-turbo'
          review-level: 'standard'

  comprehensive-review:
    runs-on: ubuntu-latest
    if: github.event.pull_request.changed_files > 20
    steps:
      - uses: anufdo/ai-code-review-action@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          anthropic-api-key: ${{ secrets.ANTHROPIC_API_KEY }}
          ai-provider: 'anthropic'
          model: 'claude-3-sonnet-20240229'
          review-level: 'detailed'
          enable-security-review: true
          enable-performance-review: true
```

## Scheduled Dependency Review

```yaml
name: Weekly Dependency Review
on:
  schedule:
    - cron: '0 10 * * 1'  # Every Monday at 10 AM
  workflow_dispatch:

permissions:
  contents: read
  issues: write

jobs:
  dependency-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: anufdo/ai-code-review-action@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          openrouter-api-key: ${{ secrets.OPENROUTER_API_KEY }}
          ai-provider: 'openrouter'
          model: 'anthropic/claude-3-sonnet'
          review-level: 'detailed'
          enable-security-review: true
          include-patterns: 'package*.json,requirements*.txt,Gemfile*,go.mod,Cargo.toml'
          custom-prompts: |
            {
              "security": "Analyze dependencies for known vulnerabilities and security issues",
              "maintenance": "Check for outdated packages and suggest updates"
            }
```

## Best Practices and Tips

### 1. API Key Management
- Always use GitHub Secrets for API keys
- Never commit API keys to your repository
- Use different secrets for different environments (dev, staging, prod)

### 2. Cost Optimization
- Use smaller models for basic reviews (`gpt-3.5-turbo`, `claude-3-haiku`)
- Limit file count with `max-files` parameter
- Use exclude patterns to skip non-essential files
- Consider OpenRouter for cost-effective access to multiple models

### 3. Performance Tips
- Use `review-level: 'basic'` for draft PRs
- Enable specific review types only when needed
- Use conditional workflows based on file changes
- Set appropriate timeouts for large PRs

### 4. Model Selection Guidelines

#### OpenAI Models
- `gpt-4`: Best for complex code analysis, highest cost
- `gpt-3.5-turbo`: Good balance of quality and cost
- `gpt-4-turbo-preview`: Latest features, good performance

#### Anthropic Models
- `claude-3-opus`: Highest quality, most expensive
- `claude-3-sonnet`: Good balance for most use cases
- `claude-3-haiku`: Fast and cost-effective

#### OpenRouter Options
- `anthropic/claude-3-sonnet`: Access Claude via OpenRouter
- `openai/gpt-4-turbo-preview`: Access GPT-4 via OpenRouter
- `meta-llama/llama-3-8b-instruct`: Open-source, cost-effective
- `mistralai/mistral-7b-instruct`: Fast and efficient

### 5. Security Considerations
- Enable security reviews for production code
- Use detailed review levels for security-critical changes
- Consider separate security-focused workflows
- Regularly review and rotate API keys
