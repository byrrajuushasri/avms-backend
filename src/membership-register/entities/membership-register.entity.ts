import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('members')
export class MembershipRegister {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 30,
    unique: true,
  })
  member_id: string;

  @Column({
    type: 'varchar',
    length: 150,
  })
  full_name: string;

  @Column({
    type: 'varchar',
    length: 20,
  })
  mobile: string;

  @Column({
    type: 'varchar',
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
    type: 'varchar',
    length: 100,
  })
  occupation: string;

  @Column({
    type: 'varchar',
    length: 20,
  })
  gender: string;

  @Column({
    type: 'date',
  })
  date_of_birth: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  district: string | null;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  mandal: string | null;

  @Column({
    type: 'varchar',
    length: 150,
    nullable: true,
  })
  sangham: string | null;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  photo: string | null;

  @Column({
    type: 'varchar',
    length: 30,
  })
  mahashaba_payment_status: string;

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
  mahashaba_payment_date: string | null;

  @Column({
    type: 'varchar',
    length: 30,
  })
  sangam_payment_status: string;

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
  sangam_payment_date: string | null;

  @Column({
    type: 'varchar',
    length: 100,
  })
  executive_body: string;

  @Column({
    type: 'varchar',
    length: 100,
  })
  designation: string;

  @CreateDateColumn({
    type: 'timestamp',
  })
  created_at: Date;
}