import { Column, Model, Table, ForeignKey, BelongsTo, DataType } from 'sequelize-typescript';
import { User } from './user.model';

@Table({
  paranoid: true,
  timestamps: true,
  tableName: "bossRaidHistory"
})
export class BossRaidHistory extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  })
  raidRecordId: number;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @Column({
    defaultValue: 0
  })
  score: number;

  @Column({
    type: DataType.DATE,
    defaultValue: new Date()
  })
  enterTime: string;

  @Column({
    type: DataType.DATE,
  })
  endTime: string;

  @BelongsTo(() => User)
  users: User
}