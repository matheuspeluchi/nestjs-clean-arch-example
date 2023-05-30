import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'todo' })
export class Todo {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @Column('varchar', { length: 255, nullable: true })
  title: string;

  @Column('varchar', { length: 255, nullable: true })
  description: string;

  @Column('boolean', { default: false })
  isDone: boolean;

  @CreateDateColumn({ name: 'createdAt', default: new Date() })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;
}
