import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("satrams")
export class Satram {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "varchar",
    length: 255,
  })
  name: string;

  @Column({
    type: "varchar",
    length: 150,
    nullable: true,
  })
  state: string | null;

  @Column({
    type: "varchar",
    length: 150,
    nullable: true,
  })
  district: string | null;

  @Column({
    type: "varchar",
    length: 150,
    nullable: true,
  })
  mandal: string | null;

  @Column({
    type: "varchar",
    length: 255,
    nullable: true,
  })
  sangam: string | null;

  @Column({
    type: "varchar",
    length: 150,
    nullable: true,
  })
  place: string | null;

  @Column({
    type: "text",
    nullable: true,
  })
  address: string | null;

  @Column({
    type: "varchar",
    length: 50,
    nullable: true,
  })
  contact: string | null;

  @Column({
    type: "boolean",
    default: true,
  })
  annadanam: boolean;

  @Column({
    type: "boolean",
    default: true,
  })
  accommodation: boolean;

  @Column({
    type: "text",
    nullable: true,
  })
  description: string | null;

  @Column({
    type: "varchar",
    length: 500,
    nullable: true,
  })
  mapUrl: string | null;

  @CreateDateColumn({
    type: "datetime",
  })
  created_at: Date;

  @UpdateDateColumn({
    type: "datetime",
  })
  updated_at: Date;
}