import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('password_reset_tokens')
export class PasswordResetToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 64, unique: true })
  token_hash: string;

  @Column({ type: 'varchar', length: 30 })
  member_id: string;

  @Column({ type: 'varchar', length: 20 })
  account_type: 'member' | 'matrimonial';

  @Column({ type: 'datetime' })
  expires_at: Date;

  @Column({ type: 'datetime', nullable: true })
  used_at: Date | null;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;
}
