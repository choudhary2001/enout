import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailConfig, emailConfigValidationSchema } from './config/email.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: emailConfigValidationSchema,
      isGlobal: true,
    }),
  ],
  providers: [
    {
      provide: EmailConfig,
      useFactory: (configService) => new EmailConfig(configService),
      inject: [ConfigService],
    },
    {
      provide: 'EmailService',
      useFactory: (config) => {
        const service = {
          logger: console,
          config,
          async sendEmail(options: { to: string; subject: string; html: string }) {
            if (!config.enabled) {
              service.logger.debug('Email sending is disabled');
              return;
            }

            try {
              // For development, just log the email
              service.logger.debug(`Sending email to ${options.to}:
Subject: ${options.subject}
From: ${config.from.name} <${config.from.email}>
Body: ${options.html}`);
            } catch (error) {
              service.logger.error('Failed to send email:', error);
              throw error;
            }
          },
        };
        return service;
      },
      inject: [EmailConfig],
    },
  ],
  exports: ['EmailService'],
})
export class EmailModule {}