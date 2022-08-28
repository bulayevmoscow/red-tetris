import { forwardRef, Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { AppModule } from '../app.module';
import { GameService } from './game.service';

@Module({
  imports: [forwardRef(() => AppModule)],
  controllers: [GameController],
  providers: [GameService],
})
export class GameModule {}
