import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Game } from './entities/game.entity';
import { CreateGameDto, GameState } from './dto/create-game.dto';
import { JoinGameDto } from './dto/join-game.dto';
import { EndGameDto } from './dto/end-game.dto';

@Injectable()
export class GamesService {
  private readonly logger = new Logger('GamesService');

  constructor(
    @InjectModel(Game)
    private gameModel: typeof Game,
  ) {}

  async create(createGameDto: CreateGameDto) {
    const { name, maxPlayers, playerName, state } = createGameDto;

    try {
      const newGame = await this.gameModel.create({
        name,
        maxPlayers,
        players: playerName ? [playerName] : [],
        state: state || GameState.WAITING,
        score: null,
      });

      return newGame;
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async findOne(id: number) {
    const game = await this.gameModel.findOne({ where: { id } });

    if (!game) {
      throw new BadRequestException(`Game with id: ${id} not found`);
    }
    return game;
  }

  findAll() {
  return this.gameModel.findAll();
}

  async joinGame(id: number, { playerName }: JoinGameDto) {
    const game = await this.findOne(id);

    if (game.dataValues.players.includes(playerName)) {
      throw new BadRequestException('The player has already joined!');
    }

    const newPlayers = [...game.dataValues.players, playerName];

    if (newPlayers.length > game.dataValues.maxPlayers) {
      throw new BadRequestException('The game is full!');
    }

    try {
      await game.update({ players: newPlayers });
      return { message: 'Joined success!' };
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async startGame(id: number) {
    const game = await this.findOne(id);

    try {
      await game.update({ state: GameState.IN_PROGRESS });
      return { message: 'The game has been started' };
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async endGame(id: number, { score }: EndGameDto) {
    const game = await this.findOne(id);

    try {
      await game.update({
        score,
        state: GameState.FINISHED,
      });
      return { message: 'Game finished' };
    } catch (error) {
      this.handleDBException(error);
    }
  }

  private handleDBException(error: any) {
    if (error?.parent?.code === '23505') {
      throw new BadRequestException(error.parent.detail);
    }

    this.logger.error(error);
    throw new InternalServerErrorException('Something went very wrong!');
  }

  // games.service.ts
async remove(id: number) {
  const game = await this.gameModel.findByPk(id);
  if (!game) throw new NotFoundException('Game not found');
  await game.destroy();
  return { message: 'Game deleted successfully' };
}
}