import { Injectable } from '@nestjs/common';
import { EmailConfig } from './config/email.config';
import * as nodemailer from 'nodemailer';
import { otpTemplate } from './templates/otp.template';

@Injectable()
export class EmailService {
    private transporter: nodemailer.Transporter | null = null;

    constructor(private emailConfig: EmailConfig) {
        if (emailConfig.enabled && emailConfig.from?.email && emailConfig.apiKey) {
            try {
                this.transporter = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 587,
                    secure: false,
                    auth: {
                        user: emailConfig.from.email,
                        pass: emailConfig.apiKey,
                    },
                });
                console.log('Email service initialized with SMTP:', {
                    from: emailConfig.from.email,
                    fromName: emailConfig.from.name,
                    hasPassword: !!emailConfig.apiKey,
                });
            } catch (error) {
                console.error('Failed to initialize email transporter:', error);
            }
        } else {
            console.log('Email service disabled or credentials missing');
        }
    }

    async sendOtp(to: string, otp: string): Promise<void> {
        if (!this.emailConfig.enabled) {
            console.log(`[Email Disabled] OTP for ${to}: ${otp}`);
            return;
        }

        if (!this.transporter) {
            throw new Error('Email transporter not initialized');
        }

        const template = otpTemplate(otp);

        try {
            console.log(`Attempting to send OTP email to: ${to}`);
            const info = await this.transporter.sendMail({
                from: `"${this.emailConfig.from.name}" <${this.emailConfig.from.email}>`,
                to,
                subject: template.subject,
                html: template.html,
            });

            console.log(`Email sent successfully to ${to}:`, info.messageId);
        } catch (error) {
            console.error('Failed to send email:', error);
            console.error('Error details:', JSON.stringify(error, null, 2));
            throw error;
        }
    }

    async sendEmail(options: { to: string; subject: string; html: string }): Promise<void> {
        if (!this.emailConfig.enabled) {
            console.log(`[Email Disabled] Email to ${options.to}:`, options.subject);
            return;
        }

        if (!this.transporter) {
            throw new Error('Email transporter not initialized');
        }

        try {
            const info = await this.transporter.sendMail({
                from: `"${this.emailConfig.from.name}" <${this.emailConfig.from.email}>`,
                to: options.to,
                subject: options.subject,
                html: options.html,
            });

            console.log(`Email sent to ${options.to}:`, info.messageId);
        } catch (error) {
            console.error('Failed to send email:', error);
            throw error;
        }
    }
}

