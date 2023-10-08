import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from "typeorm";
import { Todos } from "./todo.model";

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
  })
  username: string;

  @Column({
    nullable: false,
  })
  password: string;

  @ManyToMany(() => Todos, (todos) => todos.users)
  todos: Todos[];
}
