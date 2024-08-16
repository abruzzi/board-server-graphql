import { Resolvers } from "../__generated__/resolvers-types";
import { cardResolvers, queryResolvers, viewerResolvers } from "./queries.js";
import Mutation from "./mutations.js";

const resolvers: Resolvers = {
  Query: queryResolvers,
  Card: cardResolvers,
  Viewer: viewerResolvers,
  Mutation,
};

export default resolvers;
