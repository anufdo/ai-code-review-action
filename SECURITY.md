# Security Policy

## Overview

The AI Code Review Action is designed with security as a top priority. This document outlines our security practices, how to report vulnerabilities, and guidelines for secure usage.

## 🔒 Security Principles

### 1. Data Privacy
- **No Code Storage**: Code is only sent to AI providers for analysis and is not stored by our action
- **Temporary Processing**: All data is processed in memory and discarded after analysis
- **No Logging**: Sensitive code content is not logged or persisted

### 2. API Security
- **Encrypted Communication**: All API calls use HTTPS/TLS encryption
- **API Key Protection**: API keys are handled securely and never logged
- **Rate Limiting**: Built-in respect for API provider rate limits

### 3. Minimal Permissions
- **Principle of Least Privilege**: Requests only necessary GitHub permissions
- **Read-Only Access**: Only reads repository content, never modifies code
- **Comment-Only Writes**: Only writes review comments, cannot modify repository settings

## 🔑 Required Permissions

The action requires these minimal GitHub permissions:

```yaml
permissions:
  contents: read          # Read repository files
  pull-requests: write    # Post review comments
  issues: write          # Optional: for issue comments
```

**Note**: The action never requires:
- Repository write access
- Workflow write access
- Administration permissions
- Access to secrets beyond the provided API keys

## 🛡️ Data Handling

### What Gets Sent to AI Providers

#### Included:
- Changed file content (old and new versions)
- File names and paths
- Diff patches
- Programming language information
- Pull request title and description (optional)

#### Never Included:
- Git history or commit messages
- Repository secrets or environment variables
- User credentials or personal information
- Files matching exclude patterns
- Binary files or large files (>1000 lines changed)

### AI Provider Security

#### OpenAI
- Data is not used for model training (as per OpenAI's API terms)
- Requests are processed and discarded
- Data retention: 30 days for abuse monitoring only

#### Anthropic
- Data is not used for model training
- Requests are processed and discarded
- Data retention: Minimal, for safety monitoring only

**Important**: Review your AI provider's terms of service and data handling policies to ensure compliance with your organization's requirements.

## 🚨 Vulnerability Reporting

### Reporting Security Issues

If you discover a security vulnerability, please report it privately:

1. **Email**: security@your-domain.com
2. **GitHub**: Use the "Security" tab to report privately
3. **Include**:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if known)

### Response Timeline

- **Acknowledgment**: Within 24 hours
- **Initial Assessment**: Within 72 hours
- **Fix Development**: 1-2 weeks (depending on severity)
- **Release**: As soon as safely possible

### Disclosure Policy

We follow responsible disclosure:
1. Report received and acknowledged
2. Vulnerability assessed and fixed
3. Security release published
4. Public disclosure after fix is available

## 🔐 Secure Usage Guidelines

### For Public Repositories

#### Safe Practices:
- Review exclude patterns to avoid sensitive files
- Use the action on code that's already public
- Monitor review comments for accuracy

#### Additional Considerations:
- Be aware that PR content is sent to AI providers
- Consider using basic review level for public repos
- Regularly audit action outputs

### For Private Repositories

#### Enhanced Security:
- Verify AI provider's data handling policies
- Consider self-hosted runners for highly sensitive code
- Implement additional file exclusions
- Review organization's data classification policies

#### Recommended Configuration:
```yaml
exclude-patterns: |
  *.key,*.pem,*.crt,*.p12,*.pfx,
  *.env,*.env.*,
  config/secrets.*,
  **/secrets/**,
  *.lock,*.min.js,*.map,
  node_modules/**,dist/**
```

### For Enterprise Environments

#### Additional Measures:
- Use organization secrets instead of repository secrets
- Implement approval workflows for action updates
- Monitor action usage and outputs
- Regular security audits of workflow configurations

#### Network Security:
- Consider IP allowlisting for API endpoints
- Use private runners if network policies require it
- Monitor egress traffic for unusual patterns

## 🔍 Security Features

### Built-in Protections

1. **Input Validation**
   - Configuration parameters are validated
   - File paths are sanitized
   - API responses are parsed safely

2. **Error Handling**
   - Sensitive information is not exposed in error messages
   - Graceful degradation when API calls fail
   - No crash dumps containing sensitive data

3. **Rate Limiting**
   - Respects AI provider rate limits
   - Implements exponential backoff
   - Prevents abuse of external APIs

### Audit Logging

The action provides audit logs including:
- Number of files processed
- API calls made (without content)
- Errors encountered (sanitized)
- Processing duration

Example log output:
```
✅ Configuration validated. Using openai with model gpt-4
📁 Found 8 changed files
📝 Reviewing 6 files...
📄 Reviewing file 1/6: src/auth.js
✅ AI Code Review completed successfully!
```

## 🛠️ Security Development Practices

### Code Security

- **Static Analysis**: Code is regularly scanned for vulnerabilities
- **Dependency Scanning**: All dependencies are monitored for security issues
- **Automated Testing**: Security-focused test cases
- **Code Reviews**: All changes undergo security review

### Release Security

- **Signed Releases**: All releases are signed and verified
- **Immutable Builds**: Release artifacts are immutable
- **Vulnerability Scanning**: Each release is scanned for vulnerabilities
- **Security Testing**: Automated security tests before release

## 🎯 Security Checklist

Before using the action in production:

- [ ] Review your organization's data classification policies
- [ ] Verify AI provider terms comply with your requirements
- [ ] Configure appropriate exclude patterns
- [ ] Test with non-sensitive repositories first
- [ ] Set up monitoring for action usage
- [ ] Train team on secure configuration practices
- [ ] Establish incident response procedures
- [ ] Regular review of action permissions and configurations

## 📋 Compliance Considerations

### Data Residency
- OpenAI: Data processed in US/EU regions
- Anthropic: Data processed primarily in US
- Consider regional requirements for your organization

### Industry Standards
- SOC 2 compliance considerations
- GDPR compliance for EU data
- HIPAA considerations for healthcare data
- PCI DSS for payment-related code

### Audit Requirements
- Action provides audit logs
- API call tracking available
- Configuration history through Git
- Access logs through GitHub audit log

## 🔄 Regular Security Maintenance

### Monthly Tasks
- [ ] Review action permissions and configurations
- [ ] Check for action updates and security fixes
- [ ] Audit API key usage and rotate if necessary
- [ ] Review exclude patterns for new sensitive files

### Quarterly Tasks
- [ ] Security review of all workflows using the action
- [ ] Update team training on secure configuration
- [ ] Review compliance with organizational policies
- [ ] Assess new security features and updates

### Annual Tasks
- [ ] Comprehensive security audit
- [ ] Review AI provider terms and policies
- [ ] Update incident response procedures
- [ ] Security training refresh for development teams

## 📞 Security Contacts

- **Security Team**: security@your-domain.com
- **Emergency Contact**: Available 24/7 through GitHub issues
- **Security Advisories**: Watch the repository for security updates

## 📚 Additional Resources

- [GitHub Actions Security Best Practices](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions)
- [OpenAI Privacy Policy](https://openai.com/privacy/)
- [Anthropic Privacy Policy](https://www.anthropic.com/privacy)
- [OWASP Secure Coding Practices](https://owasp.org/www-project-secure-coding-practices-quick-reference-guide/)

---

**Remember**: Security is a shared responsibility. While we provide a secure action, proper configuration and usage are essential for maintaining security in your environment.
