import { Injectable } from '@nestjs/common';

@Injectable()
export class Game {
  id: number;
  constructor() {
    this.id = 0;
  }
  getAllGames() {
    return this.id++;
  }

  getGameById(id: number) {
    return id + 100;
  }
}
