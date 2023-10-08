import { DataSource } from "typeorm";
import { Users } from "../model/user.model";
import { Todos } from "../model/todo.model";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "postgres",
  port: 5432,
  username: "root",
  password: "password",
  database: "todo",
  entities: [Users, Todos],
  synchronize: true,
  logging: false,
});

export function initilaze() {
  AppDataSource.initialize()
    .then(() => console.log("Your db is 🚀"))
    .catch((error) => console.log(error.message));
}

initilaze();
