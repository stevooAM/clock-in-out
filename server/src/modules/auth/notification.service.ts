import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { MailService } from '@sendgrid/mail';

@Injectable()
export class NotificationService implements OnModuleInit {
  private readonly logger = new Logger(NotificationService.name);
  private readonly fromEmail: string;
  private readonly mailService: MailService;
  private sendGridEnabled: boolean = false;

  constructor() {
    // Get SendGrid API key from environment
    const apiKey = process.env.SENDGRID_API_KEY;
    const fromEmail = process.env.SENDGRID_FROM_EMAIL || 'noreply@clock-in-out.com';

    this.fromEmail = fromEmail;
    this.mailService = new MailService();

    if (apiKey) {
      this.mailService.setApiKey(apiKey);
      this.sendGridEnabled = true;
      this.logger.log('✅ SendGrid initialized successfully');
    } else {
      this.logger.warn('⚠️ SENDGRID_API_KEY not set - email sending disabled');
      this.logger.warn('📧 Emails will be logged to console only');
    }
  }

  onModuleInit() {
    if (this.sendGridEnabled) {
      this.logger.log(`📧 SendGrid configured with from email: ${this.fromEmail}`);
    }
  }

  /**
   * Send OTP code via email using SendGrid
   */
  async sendOtpEmail(email: string, code: string, type: 'in' | 'out'): Promise<void> {
    const action = type === 'in' ? 'Clock-In' : 'Clock-Out';
    const subject = `${action} Verification Code`;
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #f4f4f4; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
          <h2 style="color: #2196F3; margin-top: 0;">${subject}</h2>
        </div>
        
        <div style="background-color: #fff; padding: 20px; border-radius: 5px; border: 1px solid #ddd;">
          <p>Hello,</p>
          <p>Your verification code for <strong>${action.toLowerCase()}</strong> is:</p>
          
          <div style="background-color: #f9f9f9; padding: 20px; text-align: center; margin: 20px 0; border-radius: 5px; border: 2px dashed #2196F3;">
            <h1 style="font-size: 32px; color: #2196F3; margin: 0; letter-spacing: 5px;">${code}</h1>
          </div>
          
          <p>This code is valid for <strong>10 minutes</strong>.</p>
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            If you didn't request this code, please ignore this email or contact support.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
          <p>Clock-In/Out System</p>
        </div>
      </body>
      </html>
    `;

    const textContent = `
${action} Verification Code

Your verification code is: ${code}

This code is valid for 10 minutes.

If you didn't request this code, please ignore this email or contact support.

Clock-In/Out System
    `.trim();

    if (this.sendGridEnabled) {
      try {
        const msg = {
          to: email,
          from: this.fromEmail,
          subject: subject,
          text: textContent,
          html: htmlContent,
        };

        await this.mailService.send(msg);
        this.logger.log(`✅ OTP email sent successfully to ${email}`);
      } catch (error: any) {
        this.logger.error(`❌ Failed to send email to ${email}:`, error.message);
        if (error.response) {
          this.logger.error(`SendGrid API Error:`, JSON.stringify(error.response.body, null, 2));
        }
        // Fall back to console logging if SendGrid fails, but don't throw
        // This allows the OTP to still be created even if email fails
        this.logger.warn(`[FALLBACK] Email details: To: ${email}, Code: ${code}, Type: ${type}`);
        // Don't throw - allow OTP creation to continue
        // The OTP code will still be returned in dev mode
      }
    } else {
      // Development/fallback mode - log to console
      this.logger.log(`[EMAIL] To: ${email}, Code: ${code}, Type: ${type}`);
      this.logger.log(`[EMAIL] Subject: ${subject}`);
      this.logger.log(`[EMAIL] Code: ${code} (valid for 10 minutes)`);
    }
  }

  /**
   * Send OTP code via SMS
   * TODO: Integrate with SMS service (Twilio, AWS SNS, etc.)
   */
  async sendOtpSms(phone: string, code: string, type: 'in' | 'out'): Promise<void> {
    const action = type === 'in' ? 'clock-in' : 'clock-out';
    const message = `Your ${action} code is: ${code}. Valid for 10 minutes. - Clock-In/Out System`;
    
    this.logger.log(`Sending OTP SMS to ${phone}: ${code}`);
    
    // TODO: Implement actual SMS sending
    // Example with Twilio:
    // const twilioClient = require('twilio')(
    //   process.env.TWILIO_ACCOUNT_SID,
    //   process.env.TWILIO_AUTH_TOKEN
    // );
    // await twilioClient.messages.create({
    //   body: message,
    //   to: phone,
    //   from: process.env.TWILIO_PHONE_NUMBER,
    // });

    // For now, log it (will be implemented with Twilio later)
    this.logger.log(`[SMS] To: ${phone}, Code: ${code}, Type: ${type}`);
    this.logger.warn('⚠️ SMS sending not yet implemented - please integrate Twilio or similar service');
  }
}

