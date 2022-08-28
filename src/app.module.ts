import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { GameModule } from './game/game.module';
import { Game } from './game.provider';

@Module({
  imports: [UsersModule, GameModule],
  controllers: [AppController],
  providers: [AppService, Game],
  exports: [Game],
})
export class AppModule {
  // constructor(private game: Game) {}
}
