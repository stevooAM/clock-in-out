import { Injectable } from '@nestjs/common';
import { AuthService } from './modules/auth/auth.service';
import { OtpService } from './modules/auth/otp.service';
import { UserService } from './modules/users/services/users.service';
import { AuthDto } from './modules/auth/dto/auth.dto';
import { AuthOtpDto } from './modules/auth/dto/auth-otp.dto';
import { AuthManualDto } from './modules/auth/dto/auth-manual.dto';
import { RequestOtpDto } from './modules/auth/dto/request-otp.dto';
import { getUnixTime } from 'date-fns';
import { User, Auth, UserSchedule } from '@prisma/client';
import { AuthResponseDto } from './modules/auth/dto/auth.response.dto';

type UserWithRelations = User & {
  auths: Auth[];
  schedule: UserSchedule[];
};

@Injectable()
export class AppService {
  constructor(
    private readonly authService: AuthService,
    private readonly otpService: OtpService,
    private readonly usersService: UserService,
  ) {}

  // NFC authentication (existing)
  public authIn(ticket: AuthDto): Promise<AuthResponseDto> {
    return this.authService.authIn(ticket);
  }

  public authOut(ticket: AuthDto): Promise<AuthResponseDto> {
    return this.authService.authOut(ticket);
  }

  // OTP authentication
  public authInWithOtp(ticket: AuthOtpDto): Promise<AuthResponseDto> {
    return this.authService.authInWithOtp(ticket);
  }

  public authOutWithOtp(ticket: AuthOtpDto): Promise<AuthResponseDto> {
    return this.authService.authOutWithOtp(ticket);
  }

  // Manual ID authentication
  public authInWithManual(ticket: AuthManualDto): Promise<AuthResponseDto> {
    return this.authService.authInWithManual(ticket);
  }

  public authOutWithManual(ticket: AuthManualDto): Promise<AuthResponseDto> {
    return this.authService.authOutWithManual(ticket);
  }

  // Request OTP code
  public async requestOtp(request: RequestOtpDto): Promise<{ message: string; code?: string }> {
    const code = await this.otpService.createOtp(request.userId, request.type, request.method);
    return {
      message: 'OTP sent successfully',
      code: process.env.NODE_ENV !== 'production' ? code : undefined,
    };
  }

  public async usersTicketing(): Promise<{
    users: UserWithRelations[];
    timestamp: number;
  }> {
    const usersMustBeWorking = await this.usersService.getUsersMustBeWorkingNow();
    return {
      users: usersMustBeWorking,
      timestamp: getUnixTime(new Date()),
    };
  }
}

