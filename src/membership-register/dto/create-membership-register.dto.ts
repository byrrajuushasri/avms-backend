import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateMembershipRegisterDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  full_name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  mobile: string;

  @IsNotEmpty()
  @IsEmail()
  @MaxLength(150)
  email: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  password: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  gender: string;
}