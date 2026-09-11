import {
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

export class UpdateMembershipRegisterDto {
  @IsOptional()
  @IsString()
  full_name?: string;

  @IsOptional()
  @IsString()
  surname?: string;

  @IsOptional()
  @IsString()
  father_name?: string;

  @IsOptional()
  @IsString()
  mobile?: string;

  @IsOptional()
  @IsString()
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

  @IsOptional()
  @IsString()
  gotram?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  district?: string;

  @IsOptional()
  @IsString()
  mandal?: string;

  @IsOptional()
  @IsString()
  sangham?: string;

  @IsOptional()
  @IsIn(["Yes", "No"])
  is_existing_mahashaba_member?: string;

  @IsOptional()
  @IsIn(["Yes", "No"])
  is_existing_sangam_member?: string;

  @IsOptional()
  @IsString()
  executive_body?: string;

  @IsOptional()
  @IsString()
  designation?: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsString()
  status?: string;

  // ==========================================
  // PAYMENT FIELDS
  // Keep these for existing admin/payment updates
  // ==========================================

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
  @IsNumber()
  mahashaba_amount_paid?: number;

  @IsOptional()
  @IsString()
  mahashaba_payment_date?: string;

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
  @IsNumber()
  sangam_amount_paid?: number;

  @IsOptional()
  @IsString()
  sangam_payment_date?: string;
}