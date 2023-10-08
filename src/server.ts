import { ApolloServer } from "@apollo/server";
import "reflect-metadata";
import schema from "./modules/index";
import { startStandaloneServer } from "@apollo/server/standalone";

async function boostrap() {
  try {
    const server = new ApolloServer({
      schema,
    });

    const { url } = await startStandaloneServer(server, {
      listen: { port: 3000 },

      context: async ({ req, res }) => {
        const token = req.headers.authorization || "";

        return { access_token: token };
      },
    });

    console.log(`🚀  Server ready at: ${url}`);
  } catch (error: any) {
    console.log(error.message);
  }
}

boostrap();
