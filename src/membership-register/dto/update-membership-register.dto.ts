import {
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateMembershipRegisterDto {
  // =========================================================
  // BASIC DETAILS
  // =========================================================

  @IsOptional()
  @IsString()
  full_name?: string;

  @IsOptional()
  @IsString()
  surname?: string;

  @IsOptional()
  @IsString()
  location?: string;

  // =========================================================
  // CONTACT
  // =========================================================

  @IsOptional()
  @IsString()
  mobile?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  password?: string;

  // =========================================================
  // USER DETAILS
  // =========================================================

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
  // GOTRAM
  // =========================================================

  @IsOptional()
  @IsString()
  gotram?: string;

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
  // ROLE / STATUS
  // =========================================================

  @IsOptional()
  @IsString()
  role?: string;

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
  @IsString()
  sangam_amount_paid?: number | string;

  @IsOptional()
  @IsString()
  sangam_payment_date?: string;
}