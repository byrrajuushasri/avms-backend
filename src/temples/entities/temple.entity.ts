import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("temples")
export class Temple {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 255 })
  name: string;

  @Column({ type: "varchar", length: 150 })
  area: string;

  @Column({ type: "varchar", length: 150 })
  district: string;

  @Column({ type: "varchar", length: 500 })
  address: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  phone: string | null;

  @Column({ type: "varchar", length: 255, nullable: true })
  timings: string | null;

  @Column({ type: "text", nullable: true })
  description: string | null;

  @Column({ type: "varchar", length: 500 })
  map_url: string;

  @Column({ type: "varchar", length: 500, nullable: true })
  image: string | null;

  @Column({ type: "boolean", default: true })
  status: boolean;

  @CreateDateColumn({ type: "datetime" })
  created_at: Date;

  @UpdateDateColumn({ type: "datetime" })
  updated_at: Date;
}