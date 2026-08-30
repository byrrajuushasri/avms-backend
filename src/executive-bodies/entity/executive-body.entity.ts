import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('executive_bodies')
export class ExecutiveBody {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  executive_body: string;

  @Column({ length: 100, nullable: true })
  state: string;

  @Column({ length: 100, nullable: true })
  district: string;

  @Column({ length: 100, nullable: true })
  mandal: string;

  @Column({ length: 150, nullable: true })
  sangham: string;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'date' })
  formation_date: string;

  @Column({ type: 'text' })
  description: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}