import { Get, Controller, Post, Body } from '@nestjs/common';
import { AuthDto } from './modules/auth/dto/auth.dto';
import { AuthOtpDto } from './modules/auth/dto/auth-otp.dto';
import { AuthManualDto } from './modules/auth/dto/auth-manual.dto';
import { RequestOtpDto } from './modules/auth/dto/request-otp.dto';
import { AuthResponseDto } from './modules/auth/dto/auth.response.dto';
import { AppService } from './app.service';
import { User, Auth, UserSchedule } from '@prisma/client';

type UserWithRelations = User & {
  auths: Auth[];
  schedule: UserSchedule[];
};

@Controller()
export class AppController {
  constructor(private appService: AppService) {}

  // NFC authentication (existing - backward compatible)
  @Post('in')
  authIn(@Body() ticket: AuthDto): Promise<AuthResponseDto> {
    return this.appService.authIn(ticket);
  }

  @Post('out')
  authOut(@Body() ticket: AuthDto): Promise<AuthResponseDto> {
    return this.appService.authOut(ticket);
  }

  // OTP authentication
  @Post('in/otp')
  authInWithOtp(@Body() ticket: AuthOtpDto): Promise<AuthResponseDto> {
    return this.appService.authInWithOtp(ticket);
  }

  @Post('out/otp')
  authOutWithOtp(@Body() ticket: AuthOtpDto): Promise<AuthResponseDto> {
    return this.appService.authOutWithOtp(ticket);
  }

  // Manual ID authentication
  @Post('in/manual')
  authInWithManual(@Body() ticket: AuthManualDto): Promise<AuthResponseDto> {
    return this.appService.authInWithManual(ticket);
  }

  @Post('out/manual')
  authOutWithManual(@Body() ticket: AuthManualDto): Promise<AuthResponseDto> {
    return this.appService.authOutWithManual(ticket);
  }

  // Request OTP code
  @Post('otp/request')
  requestOtp(@Body() request: RequestOtpDto): Promise<{ message: string; code?: string }> {
    return this.appService.requestOtp(request);
  }

  @Get('users')
  usersTicketing(): Promise<{ users: UserWithRelations[]; timestamp: number }> {
    return this.appService.usersTicketing();
  }
}
