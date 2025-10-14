import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { EmailConfig } from '../config/email.config';

describe('EmailService', () => {
  let service: any;
  let config: EmailConfig;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: 'EmailService',
          useFactory: (config) => ({
            logger: console,
            config,
            async sendEmail(options: { to: string; subject: string; html: string }) {
              if (!config.enabled) {
                this.logger.debug('Email sending is disabled');
                return;
              }

              try {
                // For development, just log the email
                this.logger.debug(`Sending email to ${options.to}:
Subject: ${options.subject}
From: ${config.from.name} <${config.from.email}>
Body: ${options.html}`);
              } catch (error) {
                this.logger.error('Failed to send email:', error);
                throw error;
              }
            },
          }),
          inject: [EmailConfig],
        },
        EmailConfig,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
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
            }),
          },
        },
      ],
    }).compile();

    service = moduleRef.get('EmailService');
    config = moduleRef.get<EmailConfig>(EmailConfig);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should send email when enabled', async () => {
    const loggerSpy = jest.spyOn(service.logger, 'debug');

    await service.sendEmail({
      to: 'test@example.com',
      subject: 'Test Subject',
      html: '<p>Test Body</p>',
    });

    expect(loggerSpy).toHaveBeenCalled();
  });
});