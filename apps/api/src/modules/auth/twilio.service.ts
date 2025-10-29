import { Injectable } from '@nestjs/common';
import * as twilio from 'twilio';

@Injectable()
export class TwilioService {
    private client: twilio.Twilio;

    constructor() {
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;

        if (accountSid && authToken) {
            this.client = twilio(accountSid, authToken);
            console.log('Twilio service initialized');
        } else {
            console.log('Twilio credentials not found - SMS will be logged only');
        }
    }

    async sendSms(to: string, message: string): Promise<void> {
        const from = process.env.TWILIO_PHONE_NUMBER;

        if (!this.client || !from) {
            console.log(`[Twilio Disabled] SMS to ${to}: ${message}`);
            return;
        }

        try {
            console.log(`Attempting to send SMS to ${to}...`);

            const result = await this.client.messages.create({
                to,
                from,
                body: message,
            });

            console.log(`✓ SMS sent successfully to ${to}:`, result.sid);
        } catch (error) {
            console.error('Failed to send SMS:', error);
            console.log(`[FALLBACK] SMS to ${to}: ${message}`);
            throw error;
        }
    }
}

