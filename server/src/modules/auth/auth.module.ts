import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { OtpService } from './otp.service';
import { NotificationService } from './notification.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  providers: [AuthService, OtpService, NotificationService],
  controllers: [],
  exports: [AuthService, OtpService],
})
export class AuthModule {}
