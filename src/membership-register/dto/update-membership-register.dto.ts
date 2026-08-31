import {
  IsEmail,
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
  mobile?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  password?: string;

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
  state_body?: string;

  @IsOptional()
  @IsString()
  executive_body?: string;

  @IsOptional()
  @IsString()
  designation?: string;

  // =========================================================
  // STATUS / ROLE
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

  /*
   * FormData always sends values as strings.
   * Therefore keep this as string.
   */

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

  /*
   * FormData sends this as string.
   */

  @IsOptional()
  @IsString()
  sangam_amount_paid?: string;

  @IsOptional()
  @IsString()
  sangam_payment_date?: string;
}