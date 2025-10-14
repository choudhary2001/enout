import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { EmailModule } from '../email.module';
import { EmailConfig } from '../config/email.config';

async function bootstrap() {
  const moduleRef = await Test.createTestingModule({
    imports: [EmailModule],
    providers: [
      {
        provide: ConfigService,
        useValue: {
          get: (key: string) => {
            switch (key) {
              case 'EMAIL_FROM':
                return 'test@example.com';
              case 'EMAIL_FROM_NAME':
                return 'Test Sender';
              case 'EMAIL_API_KEY':
                return 'test-api-key';
              case 'EMAIL_ENABLED':
                return true;
              default:
                return undefined;
            }
          },
        },
      },
    ],
  }).compile();

  const emailService = moduleRef.get('EmailService');

  await emailService.sendEmail({
    to: 'test@example.com',
    subject: 'Test Email',
    html: '<p>This is a test email</p>',
  });
}

bootstrap();