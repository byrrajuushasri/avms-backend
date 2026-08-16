import { IsEmail, IsIn, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @MinLength(8)
  password: string;

  @IsIn(['Admin', 'User'])
  userType: string;

  @IsIn(['Pending', 'Active', 'Suspended'])
  status: string;
}