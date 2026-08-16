import {
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsString,
} from 'class-validator';

export class CreateMatrimonialUserDto {
  @IsNotEmpty()
  @IsString()
  profile_category: string;

  @IsNotEmpty()
  @IsString()
  surname: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  father_name?: string;

  @IsOptional()
  @IsString()
  mother_name?: string;

  @IsOptional()
  @IsString()
  gotram?: string;

  @IsOptional()
  @IsString()
  nakshatram?: string;

  @IsOptional()
  padham?: number;

  @IsOptional()
  @IsString()
  rasi?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  date_of_birth?: Date;

  @IsOptional()
  @IsString()
  height?: string;

  @IsOptional()
  @IsString()
  education?: string;

  @IsOptional()
  @IsString()
  occupation?: string;

  @IsOptional()
  @IsString()
  annual_income?: string;

  @IsNotEmpty()
  @IsString()
  mobile: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  family_details?: string;

  @IsOptional()
  @IsString()
  brother_details?: string;

  @IsOptional()
  @IsString()
  sister_details?: string;

  @IsOptional()
  @IsString()
  property_details?: string;

  @IsOptional()
  @IsString()
  preferred_requirements?: string;

  @IsOptional()
  @IsString()
  photo?: string;
}