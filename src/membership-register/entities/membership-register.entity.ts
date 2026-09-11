import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("members")
export class MembershipRegister {
  @PrimaryGeneratedColumn()
  id: number;

  /* =====================================================
     MEMBER ID
  ===================================================== */

  @Column({
    type: "varchar",
    length: 30,
    unique: true,
  })
  member_id: string;

  /* =====================================================
     PERSONAL DETAILS
  ===================================================== */

  @Column({
    type: "varchar",
    length: 150,
  })
  full_name: string;

  @Column({
    type: "varchar",
    length: 100,
    nullable: true,
  })
  surname: string | null;

  @Column({
    type: "varchar",
    length: 100,
    nullable: true,
  })
  father_name: string | null;

  @Column({
    type: "varchar",
    length: 20,
  })
  mobile: string;

  @Column({
    type: "varchar",
    length: 150,
  })
  email: string;

  @Column({
    type: "varchar",
    length: 255,
    nullable: true,
  })
  password: string | null;

  @Column({
    type: "varchar",
    length: 30,
    default: "user",
  })
  role: string;

  @Column({
    type: "varchar",
    length: 500,
    nullable: true,
  })
  photo: string | null;

  /* =====================================================
     EDUCATION & OCCUPATION
  ===================================================== */

  @Column({
    type: "varchar",
    length: 100,
    nullable: true,
  })
  occupation: string | null;

  /* =====================================================
     GENDER & DOB
  ===================================================== */

  @Column({
    type: "varchar",
    length: 20,
  })
  gender: string;

  @Column({
    type: "date",
  })
  date_of_birth: string;

  /* =====================================================
     GOTRAM
  ===================================================== */

  @Column({
    type: "varchar",
    length: 100,
    nullable: true,
  })
  gotram: string | null;

  /* =====================================================
     LOCATION
  ===================================================== */

  @Column({
    type: "varchar",
    length: 150,
    nullable: true,
  })
  location: string | null;

  @Column({
    type: "varchar",
    length: 100,
    nullable: true,
  })
  district: string | null;

  @Column({
    type: "varchar",
    length: 100,
    nullable: true,
  })
  mandal: string | null;

  @Column({
    type: "varchar",
    length: 150,
    nullable: true,
  })
  sangham: string | null;

  /* =====================================================
     EXISTING MEMBERSHIP DETAILS
     DB: VARCHAR(10)
     Values: Yes / No
  ===================================================== */

  @Column({
    type: "varchar",
    length: 10,
    nullable: true,
  })
  is_existing_mahashaba_member: string | null;

  @Column({
    type: "varchar",
    length: 10,
    nullable: true,
  })
  is_existing_sangam_member: string | null;

  /* =====================================================
     COMMUNITY MEMBERSHIP
  ===================================================== */

  @Column({
    type: "varchar",
    length: 100,
    nullable: true,
  })
  executive_body: string | null;

  @Column({
    type: "varchar",
    length: 100,
    nullable: true,
  })
  designation: string | null;

  /* =====================================================
     STATUS
  ===================================================== */

  @Column({
    type: "varchar",
    length: 30,
    default: "Active",
  })
  status: string;

  /* =====================================================
     OLD MAHASHABA PAYMENT DETAILS
  ===================================================== */

  @Column({
    type: "varchar",
    length: 30,
    nullable: true,
  })
  mahashaba_payment_status: string | null;

  @Column({
    type: "varchar",
    length: 50,
    nullable: true,
  })
  mahashaba_payment_method: string | null;

  @Column({
    type: "varchar",
    length: 50,
    nullable: true,
  })
  mahashaba_receipt_number: string | null;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 2,
    nullable: true,
  })
  mahashaba_amount_paid: number | null;

  @Column({
    type: "date",
    nullable: true,
  })
  mahashaba_payment_date: string | null;

  /* =====================================================
     OLD SANGAM PAYMENT DETAILS
  ===================================================== */

  @Column({
    type: "varchar",
    length: 30,
    nullable: true,
  })
  sangam_payment_status: string | null;

  @Column({
    type: "varchar",
    length: 50,
    nullable: true,
  })
  sangam_payment_method: string | null;

  @Column({
    type: "varchar",
    length: 50,
    nullable: true,
  })
  sangam_receipt_number: string | null;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 2,
    nullable: true,
  })
  sangam_amount_paid: number | null;

  @Column({
    type: "date",
    nullable: true,
  })
  sangam_payment_date: string | null;

  /* =====================================================
     TIMESTAMPS
  ===================================================== */

  @CreateDateColumn({
    type: "timestamp",
  })
  created_at: Date;

  @UpdateDateColumn({
    type: "timestamp",
  })
  updated_at: Date;
}

