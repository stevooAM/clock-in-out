import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationService } from './notification.service';
import { addMinutes } from 'date-fns';

@Injectable()
export class OtpService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

  /**
   * Generate a 6-digit OTP code
   */
  private generateOtpCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Create and send OTP code for a user
   */
  async createOtp(userId: string, type: 'in' | 'out', method: 'email' | 'sms'): Promise<string> {
    // Verify user exists
    const user = await this.prisma.user.findUnique({
      where: { uid: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if user has email/phone configured
    if (method === 'email' && !user.email) {
      throw new BadRequestException('User email not configured');
    }
    if (method === 'sms' && !user.phone) {
      throw new BadRequestException('User phone not configured');
    }

    // Generate OTP code
    const code = this.generateOtpCode();
    const expiresAt = addMinutes(new Date(), 10); // OTP valid for 10 minutes

    // Invalidate any existing unused OTPs for this user and type
    await this.prisma.otpCode.updateMany({
      where: {
        userId,
        type,
        used: false,
        expiresAt: {
          gt: new Date(),
        },
      },
      data: {
        used: true,
      },
    });

    // Create new OTP
    await this.prisma.otpCode.create({
      data: {
        code,
        type,
        expiresAt,
        userId,
      },
    });

    // Send OTP via email or SMS
    try {
      if (method === 'email' && user.email) {
        await this.notificationService.sendOtpEmail(user.email, code, type);
      } else if (method === 'sms' && user.phone) {
        await this.notificationService.sendOtpSms(user.phone, code, type);
      }
    } catch (error: any) {
      // Log error but don't fail OTP creation
      // OTP is still created and can be returned in dev mode
      console.error('Error sending notification:', error);
    }

    // In development, return code for testing
    // In production, this should not be returned
    if (process.env.NODE_ENV !== 'production') {
      return code;
    }
    
    return 'OTP sent successfully';
  }

  /**
   * Verify OTP code and return user if valid
   */
  async verifyOtp(code: string, type: 'in' | 'out'): Promise<{ userId: string; userName: string }> {
    const otp = await this.prisma.otpCode.findFirst({
      where: {
        code,
        type,
        used: false,
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        user: true,
      },
    });

    if (!otp) {
      throw new BadRequestException('Invalid or expired OTP code');
    }

    // Mark OTP as used
    await this.prisma.otpCode.update({
      where: { id: otp.id },
      data: { used: true },
    });

    return {
      userId: otp.user.uid,
      userName: otp.user.name,
    };
  }
}

