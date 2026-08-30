
import {
  IsEmail,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateMembershipRegisterDto {
  @IsOptional()
  @IsString()
  full_name?: string;

  @IsOptional()
  @IsString()
  mobile?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  gender?: string;

    @IsOptional()
  @IsString()
  role?: string;
}

