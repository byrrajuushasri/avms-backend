import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export type MatrimonialInterestRequestStatus =
  'Pending' | 'Accepted' | 'Rejected';

@Entity('matrimonial_interest_requests')
@Index(
  'uq_matrimonial_interest_pair',
  ['sender_profile_id', 'recipient_profile_id'],
  {
    unique: true,
  },
)
@Index('idx_matrimonial_interest_recipient_status', [
  'recipient_profile_id',
  'status',
])
export class MatrimonialInterestRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  sender_profile_id: number;

  @Column({ type: 'int' })
  recipient_profile_id: number;

  @Column({
    type: 'varchar',
    length: 20,
    default: 'Pending',
  })
  status: MatrimonialInterestRequestStatus;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
