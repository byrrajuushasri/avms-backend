import {
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateMembershipRegisterDto {
  // =========================================================
  // BASIC DETAILS
  // =========================================================

  @IsNotEmpty()
  @IsString()
  full_name: string;

  @IsOptional()
  @IsString()
  surname?: string;

  @IsOptional()
  @IsString()
  location?: string;

  // =========================================================
  // CONTACT
  // =========================================================

  @IsNotEmpty()
  @IsString()
  mobile: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  password?: string;

  // =========================================================
  // USER DETAILS
  // =========================================================

  @IsNotEmpty()
  @IsString()
  occupation: string;

  @IsNotEmpty()
  @IsString()
  gender: string;

  @IsNotEmpty()
  @IsString()
  date_of_birth: string;

  // =========================================================
  // GOTRAM
  // =========================================================

  @IsNotEmpty()
  @IsString()
  gotram: string;

  // =========================================================
  // LOCATION
  // =========================================================

  @IsOptional()
  @IsString()
  district?: string;

  @IsOptional()
  @IsString()
  mandal?: string;

  @IsOptional()
  @IsString()
  sangham?: string;

  // =========================================================
  // EXECUTIVE
  // =========================================================

  @IsOptional()
  @IsString()
  executive_body?: string;

  @IsOptional()
  @IsString()
  designation?: string;

  // =========================================================
  // STATUS
  // =========================================================

  @IsOptional()
  @IsString()
  status?: string;

  // =========================================================
  // MAHASHABA PAYMENT
  // =========================================================

  @IsOptional()
  @IsString()
  mahashaba_payment_status?: string;

  @IsOptional()
  @IsString()
  mahashaba_payment_method?: string;

  @IsOptional()
  @IsString()
  mahashaba_receipt_number?: string;

  @IsOptional()
  mahashaba_amount_paid?: number | string;

  @IsOptional()
  @IsString()
  mahashaba_payment_date?: string;

  // =========================================================
  // SANGAM PAYMENT
  // =========================================================

  @IsOptional()
  @IsString()
  sangam_payment_status?: string;

  @IsOptional()
  @IsString()
  sangam_payment_method?: string;

  @IsOptional()
  @IsString()
  sangam_receipt_number?: string;

  @IsOptional()
  sangam_amount_paid?: number | string;

  @IsOptional()
  @IsString()
  sangam_payment_date?: string;
}