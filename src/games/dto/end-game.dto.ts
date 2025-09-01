import { IsObject, IsOptional } from 'class-validator';

export class EndGameDto {
  @IsObject()
  @IsOptional()
  score?: Record<string, number>;
}