import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum LocationType {
  DISTRICT = 'district',
  MANDAL = 'mandal',
  SANGHAM = 'sangham',
}

@Entity('locations')
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  name: string;

  @Column({
    type: 'enum',
    enum: LocationType,
  })
  type: LocationType;

  @Column({ type: 'int', nullable: true })
  parent_id: number | null;

  @ManyToOne(() => Location, (location) => location.children, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'parent_id' })
  parent: Location | null;

  @OneToMany(() => Location, (location) => location.parent)
  children: Location[];
}