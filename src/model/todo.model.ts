import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { Users } from "./user.model";

@Entity()
export class Todos {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
  })
  title: string;

  @Column({
    nullable: false,
  })
  text: string;

  @Column({
    default: false,
  })
  isCompleted: boolean;

  @ManyToMany(() => Users, (users) => users.todos, { cascade: true })
  @JoinTable()
  users: Users[];
}
