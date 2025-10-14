interface ReminderTemplateData {
  firstName: string;
  eventName: string;
  startDate: Date;
  location: string;
  pendingTasks?: string[];
}

export const reminderTemplate = (data: ReminderTemplateData): { subject: string; html: string } => ({
  subject: `${data.eventName} is Coming Up! | Enout`,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="color: #1a1a1a; margin: 0;">Enout</h2>
      </div>
      
      <div style="background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h2 style="color: #1a1a1a; margin-top: 0;">Event Reminder</h2>
        
        <p style="color: #666; font-size: 16px; line-height: 1.5;">
          Hi ${data.firstName},
        </p>
        
        <p style="color: #666; font-size: 16px; line-height: 1.5;">
          This is a reminder that ${data.eventName} is starting on 
          ${data.startDate.toLocaleDateString('en-US', { 
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })} in ${data.location}.
        </p>
        
        ${data.pendingTasks && data.pendingTasks.length > 0 ? `
          <div style="background-color: #fff3cd; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h3 style="color: #856404; margin-top: 0;">Pending Tasks:</h3>
            <ul style="color: #856404; font-size: 16px; line-height: 1.5; margin: 0; padding-left: 20px;">
              ${data.pendingTasks.map(task => `
                <li style="margin-bottom: 10px;">${task}</li>
              `).join('')}
            </ul>
            <p style="color: #856404; font-size: 14px; margin-bottom: 0;">
              Please complete these tasks as soon as possible.
            </p>
          </div>
        ` : ''}
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0;">
          <h3 style="color: #1a1a1a; margin-top: 0;">Quick Reminders:</h3>
          <ul style="color: #666; font-size: 16px; line-height: 1.5; margin: 0; padding-left: 20px;">
            <li style="margin-bottom: 10px;">Check the mobile app for your complete schedule</li>
            <li style="margin-bottom: 10px;">Review any event updates</li>
            <li style="margin-bottom: 10px;">Make sure your profile is complete</li>
          </ul>
        </div>
        
        <p style="color: #666; font-size: 16px; line-height: 1.5;">
          We look forward to seeing you at the event!
        </p>
      </div>
      
      <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
        <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">
          This is an automated reminder from Enout. For any questions, please check the mobile app or contact our support team.
        </p>
      </div>
    </div>
  `,
});