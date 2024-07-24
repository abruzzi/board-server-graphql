import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import jwt from "jsonwebtoken";

import resolvers from "./resolvers/index.js";
import { BoardsDataSource } from "./datasources.js";

import { readFileSync } from "fs";
import { User } from "@prisma/client";

const typeDefs = readFileSync("./schema.graphql", { encoding: "utf-8" });

export interface BoardContext {
  user: User;
  dataSources: {
    boardsAPI: BoardsDataSource;
  };
}

const server = new ApolloServer<BoardContext>({
  typeDefs,
  resolvers,
});

const getUser = (token: string) => {
  try {
    if (token) {
      return jwt.verify(token, process.env.JWT_SECRET);
    }
    return null;
  } catch (err) {
    return null;
  }
};

const { url } = await startStandaloneServer(server, {
  context: async ({ req }) => {
    const token = req.headers.authorization || "";
    const user = getUser(token);

    return {
      user,
      dataSources: {
        boardsAPI: new BoardsDataSource(),
      },
    };
  },
});

console.log(`🚀 Server listening at: ${url}`);
