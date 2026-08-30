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
    type: 'varchar',
    length: 50,
    unique: true,
  })
  member_id: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  profile_category: string | null;

  @Column({
    type: 'varchar',
    length: 150,
    nullable: true,
  })
  father_name: string | null;

  @Column({
    type: 'varchar',
    length: 150,
    nullable: true,
  })
  mother_name: string | null;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  father_gotram: string | null;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  mother_gotram: string | null;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  grandmother_gotram: string | null;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  nakshatram: string | null;

  @Column({
    type: 'int',
    nullable: true,
  })
  padham: number | null;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  rasi: string | null;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  color: string | null;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  height: string | null;

  @Column({
    type: 'varchar',
    length: 150,
    nullable: true,
  })
  education: string | null;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  annual_income: string | null;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  password: string | null;

  @Column({
    type: 'text',
    nullable: true,
  })
  address: string | null;

  @Column({
    type: 'text',
    nullable: true,
  })
  family_details: string | null;

  @Column({
    type: 'text',
    nullable: true,
  })
  brother_details: string | null;

  @Column({
    type: 'text',
    nullable: true,
  })
  sister_details: string | null;

  @Column({
    type: 'text',
    nullable: true,
  })
  property_details: string | null;

  @Column({
    type: 'text',
    nullable: true,
  })
  preferred_requirements: string | null;

  @Column({
    type: 'varchar',
    length: 30,
    nullable: true,
    default: 'Pending',
  })
  status: string | null;

  @CreateDateColumn({
    type: 'timestamp',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updated_at: Date;
}