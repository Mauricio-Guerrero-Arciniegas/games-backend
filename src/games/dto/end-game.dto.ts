import { IsNumber } from 'class-validator';

export class EndGameDto {
  @IsNumber()
  score: number;
}