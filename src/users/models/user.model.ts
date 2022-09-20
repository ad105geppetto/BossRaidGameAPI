import { Column, Model, Table, HasMany } from 'sequelize-typescript';
import { BossRaidHistory } from './bossRaidHistory.model';

@Table({
  paranoid: true,
  timestamps: true,
  tableName: "users"
})
export class User extends Model {
  @Column({ defaultValue: 0 })
  totalScore: number;

  @HasMany(() => BossRaidHistory)
  bossRaidHistorys: BossRaidHistory[];
}