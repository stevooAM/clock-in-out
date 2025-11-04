import { Controller, Get, Post, Body } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserService } from '../services/users.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  getUsers(): Promise<Pick<User, 'uid'>[]> {
    return this.userService.getUsersWithoutKey();
  }

  @Post()
  addUser(@Body() userDto: { uid: string; key: string }): Promise<User> {
    return this.userService.addUser(userDto);
  }
}
