import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { BossRaidHistory } from "src/users/models/bossRaidHistory.model"
import { User } from "src/users/models/user.model"

@Module({
  imports: [
    ConfigModule.forRoot(),
    SequelizeModule.forRoot({
      dialect: "mysql",
      host: process.env.DATABASE_HOST || "localhost",
      username: process.env.DATABASE_USER || "root",
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME || "bossraidgame",
      port: parseInt(process.env.DATABASE_PORT) || 3306,
      models: [User, BossRaidHistory],
      synchronize: true,
      autoLoadModels: true
    }),
    UsersModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
