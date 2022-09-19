import { Controller, Post, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('user')
export class UsersController {
  constructor(private readonly UsersService: UsersService) { }

  @Post()
  async createUserData() {
    const userId = await this.UsersService.create()
    return { userId }
  }

  @Get(":id")
  async getUserData(@Param("id") id: number) {
    const user = await this.UsersService.getOne(id)
    return user
  }
}
