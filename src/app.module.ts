import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { BossRaidsModule } from './boss-raids/boss-raids.module';
import { BossRaidHistory } from './users/models/bossRaidHistory.model';
import { User } from './users/models/user.model';
import { RedisModule, RedisModuleOptions } from '@liaoliaots/nestjs-redis';

@Module({
  imports: [
    ConfigModule.forRoot(),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (): Promise<RedisModuleOptions> => {
        return {
          config: {
            host: 'localhost',
            port: parseInt(process.env.REDIS_PORT),
          }
        };
      }
    }),
    SequelizeModule.forRootAsync({
      useFactory: () => ({
        dialect: "mysql",
        host: process.env.DATABASE_HOST || "localhost",
        username: process.env.DATABASE_USER || "root",
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME || "bossraidgame",
        port: parseInt(process.env.DATABASE_PORT) || 3306,
        models: [User, BossRaidHistory],
        synchronize: true,
        autoLoadModels: true,
        logging: false
      }),
    }),
    UsersModule,
    BossRaidsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
