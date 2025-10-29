import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailerService {
  constructor(private readonly configService: ConfigService) {}

  /**
   * Send an email (stub implementation that logs to console)
   * @param to Recipient email
   * @param subject Email subject
   * @param text Plain text content
   * @param html HTML content
   */
  async sendEmail(to: string, subject: string, text: string, html?: string): Promise<void> {
    // In development mode, log the email content
    if (this.configService.get('NODE_ENV') === 'development') {
      console.log(`
========== EMAIL SENT ==========
To: ${to}
Subject: ${subject}
Content: ${text}
${html ? `HTML: ${html}` : ''}
===============================
      `);
      return;
    }
    
    // In production, this would integrate with a real email service
    console.log(`Email would be sent to ${to} with subject "${subject}"`);
  }

  /**
   * Send an OTP code via email
   * @param to Recipient email
   * @param code OTP code
   * @param eventId Event ID
   */
  async sendOtpEmail(to: string, code: string, eventId: string): Promise<void> {
    const subject = 'Your verification code';
    const text = `Your verification code is: ${code}\n\nThis code will expire in 5 minutes.\n\nEvent ID: ${eventId}`;
    const html = `
      <h1>Your verification code</h1>
      <p>Your verification code is: <strong>${code}</strong></p>
      <p>This code will expire in 5 minutes.</p>
      <p>Event ID: ${eventId}</p>
    `;
    
    await this.sendEmail(to, subject, text, html);
  }
}
