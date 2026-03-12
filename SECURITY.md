# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Currently supported versions:

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

We take the security of AI Appointment Setter seriously. If you believe you have found a security vulnerability, please report it to us as described below.

### Please Do NOT:

- Open a public GitHub issue
- Publicly disclose the vulnerability before it has been addressed

### Please DO:

1. **Email us directly** at security@example.com with:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fixes (if any)

2. **Give us time** to respond (usually within 48 hours)

3. **Allow us to fix** the issue before public disclosure (usually 90 days)

## Security Measures

### Current Security Features

- **Authentication**: Supabase Auth with server-side rendering
- **Authorization**: Row-Level Security (RLS) at database level
- **Encryption**: AES-256-GCM for API keys and sensitive data
- **Input Validation**: Zod schema validation on all endpoints
- **Rate Limiting**: Request throttling to prevent abuse
- **Security Headers**: CSP, XSS protection, frame options
- **HTTPS**: Enforced in production
- **CORS**: Configured with whitelist

### Known Limitations

- Rate limiting is in-memory (use Redis for distributed systems)
- Demo mode bypasses authentication (disable in production)
- Vector embeddings not yet implemented for RAG

## Security Best Practices

### For Developers

1. **Never commit secrets** to the repository
2. **Use environment variables** for all sensitive configuration
3. **Keep dependencies updated** regularly
4. **Follow secure coding practices** (OWASP guidelines)
5. **Review code changes** before merging
6. **Run security audits** periodically

### For Deployment

1. **Disable demo mode** in production (`ENABLE_DEMO_MODE=false`)
2. **Use strong encryption keys** (32+ bytes, randomly generated)
3. **Enable HTTPS only** (no HTTP traffic)
4. **Set up WAF** (Web Application Firewall)
5. **Monitor logs** for suspicious activity
6. **Regular backups** of database
7. **Rotate API keys** periodically

### For Users

1. **Use strong passwords** for your account
2. **Enable 2FA** if available
3. **Keep API keys secure** (never share or commit)
4. **Monitor account activity** regularly
5. **Report suspicious behavior** immediately

## Vulnerability Disclosure Timeline

1. **Day 0**: Vulnerability reported to security@example.com
2. **Day 1-2**: Initial response and confirmation
3. **Day 3-7**: Investigation and fix development
4. **Day 7-14**: Testing and review
5. **Day 14-21**: Patch release and deployment
6. **Day 90**: Public disclosure (if reporter agrees)

## Security Checklist

### Before Production Deployment

- [ ] All environment variables set securely
- [ ] Demo mode disabled
- [ ] Strong encryption key generated
- [ ] HTTPS enabled and enforced
- [ ] Database RLS policies active
- [ ] Rate limiting configured
- [ ] Security headers set
- [ ] API keys encrypted
- [ ] Input validation in place
- [ ] Error messages sanitized
- [ ] Logging configured (no sensitive data logged)
- [ ] Backup strategy implemented
- [ ] Monitoring and alerting set up

### Regular Maintenance

- [ ] Review dependencies for vulnerabilities (weekly)
- [ ] Rotate API keys (monthly)
- [ ] Review access logs (weekly)
- [ ] Update dependencies (monthly)
- [ ] Security audit (quarterly)
- [ ] Penetration testing (annually)

## Security Tools

### Recommended Tools

- **Dependency Scanning**: `npm audit`, Snyk, Dependabot
- **Static Analysis**: ESLint with security plugins
- **Secret Scanning**: git-secrets, truffleHog
- **Container Scanning**: Trivy, Clair
- **DAST**: OWASP ZAP
- **SAST**: SonarQube

### Running Security Checks

```bash
# Check for dependency vulnerabilities
npm audit

# Fix vulnerabilities automatically
npm audit fix

# Check for secrets in code
git secrets --scan

# Lint code for security issues
npm run lint
```

## Compliance

This application is designed with the following standards in mind:

- **OWASP Top 10**: Protection against common web vulnerabilities
- **GDPR**: Data privacy and protection
- **SOC 2**: Security and availability controls
- **HIPAA**: Health information protection (if applicable)

## Contact

- **Security Issues**: security@example.com
- **General Support**: support@example.com
- **GitHub Issues**: https://github.com/zamadgopang/ai-appointment-setter/issues

## Acknowledgments

We appreciate the security research community and will acknowledge researchers who responsibly disclose vulnerabilities (with their permission).

---

**Last Updated**: March 2026
