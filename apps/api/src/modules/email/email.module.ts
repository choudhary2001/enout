import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmailConfig } from './config/email.config';
import { EmailService } from './email.service';

@Module({
  providers: [
    EmailConfig,
    EmailService,
  ],
  exports: [EmailService],
})
export class EmailModule { }