
import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class CreateMembershipRegisterDto {
  // =========================================================
  // BASIC DETAILS
  // =========================================================

  @IsNotEmpty()
  @IsString()
  full_name: string;

  @IsNotEmpty()
  @IsString()
  surname: string;

  @IsNotEmpty()
  @IsString()
  father_name: string;

  // =========================================================
  // CONTACT
  // =========================================================

  @IsNotEmpty()
  @IsString()
  @Matches(
    /^(?:[6-9]\d{9}|\+91[6-9]\d{9})$/,
    {
      message:
        'Enter a valid 10-digit Indian mobile number, with or without +91.',
    },
  )
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

  @IsNotEmpty()
  @IsString()
  location: string;

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
  // EXISTING MAHASHABA MEMBER
  // =========================================================

  @IsNotEmpty()
  @IsIn(['Yes', 'No'])
  is_existing_mahashaba_member: string;

  // =========================================================
  // EXISTING SANGAM MEMBER
  // =========================================================

  @IsNotEmpty()
  @IsIn(['Yes', 'No'])
  is_existing_sangam_member: string;

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
  // STATUS
  // =========================================================

  @IsOptional()
  @IsString()
  status?: string;
}
