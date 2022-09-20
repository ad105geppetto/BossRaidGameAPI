import { IsNumber } from "class-validator";

export class EnterRaidDTO {
  @IsNumber()
  readonly userId: number;
  @IsNumber()
  readonly level: number;
}