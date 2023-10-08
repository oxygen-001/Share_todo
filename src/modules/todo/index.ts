import { readFileSync } from "fs";
import { resolve } from "path";

import resolvers from "./todo.resolver";
const schema = readFileSync(
  resolve("src", "modules", "todo", "todo.schema.gql"),
  "utf-8"
);

export default {
  resolvers,
  schema,
};
