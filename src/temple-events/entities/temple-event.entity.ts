import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("temple_events")
export class TempleEvent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 255 })
  title: string;

  @Column({ type: "varchar", length: 255 })
  temple: string;

  @Column({ type: "varchar", length: 150 })
  area: string;

  @Column({ type: "varchar", length: 150 })
  district: string;

  @Column({ type: "date" })
  date: string;

  @Column({ type: "varchar", length: 100 })
  time: string;

  @Column({ type: "text", nullable: true })
  description: string | null;

  @Column({ type: "varchar", length: 100 })
  type: string;

  @Column({ type: "boolean", default: true })
  status: boolean;

  @CreateDateColumn({
    name: "created_at",
    type: "timestamp",
  })
  created_at: Date;

  @UpdateDateColumn({
    name: "updated_at",
    type: "timestamp",
  })
  updated_at: Date;
}