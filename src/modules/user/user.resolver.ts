import { GraphQLError } from "graphql";
import { Info, Token } from "./user.types";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../../config/connection";
import { Users } from "../../model/user.model";
import bcrypt from "bcrypt";
import "dotenv/config";

export default {
  Query: {
    user: async (_: any, __: any, { access_token }: Token) => {
      try {
        if (!process.env.SECRET_KEY) {
          return new GraphQLError("SECRET_KEY does not come from .env", {
            extensions: {
              http: { status: 400 },
            },
          });
        }

        jwt.verify(access_token, process.env.SECRET_KEY);

        return await AppDataSource.manager.find(Users, {
          relations: {
            todos: true,
          },
        });
      } catch (error: any) {
        return new GraphQLError("user is not authenficated", {
          extensions: {
            code: "UNAUTHENFICATED",

            http: { status: 401 },
          },
        });
      }
    },
  },

  Mutation: {
    signUp: async (_: any, { username, password }: Info) => {
      try {
        const findUser = await AppDataSource.manager.findOneBy(Users, {
          username,
        });

        if (findUser) {
          return new GraphQLError("user is already exist", {
            extensions: {
              http: { status: 400 },
            },
          });
        }

        if (!process.env.SECRET_KEY) {
          return new GraphQLError("SECRET_KEY does not come from .env", {
            extensions: {
              http: { status: 400 },
            },
          });
        }

        const toHash = await bcrypt.hash(password, 10);

        const newUser = new Users();
        newUser.username = username;
        newUser.password = toHash;

        await AppDataSource.manager.save(newUser);

        const token = jwt.sign({ id: newUser.id }, process.env.SECRET_KEY);

        return {
          success: true,
          data: newUser,
          access_token: token,
        };
      } catch (error: any) {
        return new GraphQLError(
          "this error is from signUp function of Mutation"
        );
      }
    },

    singIn: async (_: any, { username, password }: Info) => {
      try {
        const findUser = await AppDataSource.manager.findOneBy(Users, {
          username,
        });

        if (!findUser) {
          return new GraphQLError("user is not found", {
            extensions: {
              code: "BAD_REQUEST",

              http: { status: 400 },
            },
          });
        }

        const comparePassword: boolean = await bcrypt.compare(
          password,
          findUser.password
        );

        if (!comparePassword) {
          return new GraphQLError("invalid username or password");
        }
        if (!process.env.SECRET_KEY) {
          throw new GraphQLError("SECRET_KEY does not come from .env", {
            extensions: {
              http: { status: 400 },
            },
          });
        }

        const token = jwt.sign({ id: findUser.id }, process.env.SECRET_KEY);

        return {
          success: true,
          data: findUser,
          access_token: token,
        };
      } catch (error: any) {
        return new GraphQLError(error.message, {
          extensions: {
            http: { status: error.extensions.http.status },
          },
        });
      }
    },
  },
};
