import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('members')
export class Member {
  @PrimaryGeneratedColumn()
  id: number;

  // =========================================================
  // BASIC MEMBER DETAILS
  // =========================================================

  @Index()
  @Column({
    type: 'varchar',
    length: 50,
  })
  member_id: string;

  @Index()
  @Column({
    type: 'varchar',
    length: 100,
  })
  full_name: string;

  @Index()
  @Column({
    type: 'varchar',
    length: 10,
  })
  mobile: string;

  @Index()
  @Column({
    type: 'varchar',
    length: 150,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  photo: string | null;

  @Column({
    type: 'varchar',
    length: 100,
  })
  occupation: string;

  @Column({
    type: 'enum',
    enum: ['Male', 'Female'],
  })
  gender: 'Male' | 'Female';

  @Column({
    type: 'date',
  })
  date_of_birth: Date;

  // =========================================================
  // LOCATION DETAILS
  // =========================================================

  @Index()
  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  district: string | null;

  @Index()
  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  mandal: string | null;

  @Index()
  @Column({
    type: 'varchar',
    length: 150,
    nullable: true,
  })
  sangham: string | null;

  // =========================================================
  // EXECUTIVE DETAILS
  // =========================================================

  @Index()
  @Column({
    type: 'varchar',
    length: 50,
  })
  executive_body: string;

  @Index()
  @Column({
    type: 'varchar',
    length: 100,
  })
  designation: string;

  // =========================================================
  // MEMBER STATUS
  // =========================================================

  @Column({
    type: 'varchar',
    length: 30,
    default: 'Active',
  })
  status: string;

  // =========================================================
  // MAHASHABA PAYMENT DETAILS
  // =========================================================

  @Column({
    type: 'enum',
    enum: ['Paid', 'Free'],
  })
  mahashaba_payment_status: 'Paid' | 'Free';

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  mahashaba_payment_method: string | null;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  mahashaba_receipt_number: string | null;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  mahashaba_amount_paid: number | null;

  @Column({
    type: 'date',
    nullable: true,
  })
  mahashaba_payment_date: Date | null;

  // =========================================================
  // SANGAM PAYMENT DETAILS
  // =========================================================

  @Column({
    type: 'enum',
    enum: ['Paid', 'Free'],
  })
  sangam_payment_status: 'Paid' | 'Free';

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  sangam_payment_method: string | null;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  sangam_receipt_number: string | null;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  sangam_amount_paid: number | null;

  @Column({
    type: 'date',
    nullable: true,
  })
  sangam_payment_date: Date | null;

  // =========================================================
  // AVS ID
  // =========================================================
  //
  // Format:
  //
  // AVS + STATE 2 + DISTRICT 2 + MANDAL 2 + SANGAM 3
  //
  // Example:
  // AVS010101001
  //
  // Telangana
  // Ranga Reddy
  // Saroornagar
  // Champapet
  //
  // The actual numbers will be generated from
  // the location master data.
  // =========================================================

  @Index({ unique: true })
  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  avs_id: string | null;

  // =========================================================
  // MATRIMONY DETAILS
  // =========================================================

  // Example:
  // AVMS0101001
  //
  // This code is generated ONLY after
  // admin authorises the member for matrimony.

  @Index({ unique: true })
  @Column({
    type: 'varchar',
    length: 30,
    nullable: true,
  })
  matrimony_code: string | null;

  // false = Not authorised
  // true  = Authorised

  @Column({
    type: 'boolean',
    default: false,
  })
  matrimony_authorised: boolean;

  // Date on which admin authorised matrimony

  @Column({
    type: 'date',
    nullable: true,
  })
  matrimony_authorised_date: Date | null;

  // Matrimony code expiry date

  @Column({
    type: 'date',
    nullable: true,
  })
  matrimony_expiry_date: Date | null;

  // =========================================================
  // CREATED / UPDATED
  // =========================================================

  @CreateDateColumn({
    type: 'timestamp',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updated_at: Date;
}