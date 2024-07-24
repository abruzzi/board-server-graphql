import { QueryResolvers } from "__generated__/resolvers-types";

const queries: QueryResolvers = {
  // @ts-ignore
  currentUser: async (_, __, { user, dataSources }) => {
    if (!user) throw new Error("Not authenticated");
    return dataSources.boardsAPI.getUser(user.id);
  },

  // @ts-ignore
  boards: async (_, __, { dataSources }) => {
    return dataSources.boardsAPI.getBoards();
  },

  // @ts-ignore
  board: async (_, { id }, { dataSources }) => {
    return dataSources.boardsAPI.getBoard(id);
  },

  // @ts-ignore
  column: async (_, { id }, { dataSources }) => {
    return dataSources.boardsAPI.getColumn(id);
  },

  // @ts-ignore
  node: async (_, { id }, { dataSources }) => {
    return dataSources.boardsAPI.getColumn(id);
  },
};

export default queries;
