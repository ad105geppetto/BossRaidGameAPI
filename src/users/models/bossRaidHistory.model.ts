import { Column, Model, Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from './user.model';

@Table({
  paranoid: true,
  timestamps: true,
  tableName: "bossRaidHistory"
})
export class BossRaidHistory extends Model {
  @Column
  raidRecordId: number;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @Column
  score: number;

  @Column
  enterTime: string;

  @Column
  endTime: string;

  @BelongsTo(() => User)
  users: User
}