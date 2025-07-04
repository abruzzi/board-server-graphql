import { Resolvers } from "../__generated__/resolvers-types";
import { cardResolvers, queryResolvers, viewerResolvers } from "./queries.js";
import { mutationResolvers } from "./mutations.js";
import {subscriptionResolvers} from "./subscriptions.js";

const resolvers: Resolvers = {
  Subscription: subscriptionResolvers,
  Query: queryResolvers,
  Card: cardResolvers,
  Viewer: viewerResolvers,
  Mutation: mutationResolvers,
  Node: {
    __resolveType(obj, context, info) {
      if ("name" in obj && "columns" in obj) {
        return "Board";
      }

      if ("position" in obj && "cards" in obj) {
        return "Column";
      }

      if ("title" in obj && "description" in obj && "position" in obj) {
        return "Card";
      }

      return null;
    },
  },
};

export default resolvers;
