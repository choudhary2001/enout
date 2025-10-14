# Email Module

This module handles all email communications for the mobile app using Brevo (formerly SendinBlue).

## Setup

1. Get your Brevo API key from the [Brevo Dashboard](https://app.brevo.com/settings/keys/api)

2. Add these environment variables to your `.env` file:
```env
# Required
BREVO_API_KEY=your-api-key-here

# Optional (defaults provided)
EMAIL_SENDER_ADDRESS=noreply@brevo.com
EMAIL_SENDER_NAME=Brevo Events
EMAIL_RETRY_ATTEMPTS=3
EMAIL_RETRY_DELAY=1000
```

## Usage

```typescript
import { EmailService } from './modules/email/email.service';
import { AttendeeWithEvent } from './modules/email/interfaces/attendee.interface';

@Injectable()
export class YourService {
  constructor(private readonly emailService: EmailService) {}

  async someMethod() {
    // Send OTP
    await this.emailService.sendOtpEmail('user@example.com', '123456');

    // Send welcome email
    const attendee: AttendeeWithEvent = {
      // ... attendee data
    };
    await this.emailService.sendWelcomeEmail(attendee);

    // Send reminder
    await this.emailService.sendEventReminder(attendee);
  }
}
```

## Features

- Type-safe email templates
- Automatic retries on failure
- Environment-based configuration
- Proper error handling and logging
- Unit tests included

## Templates

1. OTP Verification
   - Simple, focused design
   - Clear OTP display
   - Expiration notice

2. Welcome Email
   - Event details
   - Next steps for registration
   - Clean, professional design

3. Event Reminder
   - Event details
   - Pending tasks list (if any)
   - Important information

## Error Handling

The service includes:
- Automatic retries (configurable attempts)
- Detailed error logging
- Type-safe interfaces
- Validation of configuration

## Testing

Run the tests:
```bash
pnpm --filter @enout/api test
```

## Maintenance

- Update templates in `templates/` directory
- Add new email types in `email.service.ts`
- Configure sending options in `email.config.ts`
