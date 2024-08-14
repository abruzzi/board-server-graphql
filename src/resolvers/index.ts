import { Resolvers } from "../__generated__/resolvers-types";
import { cardResolvers, queryResolvers } from "./queries.js";
import Mutation from "./mutations.js";

const resolvers: Resolvers = {
  Query: queryResolvers,
  Card: cardResolvers,
  Mutation,
  Node: {
    __resolveType(obj, context, info) {
      if ("position" in obj && "cards" in obj) {
        return "Column";
      }

      if ("name" in obj && "columns" in obj) {
        return "Board";
      }

      return null;
    },
  },
};

export default resolvers;
