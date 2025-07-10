# Contributing to AI Code Review Action

Thank you for your interest in contributing to the AI Code Review Action! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites

- Node.js 20 or higher
- npm or yarn
- Git
- Basic knowledge of GitHub Actions

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/ai-code-review-action.git
   cd ai-code-review-action
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Run Tests**
   ```bash
   npm test
   ```

4. **Build the Action**
   ```bash
   npm run build
   ```

## 🛠️ Development Workflow

### Project Structure

```
├── src/                  # Source code
│   ├── index.js         # Main entry point
│   ├── ai-service.js    # AI provider integrations
│   ├── github-service.js # GitHub API interactions
│   ├── file-analyzer.js # File analysis and filtering
│   ├── review-engine.js # Main review orchestration
│   └── config-validator.js # Configuration validation
├── tests/               # Test files
├── examples/            # Example configurations
├── .github/workflows/   # CI/CD workflows
├── dist/               # Built action (auto-generated)
├── action.yml          # Action definition
└── package.json        # Dependencies and scripts
```

### Making Changes

1. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Your Changes**
   - Follow the existing code style
   - Add tests for new functionality
   - Update documentation as needed

3. **Run Tests and Linting**
   ```bash
   npm test
   npm run lint
   npm run build
   ```

4. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

## 📝 Coding Standards

### Code Style

- Use 2 spaces for indentation
- Use single quotes for strings
- Add semicolons at the end of statements
- Use meaningful variable and function names
- Add JSDoc comments for functions

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` new feature
- `fix:` bug fix
- `docs:` documentation changes
- `style:` formatting changes
- `refactor:` code refactoring
- `test:` adding or updating tests
- `chore:` maintenance tasks

Examples:
```
feat: add support for Anthropic Claude API
fix: handle empty file content gracefully
docs: update README with new configuration options
test: add unit tests for file analyzer
```

### Testing

- Write unit tests for new functions and classes
- Aim for high test coverage (>80%)
- Test both success and error scenarios
- Use descriptive test names

```javascript
describe('FileAnalyzer', () => {
  describe('detectLanguage', () => {
    it('should detect JavaScript files correctly', () => {
      // Test implementation
    });
  });
});
```

## 🧪 Testing Guidelines

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test tests/file-analyzer.test.js
```

### Writing Tests

1. **Test Structure**: Use `describe` and `it` blocks for organization
2. **Mocking**: Mock external dependencies (GitHub API, AI APIs)
3. **Assertions**: Use Jest matchers for clear assertions
4. **Coverage**: Aim to test all code paths

### Integration Testing

Before submitting a PR, test the action manually:

1. Create a test repository
2. Add the action to a workflow
3. Create a test PR with code changes
4. Verify the action runs and provides expected output

## 🔧 Adding New Features

### AI Provider Integration

To add a new AI provider:

1. **Extend AIService**: Add provider-specific methods
2. **Update Configuration**: Add new provider to config validation
3. **Add Tests**: Create tests for the new provider
4. **Update Documentation**: Add usage examples

```javascript
// Example: Adding a new provider
async callNewProvider(prompt) {
  // Implementation for new AI provider
}
```

### Language Support

To add support for a new programming language:

1. **Update FileAnalyzer**: Add file extensions and language mapping
2. **Add Language-specific Prompts**: Customize review prompts
3. **Test with Sample Files**: Ensure proper detection and analysis

### Review Features

To add new review capabilities:

1. **Extend Review Prompts**: Add specific analysis instructions
2. **Update Response Parsing**: Handle new response formats
3. **Add Configuration Options**: Allow users to enable/disable features
4. **Document the Feature**: Update README and examples

## 📋 Pull Request Process

### Before Submitting

- [ ] Tests pass locally (`npm test`)
- [ ] Code is linted (`npm run lint`)
- [ ] Action builds successfully (`npm run build`)
- [ ] Documentation is updated
- [ ] Changes are tested manually

### PR Description

Include in your PR description:

1. **What**: Brief description of changes
2. **Why**: Reason for the changes
3. **How**: Technical approach taken
4. **Testing**: How you tested the changes
5. **Screenshots**: If applicable, show before/after

### Review Process

1. **Automated Checks**: CI pipeline must pass
2. **Code Review**: Maintainers will review your code
3. **Feedback**: Address any requested changes
4. **Approval**: Once approved, your PR will be merged

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Description**: Clear description of the issue
2. **Steps to Reproduce**: Detailed steps to recreate the bug
3. **Expected Behavior**: What should have happened
4. **Actual Behavior**: What actually happened
5. **Environment**: OS, Node version, GitHub Actions runner
6. **Logs**: Relevant error messages or logs

## 💡 Feature Requests

For feature requests, please provide:

1. **Use Case**: Why is this feature needed?
2. **Description**: What should the feature do?
3. **Examples**: How would it be used?
4. **Alternatives**: Any workarounds or alternatives considered?

## 📚 Resources

### Helpful Links

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Anthropic API Documentation](https://docs.anthropic.com/)
- [Jest Testing Framework](https://jestjs.io/docs/getting-started)

### Code Examples

- [GitHub Actions Toolkit](https://github.com/actions/toolkit)
- [Octokit.js](https://github.com/octokit/octokit.js)
- [Example GitHub Actions](https://github.com/actions)

## ❓ Getting Help

- **GitHub Discussions**: Ask questions in the repository discussions
- **Issues**: Report bugs or request features
- **Documentation**: Check the README and examples
- **Code**: Look at existing implementation for reference

## 🙏 Recognition

Contributors will be recognized in:

- README.md contributors section
- Release notes for significant contributions
- GitHub contributors page

Thank you for contributing to making code reviews better for everyone! 🎉
