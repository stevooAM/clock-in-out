import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import { AuthResponseDto } from './dto/auth.response.dto';
import {
  STATUS_CODE_RESPONSE,
  INPUT,
  OUTPUT,
} from './constants/auth.constants';
import { getUnixTime } from 'date-fns';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

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

  private async saveTicketing(auth: AuthDto & { reader: string }): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where: {
        key: auth.key,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    await this.prisma.auth.create({
      data: {
        reader: auth.reader,
        timestamp: getUnixTime(new Date()),
        userId: user.uid,
      },
    });

    return user;
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
