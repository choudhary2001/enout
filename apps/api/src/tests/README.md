# API Testing Documentation

This document describes the test suite for the Enout API, focusing on mobile app endpoints and core functionality.

## Test Structure

```
tests/
├── test-setup.ts           # Test setup helpers and mock data
├── auth.e2e-spec.ts        # Authentication flow tests
├── mobile.e2e-spec.ts      # Mobile endpoints tests
└── integration.spec.ts     # Integration tests (Redis, Email)
```

## Running Tests

1. **Setup Environment**:
   ```bash
   # Copy test environment file
   cp .env .env.test
   
   # Install dependencies
   pnpm install
   ```

2. **Run Tests**:
   ```bash
   # Run all tests
   pnpm test

   # Run specific test file
   pnpm test src/tests/auth.e2e-spec.ts

   # Run tests in watch mode
   pnpm test:watch

   # Run with coverage
   pnpm test:cov
   ```

## Test Scenarios

### Authentication Flow

1. **OTP Verification**:
   ```json
   // Send OTP
   POST /auth/otp/send
   {
     "email": "attendee@example.com"
   }

   // Verify OTP
   POST /auth/otp/verify
   {
     "email": "attendee@example.com",
     "otp": "123456"
   }

   // Verify Attendee OTP
   POST /auth/attendee/verify
   {
     "eventId": "event-123",
     "email": "attendee@example.com",
     "otp": "123456"
   }
   ```

### Mobile Endpoints

1. **Profile Management**:
   ```json
   // Get Profile
   GET /mobile/profile?eventId=event-123&email=attendee@example.com

   // Update Profile
   PATCH /mobile/profile?eventId=event-123&email=attendee@example.com
   {
     "workEmail": "work@example.com",
     "location": "New York",
     "gender": "prefer not to say",
     "dietaryRequirements": "vegetarian"
   }
   ```

2. **Message Management**:
   ```json
   // Get Messages
   GET /mobile/messages?eventId=event-123&email=attendee@example.com

   // Acknowledge Message
   POST /mobile/messages/message-123/acknowledge?eventId=event-123&email=attendee@example.com
   ```

3. **Event Details**:
   ```json
   // Get Event
   GET /mobile/event?eventId=event-123&email=attendee@example.com
   ```

### Integration Tests

1. **Redis Operations**:
   - Store and verify OTP
   - Handle invalid OTP
   - Max attempts enforcement
   - Manual OTP invalidation

2. **Email Operations**:
   - Send OTP email
   - Send welcome email
   - Send reminder email

## Test Data

Test data is automatically created and cleaned up for each test suite:

1. **Test Event**:
   ```json
   {
     "id": "test-event-id",
     "name": "Test Event",
     "description": "Test event description",
     "startDate": "2025-07-20",
     "endDate": "2025-07-22",
     "location": "Test Location"
   }
   ```

2. **Test Attendee**:
   ```json
   {
     "id": "test-attendee-id",
     "eventId": "test-event-id",
     "email": "test@example.com",
     "firstName": "Test",
     "lastName": "User"
   }
   ```

## Mocking

1. **Redis Service**:
   - `storeOtp`: Mock OTP storage
   - `verifyOtp`: Mock OTP verification
   - `invalidateOtp`: Mock OTP invalidation

2. **Email Service**:
   - `sendOtpEmail`: Mock OTP email sending
   - `sendWelcomeEmail`: Mock welcome email
   - `sendEventReminder`: Mock reminder email

## Environment Variables

Required variables in `.env.test`:

```env
# API Configuration
PORT=3001
NODE_ENV=test
API_URL=http://localhost:3001

# Security
JWT_SECRET=test-secret
CORS_ORIGINS=http://localhost:3000,http://localhost:19006

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_OTP_TTL=300
REDIS_OTP_MAX_ATTEMPTS=3

# Email Configuration
BREVO_API_KEY=your-test-api-key
EMAIL_SENDER_ADDRESS=test@enout.in
EMAIL_SENDER_NAME=Enout Test
```

## Adding New Tests

1. **E2E Tests**:
   - Add test file in `tests/` directory
   - Use `createTestingModule()` from `test-setup.ts`
   - Follow existing patterns for setup/teardown

2. **Integration Tests**:
   - Add to `integration.spec.ts`
   - Group related tests in describe blocks
   - Clean up resources after tests

3. **Best Practices**:
   - Use descriptive test names
   - Clean up test data
   - Mock external services
   - Handle async operations properly
   - Add appropriate error cases
