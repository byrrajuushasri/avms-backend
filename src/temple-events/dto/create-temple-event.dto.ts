import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";

export class CreateTempleEventDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  temple: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  area: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  district: string;

  @IsDateString()
  date: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  time: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  type: string;

  @IsOptional()
  @IsBoolean()
  status?: boolean;
}