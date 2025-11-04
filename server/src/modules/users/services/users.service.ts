import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { User } from '@prisma/client';
import { subHours, getDay, parse, isWithinInterval, getUnixTime } from 'date-fns';
import {
  SCHEDULE_EXCLUDE,
  SCHEDULE_HOURS,
  FIRST_HOUR_MORNING,
  FIRST_HOUR_NIGHT,
  LAST_HOUR_MORNING,
  LAST_HOUR_NIGHT,
  HOUR_FORMAT,
} from '../constants/users.constans';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  public async getUsersWithoutKey(): Promise<Pick<User, 'uid'>[]> {
    return this.prisma.user.findMany({
      where: {
        key: null,
      },
      select: {
        uid: true,
      },
    });
  }

  public async addUser(userDto: { uid: string; key: string }): Promise<User> {
    return this.prisma.user.update({
      where: {
        uid: userDto.uid,
      },
      data: {
        key: userDto.key,
      },
    });
  }

  public async getUsersMustBeWorkingNow() {
    const date = subHours(new Date(), 4);
    const dayOfWeek = getDay(date) - 1;
    const hourNow = this.convertBetweenRealHourAndScheduleHour(date);
    const isMorning = this.isMorning(date);

    const lowerHour = isMorning
      ? getUnixTime(parse(FIRST_HOUR_MORNING, HOUR_FORMAT, new Date()))
      : getUnixTime(parse(FIRST_HOUR_NIGHT, HOUR_FORMAT, new Date()));

    const upperHour = isMorning
      ? getUnixTime(parse(LAST_HOUR_MORNING, HOUR_FORMAT, new Date()))
      : getUnixTime(parse(LAST_HOUR_NIGHT, HOUR_FORMAT, new Date()));

    const users = await this.prisma.user.findMany({
      where: {
        schedule: {
          some: {
            day: String(dayOfWeek),
            hour: String(hourNow),
            NOT: {
              room: {
                in: SCHEDULE_EXCLUDE,
              },
            },
          },
        },
      },
      include: {
        schedule: true,
        auths: {
          where: {
            timestamp: {
              gte: lowerHour,
              lte: upperHour,
            },
          },
        },
      },
    });

    return users;
  }

  private convertBetweenRealHourAndScheduleHour(realHour: Date): number {
    return SCHEDULE_HOURS.findIndex(range => {
      const start = parse(range[0], HOUR_FORMAT, new Date());
      const end = parse(range[1], HOUR_FORMAT, new Date());
      return isWithinInterval(realHour, { start, end });
    });
  }

  private isMorning(hour: Date): boolean {
    const start = parse(FIRST_HOUR_MORNING, HOUR_FORMAT, new Date());
    const end = parse(LAST_HOUR_MORNING, HOUR_FORMAT, new Date());
    return isWithinInterval(hour, { start, end });
  }
}

