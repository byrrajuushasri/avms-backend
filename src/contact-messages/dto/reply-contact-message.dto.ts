import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class ReplyContactMessageDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(10000)
  reply: string;
}
