import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import { AuthOtpDto } from './dto/auth-otp.dto';
import { AuthManualDto } from './dto/auth-manual.dto';
import { AuthResponseDto } from './dto/auth.response.dto';
import { OtpService } from './otp.service';
import {
  STATUS_CODE_RESPONSE,
  INPUT,
  OUTPUT,
} from './constants/auth.constants';
import { getUnixTime } from 'date-fns';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly otpService: OtpService,
  ) {}

  async authIn(auth: AuthDto): Promise<AuthResponseDto> {
    try {
      const user = await this.saveTicketing({ ...auth, reader: INPUT });
      return this.welcomeTeacher(user.name);
    } catch (e) {
      return { status: STATUS_CODE_RESPONSE.KO, msg: 'Error en la entrada' };
    }
  }

  async authOut(auth: AuthDto): Promise<AuthResponseDto> {
    try {
      const user = await this.saveTicketing({ ...auth, reader: OUTPUT });
      return this.byeTeacher(user.name);
    } catch (e) {
      return { status: STATUS_CODE_RESPONSE.KO, msg: 'Error en la salida' };
    }
  }

  /**
   * NFC card authentication (existing method)
   */
  private async saveTicketing(auth: AuthDto & { reader: string }): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where: {
        key: auth.key,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.auth.create({
      data: {
        reader: auth.reader,
        timestamp: getUnixTime(new Date()),
        userId: user.uid,
        method: 'nfc',
      },
    });

    return user;
  }

  /**
   * OTP code authentication
   */
  async authInWithOtp(auth: AuthOtpDto): Promise<AuthResponseDto> {
    try {
      const { userId, userName } = await this.otpService.verifyOtp(auth.code, 'in');
      await this.saveTicketingWithMethod(userId, INPUT, 'otp');
      return this.welcomeTeacher(userName);
    } catch (e) {
      return {
        status: STATUS_CODE_RESPONSE.KO,
        msg: e instanceof BadRequestException ? e.message : 'Error en la entrada',
      };
    }
  }

  async authOutWithOtp(auth: AuthOtpDto): Promise<AuthResponseDto> {
    try {
      const { userId, userName } = await this.otpService.verifyOtp(auth.code, 'out');
      await this.saveTicketingWithMethod(userId, OUTPUT, 'otp');
      return this.byeTeacher(userName);
    } catch (e) {
      return {
        status: STATUS_CODE_RESPONSE.KO,
        msg: e instanceof BadRequestException ? e.message : 'Error en la salida',
      };
    }
  }

  /**
   * Manual ID entry authentication
   */
  async authInWithManual(auth: AuthManualDto): Promise<AuthResponseDto> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { uid: auth.userId },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      await this.saveTicketingWithMethod(user.uid, INPUT, 'manual');
      return this.welcomeTeacher(user.name);
    } catch (e) {
      return {
        status: STATUS_CODE_RESPONSE.KO,
        msg: e instanceof NotFoundException ? e.message : 'Error en la entrada',
      };
    }
  }

  async authOutWithManual(auth: AuthManualDto): Promise<AuthResponseDto> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { uid: auth.userId },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      await this.saveTicketingWithMethod(user.uid, OUTPUT, 'manual');
      return this.byeTeacher(user.name);
    } catch (e) {
      return {
        status: STATUS_CODE_RESPONSE.KO,
        msg: e instanceof NotFoundException ? e.message : 'Error en la salida',
      };
    }
  }

  /**
   * Save ticketing record with specified method
   */
  private async saveTicketingWithMethod(
    userId: string,
    reader: string,
    method: 'nfc' | 'otp' | 'manual',
  ): Promise<void> {
    await this.prisma.auth.create({
      data: {
        reader,
        timestamp: getUnixTime(new Date()),
        userId,
        method,
      },
    });
  }

  private welcomeTeacher(nameTeacher: string): AuthResponseDto {
    return {
      status: STATUS_CODE_RESPONSE.OK,
      msg: `Entrada - ${nameTeacher}`,
    };
  }

  private byeTeacher(nameTeacher: string): AuthResponseDto {
    return {
      status: STATUS_CODE_RESPONSE.OK,
      msg: `Salida - ${nameTeacher}`,
    };
  }
}
