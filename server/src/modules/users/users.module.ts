import { Module } from '@nestjs/common';
import { UserService } from './services/users.service';
import { UserController } from './controllers/user.controller';

@Module({
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UsersModule {}
