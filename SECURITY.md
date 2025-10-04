# Security Policy

## Supported Versions

We release patches for security vulnerabilities for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability within this project, please send an email to the maintainers. All security vulnerabilities will be promptly addressed.

Please do not open public issues for security vulnerabilities.

### What to include

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

### Response Time

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Fix Timeline**: Varies based on severity

## Security Best Practices

When using this application:

1. **API Keys**: Never commit API keys to version control
2. **Environment Variables**: Use `.env.local` for sensitive data
3. **CORS**: Configure appropriate CORS settings for production
4. **Rate Limiting**: Implement rate limiting on production APIs
5. **Authentication**: Add authentication if deploying publicly
6. **HTTPS**: Always use HTTPS in production
7. **Dependencies**: Regularly update dependencies

## Known Security Considerations

- NASA API key should be kept private
- No authentication system implemented by default
- CORS is configured for development (localhost)

## Vulnerability Disclosure

We will:
- Acknowledge receipt within 48 hours
- Investigate and validate the issue
- Develop and test a fix
- Release security patch
- Publicly disclose after fix is deployed (with your permission)

Thank you for helping keep this project secure!
