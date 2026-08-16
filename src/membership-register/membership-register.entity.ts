import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('membership_register')
export class MembershipRegister {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  full_name: string;

  @Column({ length: 20 })
  mobile: string;

  @Column({ length: 150 })
  email: string;

  @Column({ length: 255 })
  password: string;

  @Column({ length: 20 })
  gender: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
  })
  created_at: Date;
}