import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { GamesService } from './games.service';
import { CreateGameDto } from './dto/create-game.dto';
import { JoinGameDto } from './dto/join-game.dto';
import { EndGameDto } from './dto/end-game.dto';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Post()
  create(@Body() createGameDto: CreateGameDto) {
    return this.gamesService.create(createGameDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gamesService.findOne(+id);
  }

  @Post(':id/join')
  joinGame(@Param('id') id: string, @Body() joinGameDto: JoinGameDto) {
    return this.gamesService.joinGame(+id, joinGameDto);
  }

  @Patch(':id/start')
  startGame(@Param('id') id: string) {
    return this.gamesService.startGame(+id);
  }

  @Patch(':id/end')
  endGame(@Param('id') id: string, @Body() endGameDto: EndGameDto) {
    return this.gamesService.endGame(+id, endGameDto);
  }
}