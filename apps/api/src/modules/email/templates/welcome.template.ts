interface WelcomeTemplateData {
  firstName: string;
  eventName: string;
  startDate: Date;
  location: string;
}

export const welcomeTemplate = (data: WelcomeTemplateData): { subject: string; html: string } => ({
  subject: `Welcome to ${data.eventName} | Enout`,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="color: #1a1a1a; margin: 0;">Enout</h2>
      </div>
      
      <div style="background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h2 style="color: #1a1a1a; margin-top: 0;">Welcome to ${data.eventName}!</h2>
        
        <p style="color: #666; font-size: 16px; line-height: 1.5;">
          Hi ${data.firstName},
        </p>
        
        <p style="color: #666; font-size: 16px; line-height: 1.5;">
          We're excited to have you join us for ${data.eventName} in ${data.location}, starting on 
          ${data.startDate.toLocaleDateString('en-US', { 
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}.
        </p>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0;">
          <h3 style="color: #1a1a1a; margin-top: 0;">Next Steps:</h3>
          <ul style="color: #666; font-size: 16px; line-height: 1.5; margin: 0; padding-left: 20px;">
            <li style="margin-bottom: 10px;">Complete your profile</li>
            <li style="margin-bottom: 10px;">Upload your ID document</li>
            <li style="margin-bottom: 10px;">Verify your phone number</li>
          </ul>
        </div>
        
        <p style="color: #666; font-size: 16px; line-height: 1.5;">
          Please complete these tasks in the mobile app to ensure a smooth experience.
        </p>
        
        <p style="color: #666; font-size: 16px; line-height: 1.5;">
          If you have any questions, our team is here to help.
        </p>
      </div>
      
      <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
        <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">
          This email was sent by Enout. If you have any questions, please contact our support team.
        </p>
      </div>
    </div>
  `,
});