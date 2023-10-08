import { GraphQLError } from "graphql";
import { Token } from "../user/user.types";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../../config/connection";
import { Todos } from "../../model/todo.model";
import { SendTodo, TodoInfo, VerifyToken } from "./todo.types";
import { Users } from "../../model/user.model";

export default {
  Query: {
    todos: async (_: any, __: any, { access_token }: Token) => {
      try {
        if (!access_token) {
          throw new GraphQLError("you must enter token", {
            extensions: {
              http: { status: 400 },
            },
          });
        }
        if (!process.env.SECRET_KEY) {
          throw new GraphQLError("SECRET_KEY does not come from .env", {
            extensions: {
              http: { status: 400 },
            },
          });
        }

        const verifyToken = jwt.verify(access_token, process.env.SECRET_KEY);

        if (!verifyToken) {
          throw new GraphQLError("invalid token", {
            extensions: {
              http: { status: 400 },
            },
          });
        }

        return await AppDataSource.manager.find(Todos);
      } catch (error: any) {
        return new GraphQLError(error.message, {
          extensions: {
            http: { status: error.extensions.http.status },
          },
        });
      }
    },
  },

  Mutation: {
    addTodo: async (
      _: any,
      { title, text, isCompleted }: TodoInfo,
      { access_token }: Token
    ) => {
      try {
        if (!access_token) {
          throw new GraphQLError("you must enter token", {
            extensions: {
              http: { status: 400 },
            },
          });
        }
        if (!process.env.SECRET_KEY) {
          throw new GraphQLError("SECRET_KEY does not come from .env", {
            extensions: {
              http: { status: 400 },
            },
          });
        }

        const verifyToken = jwt.verify(access_token, process.env.SECRET_KEY);

        if (!verifyToken) {
          throw new GraphQLError("invalid token", {
            extensions: {
              http: { status: 400 },
            },
          });
        }

        const findUser = await AppDataSource.manager.findOne(Users, {
          where: {
            id: (verifyToken as VerifyToken).id,
          },

          relations: {
            todos: true,
          },
        });

        if (!findUser) {
          throw new GraphQLError("user is not found", {
            extensions: {
              http: { status: 404 },
            },
          });
        }

        const newTodo = new Todos();
        newTodo.text = text;
        newTodo.title = title;
        newTodo.isCompleted = isCompleted;

        await AppDataSource.manager.save(newTodo);

        console.log(findUser.todos.length);

        if (findUser.todos.length === 0) {
          findUser.todos = [newTodo];
          await AppDataSource.manager.save(findUser);

          return {
            success: true,
            data: newTodo,
          };
        }

        findUser.todos = [...findUser.todos, newTodo];

        await AppDataSource.manager.save(findUser);

        return {
          success: true,
          data: newTodo,
        };
      } catch (error: any) {
        return new GraphQLError(error.message, {
          extensions: {
            http: { status: error.extensions.http.status },
          },
        });
      }
    },

    deleteTodo: async (
      _: any,
      { id }: VerifyToken,
      { access_token }: Token
    ) => {
      try {
        if (!access_token) {
          throw new GraphQLError("you must enter token", {
            extensions: {
              http: { status: 400 },
            },
          });
        }
        if (!process.env.SECRET_KEY) {
          throw new GraphQLError("SECRET_KEY does not come from .env", {
            extensions: {
              http: { status: 400 },
            },
          });
        }

        const verifyToken = jwt.verify(access_token, process.env.SECRET_KEY);

        if (!verifyToken) {
          throw new GraphQLError("invalid token", {
            extensions: {
              http: { status: 400 },
            },
          });
        }

        const findUser = await AppDataSource.manager.findOne(Users, {
          where: {
            id: (verifyToken as VerifyToken).id,
          },

          relations: {
            todos: true,
          },
        });

        if (!findUser) {
          throw new GraphQLError("user is not found", {
            extensions: {
              http: { status: 404 },
            },
          });
        }

        const findTodo = findUser.todos.find((item) => item.id === id);

        if (!findTodo) {
          throw new GraphQLError("You don't have the todo", {
            extensions: {
              http: { status: 404 },
            },
          });
        }

        const getTodo = await AppDataSource.manager.findOneBy(Todos, { id });

        if (!getTodo) {
          throw new GraphQLError("You don't have the todo", {
            extensions: {
              http: { status: 404 },
            },
          });
        }

        await AppDataSource.manager.remove(getTodo);
        return "deleted";
      } catch (error: any) {
        return new GraphQLError(error.message, {
          extensions: {
            http: { status: error.extensions.http.status },
          },
        });
      }
    },

    editTodo: async (
      _: any,
      { id, title, text, isCompleted }: TodoInfo,
      { access_token }: Token
    ) => {
      try {
        if (!access_token) {
          throw new GraphQLError("you must enter token", {
            extensions: {
              http: { status: 400 },
            },
          });
        }
        if (!process.env.SECRET_KEY) {
          throw new GraphQLError("SECRET_KEY does not come from .env", {
            extensions: {
              http: { status: 400 },
            },
          });
        }

        const verifyToken = jwt.verify(access_token, process.env.SECRET_KEY);

        if (!verifyToken) {
          throw new GraphQLError("invalid token", {
            extensions: {
              http: { status: 400 },
            },
          });
        }

        const findUser = await AppDataSource.manager.findOne(Users, {
          where: {
            id: (verifyToken as VerifyToken).id,
          },

          relations: {
            todos: true,
          },
        });

        if (!findUser) {
          throw new GraphQLError("user is not found", {
            extensions: {
              http: { status: 404 },
            },
          });
        }

        const findTodo = findUser.todos.find((item) => item.id === id);

        if (!findTodo) {
          throw new GraphQLError("You don't have the todo", {
            extensions: {
              http: { status: 404 },
            },
          });
        }

        const getTodo = await AppDataSource.manager.findOneBy(Todos, { id });

        if (!getTodo) {
          throw new GraphQLError("You don't have the todo", {
            extensions: {
              http: { status: 404 },
            },
          });
        }

        getTodo.title = title;
        getTodo.text = text;
        getTodo.isCompleted = isCompleted;

        await AppDataSource.manager.save(getTodo);
        return "edited";
      } catch (error: any) {
        return new GraphQLError(error.message, {
          extensions: {
            http: { status: error.extensions.http.status },
          },
        });
      }
    },

    sendTodo: async (
      _: any,
      { id, sendTo }: SendTodo,
      { access_token }: Token
    ) => {
      try {
        if (!access_token) {
          throw new GraphQLError("you must enter token", {
            extensions: {
              http: { status: 400 },
            },
          });
        }
        if (!process.env.SECRET_KEY) {
          throw new GraphQLError("SECRET_KEY does not come from .env", {
            extensions: {
              http: { status: 400 },
            },
          });
        }

        const verifyToken = jwt.verify(access_token, process.env.SECRET_KEY);

        if (!verifyToken) {
          throw new GraphQLError("invalid token", {
            extensions: {
              http: { status: 400 },
            },
          });
        }

        const findUser = await AppDataSource.manager.findOne(Users, {
          where: {
            id: (verifyToken as VerifyToken).id,
          },

          relations: {
            todos: true,
          },
        });

        const targetUser = await AppDataSource.manager.findOne(Users, {
          where: {
            id: sendTo,
          },

          relations: {
            todos: true,
          },
        });

        if (!findUser || !targetUser) {
          throw new GraphQLError("user is not found", {
            extensions: {
              http: { status: 404 },
            },
          });
        }

        const findTodo = findUser.todos.find((item) => item.id === id);

        if (!findTodo) {
          throw new GraphQLError("You don't have the todo", {
            extensions: {
              http: { status: 404 },
            },
          });
        }

        const getTodo = await AppDataSource.manager.findOneBy(Todos, { id });

        if (!getTodo) {
          throw new GraphQLError("You don't have the todo", {
            extensions: {
              http: { status: 404 },
            },
          });
        }

        if (!targetUser.todos.length) {
          targetUser.todos = [getTodo];
          await AppDataSource.manager.save(targetUser);
          return "sended";
        }

        targetUser.todos = [...targetUser.todos, getTodo];

        await AppDataSource.manager.save(targetUser);
        return "sended";
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
