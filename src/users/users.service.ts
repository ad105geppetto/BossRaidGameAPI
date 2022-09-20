import { Injectable, NotFoundException } from '@nestjs/common';
import Radis from "ioredis"
import { InjectModel } from '@nestjs/sequelize';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { BossRaidHistory } from './models/bossRaidHistory.model';
import { User } from './models/user.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,

    @InjectModel(BossRaidHistory)
    private bossRaidHistoryModel: typeof BossRaidHistory,

    @InjectRedis()
    private readonly redis: Radis
  ) { }

  async create() {
    const user = await this.userModel.create();
    await this.redis.zadd('user_score', 0, `user:${user.id}`);
    return user.id
  }

  async getOne(id: number) {
    const user = await this.userModel.findOne({
      where: { id: id },
      attributes: {
        exclude: ["id", "createdAt", "updatedAt", "deletedAt"]
      }
    });

    if (!user) {
      throw new NotFoundException("유저정보를 찾을 수 없습니다.")
    }

    const bossRaidHistorys = await this.bossRaidHistoryModel.findAll({
      where: { userId: id },
      attributes: {
        exclude: ["createdAt", "updatedAt", "deletedAt"]
      }
    });

    return { totalScore: user.totalScore, bossRaidHistorys }
  }
}
