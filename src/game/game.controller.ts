import { Controller, Get } from '@nestjs/common';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
  constructor(private gameProvider: GameService) {}

  @Get()
  async getAllUsers() {
    return this.gameProvider.test();
  }
}
