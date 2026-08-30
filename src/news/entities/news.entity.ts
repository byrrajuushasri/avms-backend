import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("news")
export class News {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "varchar",
    length: 255,
  })
  title: string;

  @Column({
    type: "text",
  })
  description: string;

  @Column({
    type: "varchar",
    length: 50,
  })
  category: string;

  @Column({
    type: "varchar",
    length: 150,
    nullable: true,
  })
  location: string | null;

  @Column({
    type: "date",
  })
  date: string;

  @Column({
    name: "media_type",
    type: "varchar",
    length: 20,
  })
  mediaType: string;

  @Column({
    name: "media_url",
    type: "varchar",
    length: 500,
    nullable: true,
  })
  mediaUrl: string | null;

  @Column({
    type: "boolean",
    default: false,
  })
  featured: boolean;

  @Column({
    type: "varchar",
    length: 20,
    default: "Active",
  })
  status: string;

  @CreateDateColumn({
    name: "created_at",
    type: "datetime",
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: "updated_at",
    type: "datetime",
  })
  updatedAt: Date;
}