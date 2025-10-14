export const otpTemplate = (otp: string): { subject: string; html: string } => ({
  subject: 'Your Enout Verification Code',
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="color: #1a1a1a; margin: 0;">Enout</h2>
      </div>
      
      <div style="background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h2 style="color: #1a1a1a; margin-top: 0;">Verification Code</h2>
        <p style="color: #666; font-size: 16px; line-height: 1.5;">To complete your verification, please use the following code:</p>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; margin: 25px 0;">
          <h1 style="color: #1a1a1a; letter-spacing: 8px; margin: 0; font-size: 32px; font-weight: bold;">${otp}</h1>
        </div>
        
        <p style="color: #666; font-size: 14px; margin-bottom: 5px;">This code will expire in 5 minutes.</p>
        <p style="color: #666; font-size: 14px;">If you didn't request this code, you can safely ignore this email.</p>
      </div>
      
      <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
        <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">
          This is an automated message from Enout. Please do not reply to this email.
        </p>
      </div>
    </div>
  `,
});