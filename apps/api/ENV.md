# Environment Variables Documentation

This document describes all environment variables used in the Enout API.

## Basic Configuration

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | API server port | `3001` | No |
| `NODE_ENV` | Environment (development/production/test) | `development` | No |
| `API_URL` | Full URL where API is hosted | - | Yes |

## Security

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `JWT_SECRET` | Secret key for JWT tokens | - | Yes |
| `JWT_EXPIRY` | JWT token expiry time | `24h` | No |
| `CORS_ORIGINS` | Allowed CORS origins (comma-separated) | - | Yes |

## Rate Limiting

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `RATE_LIMIT_ENABLED` | Enable rate limiting | `true` | No |
| `RATE_LIMIT_WINDOW` | Time window in minutes | `15` | No |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | `100` | No |

## Database

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `DATABASE_URL` | PostgreSQL connection URL | - | Yes |

## Redis

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `REDIS_HOST` | Redis server host | `localhost` | No |
| `REDIS_PORT` | Redis server port | `6379` | No |
| `REDIS_PASSWORD` | Redis password | - | No |
| `REDIS_OTP_TTL` | OTP time-to-live in seconds | `300` | No |
| `REDIS_OTP_MAX_ATTEMPTS` | Max OTP verification attempts | `3` | No |

## Email (SMTP/Gmail)

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `EMAIL_ENABLED` | Enable email sending | `true` | No |
| `EMAIL_FROM` | Sender email address | - | Yes |
| `EMAIL_FROM_NAME` | Sender name | - | Yes |
| `EMAIL_API_KEY` | Email service app password (for Gmail) | - | Yes (when enabled) |
| `SMTP_HOST` | SMTP server host | `smtp.gmail.com` | No |
| `SMTP_PORT` | SMTP server port | `587` | No |
| `SMTP_SECURE` | Use secure connection | `false` | No |

## Example .env File

```env
# API Configuration
PORT=3001
NODE_ENV=development
API_URL=http://localhost:3001

# Security
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRY=24h
CORS_ORIGINS=http://localhost:3000,http://localhost:19006,exp://localhost:19000

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_ENABLED=true

# Database
DATABASE_URL="postgresql://enout_user:enout_password@localhost:5432/enout_local?schema=public"

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_OTP_TTL=300
REDIS_OTP_MAX_ATTEMPTS=3

# Email (SMTP/Gmail)
EMAIL_ENABLED=true
EMAIL_FROM=tanmay@enout.in
EMAIL_FROM_NAME=Enout Event Management
EMAIL_API_KEY=your-gmail-app-password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
```

## Notes

1. **Security**:
   - Keep your `.env` file secure and never commit it to version control
   - Use strong values for `JWT_SECRET`
   - In production, use secure values for all passwords and keys

2. **CORS**:
   - `CORS_ORIGINS` should include all frontend URLs
   - For development, include localhost URLs
   - For production, use your actual domain names

3. **Rate Limiting**:
   - Adjust `RATE_LIMIT_*` values based on your needs
   - Consider lower limits for authentication endpoints

4. **Email**:
   - For Gmail, you need to generate an App Password (not regular password)
   - Enable 2-Step Verification in Gmail settings
   - Generate App Password: https://myaccount.google.com/apppasswords
   - Test email configuration before deployment

5. **Redis**:
   - Use password in production
   - Consider using Redis cluster in production

6. **Production Considerations**:
   - Use secure HTTPS URLs
   - Set appropriate CORS origins
   - Enable rate limiting
   - Use strong passwords
   - Consider using environment variable management service
