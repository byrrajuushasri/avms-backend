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
  occupation?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsString()
  date_of_birth?: string;

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
  // EXECUTIVE DETAILS
  // =========================================================

  @IsOptional()
  @IsString()
  executive_body?: string;

  @IsOptional()
  @IsString()
  designation?: string;

  // =========================================================
  // ROLE
  // =========================================================

  @IsOptional()
  @IsString()
  role?: string;

  // =========================================================
  // PASSWORD
  // =========================================================

  @IsOptional()
  @IsString()
  password?: string;

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
  @IsString()
  mahashaba_amount_paid?: string;

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
  @IsString()
  sangam_amount_paid?: string;

  @IsOptional()
  @IsString()
  sangam_payment_date?: string;
}