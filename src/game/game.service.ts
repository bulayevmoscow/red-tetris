import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Game } from '../game.provider';

@Injectable()
export class GameService {
  constructor(@Inject(forwardRef(() => Game)) private gameService: Game) {}

  test() {
    return this.gameService.getAllGames();
  }
}
