import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateMembershipRegisterDto {
  @IsString()
  @IsNotEmpty()
  full_name: string;

  @IsString()
  @IsNotEmpty()
  mobile: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  occupation: string;

  @IsString()
  @IsNotEmpty()
  gender: string;

  @IsString()
  @IsNotEmpty()
  date_of_birth: string;

  @IsOptional()
  @IsString()
  district?: string;

  @IsOptional()
  @IsString()
  mandal?: string;

  @IsOptional()
  @IsString()
  sangham?: string;

  @IsString()
  @IsNotEmpty()
  mahashaba_payment_status: string;

  @IsOptional()
  @IsString()
  mahashaba_payment_method?: string;

  @IsOptional()
  @IsString()
  mahashaba_receipt_number?: string;

  @IsOptional()
  @IsString()
  mahashaba_amount_paid?: string;

  @IsOptional()
  @IsString()
  mahashaba_payment_date?: string;

  @IsString()
  @IsNotEmpty()
  sangam_payment_status: string;

  @IsOptional()
  @IsString()
  sangam_payment_method?: string;

  @IsOptional()
  @IsString()
  sangam_receipt_number?: string;

  @IsOptional()
  @IsString()
  sangam_amount_paid?: string;

  @IsOptional()
  @IsString()
  sangam_payment_date?: string;

  @IsOptional()
  @IsString()
  executive_body?: string;

  @IsOptional()
  @IsString()
  designation?: string;
}