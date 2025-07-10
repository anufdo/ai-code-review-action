# Release Checklist

This checklist ensures that each release of the AI Code Review Action is properly tested, documented, and deployed.

## 🚀 Pre-Release Checklist

### Code Quality
- [ ] All tests pass (`npm test`)
- [ ] Code coverage is above 80%
- [ ] ESLint passes without errors (`npm run lint`)
- [ ] Code is properly formatted (`npm run format`)
- [ ] All TypeScript/JSDoc types are correct
- [ ] No security vulnerabilities in dependencies (`npm audit`)

### Functionality Testing
- [ ] Test with OpenAI API integration
- [ ] Test with Anthropic API integration
- [ ] Test file filtering and exclusion patterns
- [ ] Test different review levels (basic, standard, detailed)
- [ ] Test error handling scenarios
- [ ] Test with various file types and languages
- [ ] Test with large PRs (multiple files)
- [ ] Test with edge cases (empty files, binary files, etc.)

### Integration Testing
- [ ] Test action in a real GitHub repository
- [ ] Verify PR comments are posted correctly
- [ ] Test inline review comments
- [ ] Verify outputs are set correctly
- [ ] Test with different permission scenarios
- [ ] Test with draft PRs (should be skipped)

### Documentation
- [ ] README.md is up to date
- [ ] DEPLOYMENT.md reflects current setup process
- [ ] All example workflows are tested and working
- [ ] API documentation matches current inputs/outputs
- [ ] CHANGELOG.md is updated with new features/fixes
- [ ] Breaking changes are clearly documented

### Security Review
- [ ] Security policy is up to date
- [ ] No sensitive data in logs or outputs
- [ ] API keys are handled securely
- [ ] Minimum required permissions are requested
- [ ] Dependency vulnerabilities are resolved

## 📦 Build and Package

### Build Process
- [ ] Source code builds successfully (`npm run build`)
- [ ] `dist/index.js` is generated and includes all dependencies
- [ ] No build warnings or errors
- [ ] Bundle size is reasonable (<5MB)

### Version Management
- [ ] Version number updated in `package.json`
- [ ] Git tag matches package version
- [ ] CHANGELOG.md includes version entry
- [ ] Breaking changes follow semantic versioning

## 🧪 Release Testing

### Manual Testing Scenarios

#### Basic Functionality
- [ ] Create test repository
- [ ] Set up action with minimal configuration
- [ ] Create PR with simple JavaScript changes
- [ ] Verify review is posted

#### Advanced Features
- [ ] Test with custom prompts
- [ ] Test exclude patterns
- [ ] Test different AI providers
- [ ] Test various review levels
- [ ] Test file prioritization

#### Error Scenarios
- [ ] Test with invalid API key
- [ ] Test with network failures
- [ ] Test with malformed configuration
- [ ] Test with permission issues

### Automated Testing
- [ ] CI pipeline passes
- [ ] Integration tests complete successfully
- [ ] Security scans pass
- [ ] Performance tests within acceptable limits

## 📝 Documentation Updates

### User-Facing Documentation
- [ ] README installation instructions
- [ ] Usage examples are current
- [ ] Configuration options documented
- [ ] Troubleshooting guide updated
- [ ] FAQ updated with common issues

### Developer Documentation
- [ ] API documentation complete
- [ ] Architecture documentation current
- [ ] Contributing guidelines updated
- [ ] Code comments and JSDoc current

## 🔒 Security Verification

### Security Checklist
- [ ] Dependencies scanned for vulnerabilities
- [ ] Code scanned with security tools
- [ ] Permissions follow principle of least privilege
- [ ] No secrets or sensitive data in code
- [ ] SECURITY.md policy is current

### Privacy Compliance
- [ ] Data handling practices documented
- [ ] AI provider policies reviewed
- [ ] User consent mechanisms clear
- [ ] Data retention policies specified

## 🚢 Release Process

### Pre-Release Steps
1. [ ] Create release branch from `main`
2. [ ] Update version numbers
3. [ ] Update CHANGELOG.md
4. [ ] Run full test suite
5. [ ] Build and test action bundle

### Release Creation
1. [ ] Create GitHub release with proper tag
2. [ ] Upload release artifacts
3. [ ] Generate release notes
4. [ ] Mark as pre-release if testing needed

### Post-Release Steps
1. [ ] Verify action marketplace listing
2. [ ] Test installation from marketplace
3. [ ] Monitor for initial user issues
4. [ ] Update documentation sites

## 📊 Release Validation

### Marketplace Verification
- [ ] Action appears in GitHub Marketplace
- [ ] Metadata is correct (name, description, tags)
- [ ] Icon and branding display properly
- [ ] Installation instructions work

### User Experience Testing
- [ ] New users can install successfully
- [ ] Default configuration works
- [ ] Error messages are helpful
- [ ] Documentation is discoverable

### Performance Validation
- [ ] Action starts within 30 seconds
- [ ] Review generation completes in reasonable time
- [ ] Memory usage is within limits
- [ ] API rate limits are respected

## 🐛 Post-Release Monitoring

### First 24 Hours
- [ ] Monitor GitHub issues for bugs
- [ ] Check action usage statistics
- [ ] Verify no critical errors in logs
- [ ] Respond to user questions

### First Week
- [ ] Review user feedback
- [ ] Monitor performance metrics
- [ ] Check for security issues
- [ ] Document common problems

### Ongoing Monitoring
- [ ] Track usage and adoption
- [ ] Monitor dependency updates
- [ ] Review security advisories
- [ ] Plan next release features

## 🔄 Hotfix Process

If critical issues are found:

1. [ ] Assess severity and impact
2. [ ] Create hotfix branch
3. [ ] Develop minimal fix
4. [ ] Test fix thoroughly
5. [ ] Release as patch version
6. [ ] Communicate to users

## 📋 Release Notes Template

```markdown
## [vX.Y.Z] - YYYY-MM-DD

### Added
- New feature descriptions

### Changed
- Breaking changes
- Behavior modifications

### Fixed
- Bug fixes
- Security fixes

### Deprecated
- Features marked for removal

### Removed
- Features removed in this version

### Security
- Security improvements
```

## ✅ Final Checklist

Before marking release as complete:

- [ ] All tests pass
- [ ] Documentation is updated
- [ ] Security review complete
- [ ] Action is available on marketplace
- [ ] Initial user feedback is positive
- [ ] No critical issues reported
- [ ] Team is ready for support

## 📞 Support Preparation

### Support Documentation
- [ ] Troubleshooting guide current
- [ ] Common issues documented
- [ ] Support contact information current
- [ ] Escalation procedures defined

### Team Readiness
- [ ] Support team trained on new features
- [ ] Known issues documented
- [ ] Response procedures ready
- [ ] Communication channels prepared

---

**Remember**: A good release is not just about code—it's about user experience, documentation, and ongoing support. Take time to ensure quality at every step.
