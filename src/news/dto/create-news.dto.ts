import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";

export class CreateNewsDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsIn([
    "State News",
    "District News",
    "Mandal News",
    "Sangam News",
  ])
  category: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  location?: string;

  @IsString()
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsIn(["Image", "Video"])
  mediaType: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  mediaUrl?: string;

  @IsOptional()
  @IsString()
  featured?: string;

  @IsOptional()
  @IsIn(["Active", "Inactive"])
  status?: string;
}