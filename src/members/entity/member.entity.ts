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

  @Index()
  @Column({ type: 'varchar', length: 50 })
  member_id: string;

  @Index()
  @Column({ type: 'varchar', length: 100 })
  full_name: string;

  @Index()
  @Column({ type: 'varchar', length: 10 })
  mobile: string;

  @Index()
  @Column({ type: 'varchar', length: 150 })
  email: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  photo: string | null;

  @Column({ type: 'varchar', length: 100 })
  occupation: string;

  @Column({
    type: 'enum',
    enum: ['Male', 'Female'],
  })
  gender: 'Male' | 'Female';

  @Column({ type: 'date' })
  date_of_birth: Date;

  @Index()
  @Column({ type: 'varchar', length: 100, nullable: true })
  district: string | null;

  @Index()
  @Column({ type: 'varchar', length: 100, nullable: true })
  mandal: string | null;

  @Index()
  @Column({ type: 'varchar', length: 150, nullable: true })
  sangham: string | null;

  @Index()
  @Column({ type: 'varchar', length: 50 })
  executive_body: string;

  @Index()
  @Column({ type: 'varchar', length: 100 })
  designation: string;

  @Column({
    type: 'varchar',
    length: 30,
    default: 'Active',
  })
  status: string;

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

  @CreateDateColumn({
    type: 'timestamp',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updated_at: Date;
}