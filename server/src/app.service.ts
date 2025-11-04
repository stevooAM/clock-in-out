import { Injectable } from '@nestjs/common';
import { AuthService } from './modules/auth/auth.service';
import { UserService } from './modules/users/services/users.service';
import { AuthDto } from './modules/auth/dto/auth.dto';
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
    private readonly usersService: UserService,
  ) {}

  public authIn(ticket: AuthDto): Promise<AuthResponseDto> {
    return this.authService.authIn(ticket);
  }

  public authOut(ticket: AuthDto): Promise<AuthResponseDto> {
    return this.authService.authOut(ticket);
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

