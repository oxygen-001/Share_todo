import { readFileSync } from "fs";
import { resolve } from "path";

import resolvers from "./user.resolver";
const schema = readFileSync(
  resolve("src", "modules", "user", "user.schema.gql"),
  "utf-8"
);

export default {
  schema,
  resolvers,
};
