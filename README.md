# 🤖 AI Code Review Action

A comprehensive GitHub Action that performs intelligent, AI-powered code reviews on pull requests. Get detailed feedback on code quality, security, performance, and best practices using OpenAI GPT-4 or Anthropic Claude.

## ✨ Features

- **🧠 AI-Powered Analysis**: Uses advanced AI models (GPT-4, Claude) for intelligent code review
- **🔒 Security-Focused**: Identifies security vulnerabilities and best practices
- **⚡ Performance Aware**: Spots performance issues and optimization opportunities  
- **📚 Best Practices**: Enforces coding standards and maintainability principles
- **🎯 Customizable**: Configurable review levels, exclusion patterns, and custom prompts
- **📊 Comprehensive Reports**: Detailed feedback with scores, statistics, and actionable suggestions
- **🔧 Multi-Language**: Supports 25+ programming languages
- **💬 Inline Comments**: Posts specific feedback directly on problematic lines
- **📈 Review Summary**: Provides overview with metrics and recommendations

## 🚀 Quick Start

### Basic Usage

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

### Advanced Configuration

```yaml
- uses: anufdo/ai-code-review-action@v1
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    openai-api-key: ${{ secrets.OPENAI_API_KEY }}
    ai-provider: 'openai'
    model: 'gpt-4'
    review-level: 'detailed'
    max-files: 25
    exclude-patterns: '*.lock,*.min.js,node_modules/**'
    enable-security-review: true
    enable-performance-review: true
    enable-best-practices: true
```

### OpenRouter Configuration

```yaml
- uses: anufdo/ai-code-review-action@v1
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    openrouter-api-key: ${{ secrets.OPENROUTER_API_KEY }}
    ai-provider: 'openrouter'
    model: 'anthropic/claude-3-sonnet'  # Or any OpenRouter supported model
    review-level: 'standard'
    max-files: 20
```

#### Popular OpenRouter Models
- `anthropic/claude-3-sonnet` - Anthropic's Claude 3 Sonnet
- `anthropic/claude-3-haiku` - Anthropic's Claude 3 Haiku (faster)
- `openai/gpt-4` - OpenAI's GPT-4
- `openai/gpt-3.5-turbo` - OpenAI's GPT-3.5 Turbo
- `meta-llama/llama-3-70b-instruct` - Meta's Llama 3 70B
- `google/gemini-pro` - Google's Gemini Pro
- `mistralai/mistral-7b-instruct` - Mistral 7B Instruct

## ⚙️ Configuration

### Inputs

| Input | Description | Required | Default |
|-------|-------------|----------|---------|
| `github-token` | GitHub token for API access | ✅ | `${{ github.token }}` |
| `openai-api-key` | OpenAI API key | ❌* | - |
| `anthropic-api-key` | Anthropic API key | ❌* | - |
| `openrouter-api-key` | OpenRouter API key | ❌* | - |
| `ai-provider` | AI provider (`openai`, `anthropic`, `openrouter`) | ❌ | `openai` |
| `model` | AI model to use (see model list for OpenRouter) | ❌ | `gpt-4` |
| `openrouter-base-url` | OpenRouter base URL | ❌ | `https://openrouter.ai/api/v1` |
| `max-files` | Maximum files to review | ❌ | `20` |
| `exclude-patterns` | File patterns to exclude | ❌ | `*.lock,*.min.js,*.map,node_modules/**` |
| `review-level` | Review depth (`basic`, `standard`, `detailed`) | ❌ | `standard` |
| `language-hints` | Programming languages in project | ❌ | Auto-detected |
| `custom-prompts` | Custom review prompts (JSON) | ❌ | - |
| `enable-security-review` | Enable security analysis | ❌ | `true` |
| `enable-performance-review` | Enable performance analysis | ❌ | `true` |
| `enable-best-practices` | Enable best practices review | ❌ | `true` |

*One of `openai-api-key`, `anthropic-api-key`, or `openrouter-api-key` is required depending on the AI provider.

