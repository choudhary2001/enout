import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Joi from 'joi';

export const emailConfigValidationSchema = Joi.object({
  EMAIL_FROM: Joi.string().email().optional(),
  EMAIL_FROM_NAME: Joi.string().optional(),
  EMAIL_API_KEY: Joi.string().allow('').optional(),
  EMAIL_ENABLED: Joi.boolean().default(false),
  SMTP_HOST: Joi.string().default('smtp.gmail.com'),
  SMTP_PORT: Joi.number().default(587),
  SMTP_SECURE: Joi.boolean().default(false),
});

@Injectable()
export class EmailConfig {
  constructor(private configService: ConfigService) { }

  get from() {
    return {
      email: this.configService.get<string>('EMAIL_FROM'),
      name: this.configService.get<string>('EMAIL_FROM_NAME'),
    };
  }

  get apiKey() {
    return this.configService.get<string>('EMAIL_API_KEY');
  }

  get enabled() {
    return this.configService.get<boolean>('EMAIL_ENABLED', false);
  }
}