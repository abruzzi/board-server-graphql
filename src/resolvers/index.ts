import { Resolvers } from "../__generated__/resolvers-types";
import Query from "./queries.js";
import Mutation from "./mutations.js";

const resolvers: Resolvers = {
  Query,
  Mutation,
  Node: {
    __resolveType(obj, context, info) {
      if ("position" in obj && "cards" in obj) {
        return "Column";
      }

      return null;
    },
  },
};

export default resolvers;
