import { IsObject } from 'class-validator';

export class EndGameDto {
  @IsObject()
  score: Record<string, number>;
}
