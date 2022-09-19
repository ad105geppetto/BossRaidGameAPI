import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BossRaidHistory } from './models/bossRaidHistory.model';
import { User } from './models/user.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,

    @InjectModel(BossRaidHistory)
    private bossRaidHistoryModel: typeof BossRaidHistory
  ) { }

  async create() {
    const user = await this.userModel.create();
    console.log(user.id)
    return user.id
  }

  async getOne(id: number) {
    const { totalScore } = await this.userModel.findOne({
      where: { id: id },
      attributes: {
        exclude: ["id", "createdAt", "updatedAt", "deletedAt"]
      }
    });

    const bossRaidHistorys = await this.bossRaidHistoryModel.findAll({
      where: { userId: id },
      attributes: {
        exclude: ["createdAt", "updatedAt", "deletedAt"]
      }
    });

    return { totalScore, bossRaidHistorys }
  }
}
