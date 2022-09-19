import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BossRaidHistory } from './models/bossRaidHistory.model';
import { User } from './models/user.model';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [SequelizeModule.forFeature([User, BossRaidHistory])],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule { }