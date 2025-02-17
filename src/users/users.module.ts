import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersEntity } from './users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Services } from '../utils/constants';

@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity])],
  controllers: [UsersController],
  providers: [
    { provide: Services.USERS, useClass: UsersService },
  ],
  exports: [
    { provide: Services.USERS, useClass: UsersService },
  ]
})
export class UsersModule { }
