# Project Structure

This document outlines the structure and organization of the AI Code Review Action project.

## 📁 Directory Structure

```
ai-code-review-action/
├── 📄 README.md                     # Main documentation
├── 📄 LICENSE                       # MIT License
├── 📄 CONTRIBUTING.md               # Contribution guidelines
├── 📄 DEPLOYMENT.md                 # Deployment guide
├── 📄 SECURITY.md                   # Security policy
├── 📄 action.yml                    # GitHub Action definition
├── 📄 package.json                  # Node.js dependencies
├── 📄 package-lock.json             # Dependency lock file
├── 📄 .gitignore                    # Git ignore rules
├── 📄 .eslintrc.json               # ESLint configuration
├── 📄 .prettierrc.json             # Prettier configuration
├── 📄 jest.config.js               # Jest test configuration
│
├── 📂 src/                          # Source code
│   ├── 📄 index.js                  # Main entry point
│   ├── 📄 config-validator.js       # Configuration validation
│   ├── 📄 ai-service.js            # AI provider integrations
│   ├── 📄 github-service.js        # GitHub API interactions
│   ├── 📄 file-analyzer.js         # File analysis and filtering
│   └── 📄 review-engine.js         # Main review orchestration
│
├── 📂 tests/                        # Test files
│   ├── 📄 config-validator.test.js  # Config validator tests
│   └── 📄 file-analyzer.test.js    # File analyzer tests
│
├── 📂 examples/                     # Example configurations
│   └── 📄 workflows.md             # Example GitHub workflows
│
├── 📂 .github/                      # GitHub-specific files
│   └── 📂 workflows/               # GitHub Actions workflows
│       ├── 📄 ci.yml               # Continuous integration
│       └── 📄 code-review.yml      # Self-review workflow
│
└── 📂 dist/                         # Built action (auto-generated)
    └── 📄 index.js                  # Bundled action code
```

## 🧩 Core Components

### Main Entry Point (`src/index.js`)
- **Purpose**: Main entry point for the GitHub Action
- **Responsibilities**:
  - Initialize services and configuration
  - Orchestrate the review process
  - Handle errors and set outputs
  - Validate PR context

### Configuration Validator (`src/config-validator.js`)
- **Purpose**: Validates and processes action inputs
- **Responsibilities**:
  - Validate required inputs (API keys, tokens)
  - Process configuration options
  - Set default values
  - Parse JSON configurations

### AI Service (`src/ai-service.js`)
- **Purpose**: Interfaces with AI providers for code analysis
- **Responsibilities**:
  - OpenAI GPT integration
  - Anthropic Claude integration
  - Prompt engineering
  - Response parsing and validation
  - Error handling for AI API calls

### GitHub Service (`src/github-service.js`)
- **Purpose**: Handles all GitHub API interactions
- **Responsibilities**:
  - Fetch changed files and diffs
  - Retrieve file contents
  - Post review comments
  - Submit PR reviews
  - Manage review metadata

### File Analyzer (`src/file-analyzer.js`)
- **Purpose**: Analyzes and filters files for review
- **Responsibilities**:
  - Language detection
  - File filtering (patterns, size, type)
  - Priority calculation
  - Diff parsing
  - Binary file detection

### Review Engine (`src/review-engine.js`)
- **Purpose**: Orchestrates the complete review process
- **Responsibilities**:
  - Coordinate file analysis
  - Generate comprehensive reviews
  - Format review comments
  - Calculate review statistics
  - Handle review submission

## 🔧 Configuration Files

### Action Definition (`action.yml`)
- Defines inputs, outputs, and metadata
- Specifies Node.js runtime requirements
- Configures action branding

### Package Configuration (`package.json`)
- Lists all dependencies
- Defines build and test scripts
- Specifies Node.js version requirements

### Development Tools
- **ESLint** (`.eslintrc.json`): Code linting rules
- **Prettier** (`.prettierrc.json`): Code formatting rules
- **Jest** (`jest.config.js`): Test configuration

## 🧪 Testing Structure

### Unit Tests (`tests/`)
- **Config Validator Tests**: Input validation scenarios
- **File Analyzer Tests**: File detection and filtering logic
- **Coverage**: Aims for >80% code coverage

### Integration Tests
- GitHub API integration testing
- AI provider integration testing
- End-to-end workflow testing

## 🚀 Build Process

### Development Build
```bash
npm run build  # Bundles src/ into dist/index.js
```

### Testing
```bash
npm test       # Runs Jest test suite
npm run lint   # Runs ESLint
```

### Distribution
- **Source**: `src/` directory contains all source code
- **Built**: `dist/index.js` contains bundled action
- **GitHub Actions**: Uses `dist/index.js` as entry point

## 📝 Documentation Structure

### User Documentation
- **README.md**: Primary documentation and usage guide
- **DEPLOYMENT.md**: Step-by-step deployment instructions
- **examples/workflows.md**: Example configurations

### Developer Documentation
- **CONTRIBUTING.md**: Guidelines for contributors
- **SECURITY.md**: Security policies and practices
- **Project Structure** (this file): Code organization

### API Documentation
- JSDoc comments in source code
- Inline code documentation
- Function and class descriptions

## 🔄 Data Flow

```
1. GitHub PR Event
   ↓
2. Action Triggered (src/index.js)
   ↓
3. Configuration Validation (config-validator.js)
   ↓
4. GitHub API Calls (github-service.js)
   ↓ 
5. File Analysis (file-analyzer.js)
   ↓
6. AI Analysis (ai-service.js)
   ↓
7. Review Generation (review-engine.js)
   ↓
8. Comment Posting (github-service.js)
   ↓
9. Output Generation (index.js)
```

## 🏗️ Architecture Principles

### Separation of Concerns
- Each module has a single, well-defined responsibility
- Clear interfaces between components
- Minimal coupling between modules

### Error Handling
- Graceful degradation when services fail
- Comprehensive error logging
- User-friendly error messages

### Extensibility
- Plugin architecture for new AI providers
- Configurable review types and levels
- Modular design for easy feature addition

### Security
- Minimal required permissions
- Secure handling of API keys
- Input validation and sanitization

## 🔍 Code Quality Standards

### Coding Standards
- ESLint rules for consistency
- Prettier for code formatting
- JSDoc for documentation
- Conventional commit messages

### Testing Standards
- Unit tests for all core functions
- Integration tests for external services
- Minimum 80% code coverage
- Test-driven development approach

### Performance Considerations
- Efficient API usage (batching, caching)
- Streaming for large files
- Rate limiting respect
- Memory usage optimization

## 📊 Metrics and Monitoring

### Built-in Metrics
- Files processed count
- Issues found count
- Processing duration
- API call statistics

### Logging
- Structured logging format
- Different log levels (info, warn, error)
- No sensitive data in logs
- GitHub Actions friendly output

## 🔮 Future Enhancements

### Planned Features
- Support for additional AI providers
- Custom rule definitions
- Integration with code quality tools
- Advanced reporting and analytics

### Architecture Improvements
- Plugin system for extensions
- Configuration management UI
- Real-time review suggestions
- Machine learning feedback loop

---

This structure supports maintainability, testability, and extensibility while following GitHub Actions best practices.
