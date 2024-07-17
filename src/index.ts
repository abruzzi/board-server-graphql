import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

import resolvers from "./resolvers/index.js";
import { BoardsDataSource } from "./datasources.js";

import { readFileSync } from "fs";

const typeDefs = readFileSync("./schema.graphql", { encoding: "utf-8" });

export interface BoardContext {
  dataSources: {
    boardsAPI: BoardsDataSource;
  };
}

const server = new ApolloServer<BoardContext>({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  context: async () => {
    return {
      dataSources: {
        boardsAPI: new BoardsDataSource(),
      },
    };
  },
});

console.log(`🚀 Server listening at: ${url}`);
