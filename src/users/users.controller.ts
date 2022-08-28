import { Controller, Get } from '@nestjs/common';
import { Game } from '../game.provider';

@Controller('users')
export class UsersController {
  @Get()
  async getAllUsers() {
    return '123';
  }
}
