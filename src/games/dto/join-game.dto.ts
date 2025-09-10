import { IsNotEmpty, IsNumber } from 'class-validator';

export class JoinGameDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;
}