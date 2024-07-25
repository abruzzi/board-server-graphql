import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import jwt from "jsonwebtoken";

import resolvers from "./resolvers/index.js";
import { BoardsDataSource } from "./datasources.js";

import { readFileSync } from "fs";

const typeDefs = readFileSync("./schema.graphql", { encoding: "utf-8" });

interface User {
  id: string;
  email: string;
}

export interface BoardContext {
  user: User | null;
  dataSources: {
    boardsAPI: BoardsDataSource;
  };
}

const server = new ApolloServer<BoardContext>({
  typeDefs,
  resolvers,
});

const getUser = (token: string) => {
  if(!token) {
    return null;
  }

  try {
    return jwt.verify(token, process.env.JWT_SECRET) as User;
  } catch (err) {
    return null;
  }
};

const { url } = await startStandaloneServer<BoardContext>(server, {
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
