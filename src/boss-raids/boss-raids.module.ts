import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BossRaidsController } from './boss-raids.controller';
import { BossRaidsService } from './boss-raids.service';
import { User } from '../users/models/user.model';
import { BossRaidHistory } from '../users/models/bossRaidHistory.model';

@Module({
  imports: [SequelizeModule.forFeature([User, BossRaidHistory])],
  providers: [BossRaidsService],
  controllers: [BossRaidsController],
})
export class BossRaidsModule { }