### Outputs

| Output | Description |
|--------|-------------|
| `review-summary` | Summary of the code review |
| `issues-found` | Number of issues found |
| `files-reviewed` | Number of files reviewed |
| `review-url` | URL to the review comment |

## 🔧 Setup Instructions

### 1. Add API Key Secrets

Go to your repository **Settings** → **Secrets and variables** → **Actions** and add:

**For OpenAI:**
- `OPENAI_API_KEY`: Your OpenAI API key

**For Anthropic:**
- `ANTHROPIC_API_KEY`: Your Anthropic API key

**For OpenRouter:**
- `OPENROUTER_API_KEY`: Your OpenRouter API key

> **Note**: OpenRouter provides access to multiple AI models through a single API. Get your API key at [openrouter.ai](https://openrouter.ai)

### 2. Create Workflow File

Create `.github/workflows/code-review.yml`:

```yaml
name: AI Code Review
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

### 3. Customize Configuration

Adjust the inputs based on your needs. See [examples](examples/workflows.md) for more configurations.

## 🎯 Review Levels

### Basic
- Syntax errors and obvious bugs
- Basic security issues
- Simple performance problems

### Standard (Default)
- Code quality and maintainability
- Common security vulnerabilities
- Performance implications
- Basic best practices

### Detailed
- Deep architectural analysis
- Advanced security audit
- Comprehensive performance review
- Advanced optimization suggestions
- Design pattern recommendations

## 🔒 Security & Privacy

- **No Code Storage**: Your code is only sent to the AI provider for analysis and not stored
- **Secure Communication**: All API calls use HTTPS encryption
- **Token Permissions**: Requires minimal GitHub permissions (read contents, write PR comments)
- **Configurable**: You control what files are reviewed via exclude patterns

## 🌐 Supported Languages

- **Web**: JavaScript, TypeScript, HTML, CSS, SCSS, Vue, React, Svelte
- **Backend**: Python, Java, C#, Go, Rust, PHP, Ruby, Node.js
- **Mobile**: Swift, Kotlin, Dart (Flutter), React Native
- **Systems**: C, C++, Rust, Go, Assembly
- **Data**: SQL, R, Python, Scala, MATLAB
- **Config**: YAML, JSON, XML, TOML
- **Scripts**: Bash, PowerShell, Perl, Lua
- **And more**: 25+ languages supported

## 📊 Example Review Output

The action provides comprehensive feedback including:

- **Overall Score**: Code quality score (0-100)
- **Issue Breakdown**: Errors, warnings, and suggestions by category
- **File-by-file Analysis**: Detailed review of each changed file
- **Inline Comments**: Specific feedback on problematic lines
- **Security Assessment**: Security vulnerabilities and recommendations
- **Performance Analysis**: Performance bottlenecks and optimizations
- **Best Practices**: Code style and maintainability suggestions

## 🛠️ Development

### Prerequisites

- Node.js 20+
- npm or yarn

### Local Development

```bash
# Clone the repository
git clone https://github.com/anufdo/ai-code-review-action.git
cd ai-code-review-action

# Install dependencies
npm install

# Run tests
npm test

# Build the action
npm run build

# Lint code
npm run lint
```

### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm test -- --coverage
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass (`npm test`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [OpenAI](https://openai.com/) for GPT-4 API
- [Anthropic](https://www.anthropic.com/) for Claude API
- [GitHub Actions](https://github.com/features/actions) platform
- Inspired by [CodeRabbit](https://coderabbit.ai/) and [DiffGuard](https://github.com/jonit-dev/diffguard)

## 📞 Support

- [Create an Issue](https://github.com/anufdo/ai-code-review-action/issues) for bug reports or feature requests
- [Discussions](https://github.com/anufdo/ai-code-review-action/discussions) for questions and community support
- Check out [example workflows](examples/workflows.md) for common use cases

---

**Made with ❤️ by the AI Code Review Team**
