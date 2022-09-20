import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { BossRaidsService } from './boss-raids.service';
import { EndRaidDTO } from './dto/end-raid.dto';
import { EnterRaidDTO } from './dto/enter-raid.dto';
import { GetRankerListDTO } from "./dto/get-ranker-list.dto"

interface RankingInfo {
  ranking: number; // 랭킹 1위의 ranking 값은 0입니다.
  userId: number;
  totalScore: number;
}

interface TopRankerListInfo {
  topRankerInfoList: RankingInfo[],
  myRankingInfo: RankingInfo
}

@Controller('bossRaid')
export class BossRaidsController {
  constructor(private readonly BossRaidsService: BossRaidsService) { }

  @Get()
  getRaidState() {
    const data = this.BossRaidsService.getRaidState()
    return data
  }

  @Post("/topRankerList")
  async getTopRankerList(@Body() getRankerListData: GetRankerListDTO): Promise<TopRankerListInfo> {
    const data = await this.BossRaidsService.getTopRankerList(getRankerListData)
    return data
  }

  @Post("/enter")
  async enterRaid(@Body() enterData: EnterRaidDTO) {
    const data = await this.BossRaidsService.enterRaid(enterData)
    return data
  }

  @Patch("/end")
  async endRaid(@Body() endData: EndRaidDTO) {
    const data = await this.BossRaidsService.endRaid(endData)
    return data
  }
}
