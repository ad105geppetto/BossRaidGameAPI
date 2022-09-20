import { IsNumber } from "class-validator";

export class EndRaidDTO {
  @IsNumber()
  readonly userId: number;
  @IsNumber()
  readonly raidRecordId: number;
}