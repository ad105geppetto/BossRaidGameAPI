import { IsNumber } from "class-validator";

export class GetRankerListDTO {
  @IsNumber()
  readonly userId: number;
}