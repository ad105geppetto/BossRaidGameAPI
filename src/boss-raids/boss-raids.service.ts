import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import Radis from "ioredis"
import axios from 'axios';
import { BossRaidHistory } from '../users/models/bossRaidHistory.model';
import { User } from '../users/models/user.model';
import { EndRaidDTO } from './dto/end-raid.dto';
import { EnterRaidDTO } from './dto/enter-raid.dto';
import { GetRankerListDTO } from "./dto/get-ranker-list.dto"
import { InjectRedis } from '@liaoliaots/nestjs-redis';

@Injectable()
export class BossRaidsService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,

    @InjectModel(BossRaidHistory)
    private bossRaidHistoryModel: typeof BossRaidHistory,

    @InjectRedis()
    private readonly redis: Radis
  ) { }
  private readonly queue = [];
  private canEnter = true;
  private isEntered = false;

  async getRaidState() {
    if (this.canEnter) {
      return { canEnter: this.canEnter }
    } else {
      return { canEnter: this.canEnter, enteredUserId: this.queue[0] }
    }
  }

  async getTopRankerList(getRankerListData: GetRankerListDTO) {
    const user = await this.userModel.findByPk(getRankerListData.userId)

    if (!user) {
      throw new NotFoundException("유저정보를 찾을 수 없습니다")
    }

    const result = await this.redis.zrevrange('user_score', 0, -1);
    const topRankerInfoList = await Promise.all(result.map(async (user, index) => {
      const ranking = index
      const id = user.replace(/[^0-9]/g, "")
      const totalScore = await this.redis.zscore("user_score", `user:${id}`)

      return { ranking: ranking, userId: +id, totalScore: +totalScore }
    }))

    const myRank = await this.redis.zrevrank('user_score', `user:${getRankerListData.userId}`)
    const myRankingInfo = {
      ranking: myRank,
      userId: getRankerListData.userId,
      totalScore: +await this.redis.zscore("user_score", `user:${getRankerListData.userId}`)
    }

    return {
      topRankerInfoList: topRankerInfoList,
      myRankingInfo: myRankingInfo
    }
  }

  async enterRaid(enterData: EnterRaidDTO) {
    const user = await this.userModel.findByPk(enterData.userId)

    if (!user) {
      throw new NotFoundException("유저정보를 찾을 수 없습니다")
    }

    if (this.canEnter) {
      const { data } = await axios.get("https://dmpilf5svl7rv.cloudfront.net/assignment/backend/bossRaidData.json")
      const bossRaidsData = data.bossRaids[0]
      const raidInfo = bossRaidsData.levels.find((data: any) => data.level === enterData.level)

      if (!raidInfo) {
        throw new NotFoundException("보스레이드 레벨을 찾을 수 없습니다")
      }

      const score = raidInfo.score
      this.queue.push({ userId: enterData.userId, score: score });
      this.canEnter = false;
      this.isEntered = true;

      const bossRaid = await this.bossRaidHistoryModel.create({ userId: enterData.userId })
      return { isEntered: this.isEntered, raidRecordId: bossRaid.raidRecordId }
    } else {
      return { canEnter: this.canEnter }
    }
  }

  async endRaid(endData: EndRaidDTO) {
    const user = await this.userModel.findByPk(endData.userId)
    const raidHistory = await this.bossRaidHistoryModel.findOne({
      where: {
        raidRecordId: endData.raidRecordId
      }
    })

    if (!user) {
      throw new NotFoundException("유저정보를 찾을 수 없습니다")
    }

    if (!raidHistory) {
      throw new NotFoundException("보스레이드 정보를 찾을 수 없습니다")
    }

    if (!this.canEnter) {
      const { score } = this.queue.pop();
      this.canEnter = true;
      this.isEntered = false;
      const { totalScore } = await this.userModel.findOne({ where: { id: endData.userId } })
      await this.userModel.update({ totalScore: totalScore + score }, { where: { id: endData.userId } })
      await this.bossRaidHistoryModel.update({ score: score, endTime: new Date() }, { where: { raidRecordId: endData.raidRecordId } })

      const user_score = await this.redis.zscore('user_score', `user:${endData.userId}`);
      await this.redis.zadd('user_score', +user_score + score, `user:${endData.userId}`);

    } else {
      return { canEnter: this.canEnter }
    }
  }

}
