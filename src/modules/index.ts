import { makeExecutableSchema } from "@graphql-tools/schema";

import User from "./user/index";
import Todo from "./todo/index";

export default makeExecutableSchema({
  typeDefs: [User.schema, Todo.schema],
  resolvers: [User.resolvers, Todo.resolvers],
});
