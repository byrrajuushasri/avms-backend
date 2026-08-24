import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('matrimonial')
export class MatrimonialUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
  unique: true,
  nullable: true,
})
member_id: string;

  @Column()
  profile_category: string;

  @Column()
  surname: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  father_name: string;

  @Column({ nullable: true })
  mother_name: string;

  @Column({ nullable: true })
  gotram: string;

  @Column({ nullable: true })
  nakshatram: string;

  @Column({
  type: 'int',
  nullable: true,
})
padham: number | null = null;

  @Column({ nullable: true })
  rasi: string;

  @Column({ nullable: true })
  color: string;

  @Column({ type: 'date', nullable: true })
date_of_birth: Date | null;

  @Column({ nullable: true })
  height: string;

  @Column({ nullable: true })
  education: string;

  @Column({ nullable: true })
  occupation: string;

  @Column({ nullable: true })
  annual_income: string;

  @Column({ unique: true })
  mobile: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ type: 'text', nullable: true })
  family_details: string;

  @Column({ type: 'text', nullable: true })
  brother_details: string;

  @Column({ type: 'text', nullable: true })
  sister_details: string;

  @Column({ type: 'text', nullable: true })
  property_details: string;

  @Column({ type: 'text', nullable: true })
  preferred_requirements: string;

  // =====================================================
// PHOTO
// =====================================================

@Column({
  type: 'varchar',
  length: 255,
  nullable: true,
})
photo: string | null = null;
  @Column({
    type: 'enum',
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
  })
  status: string;

  @Column({
    type: 'enum',
    enum: ['Free', 'Silver', 'Gold', 'Platinum'],
    default: 'Free',
  })
  membership: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}