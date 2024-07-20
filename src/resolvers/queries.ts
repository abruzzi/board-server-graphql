import { QueryResolvers } from "__generated__/resolvers-types";

const queries: QueryResolvers = {
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
    const column = await dataSources.boardsAPI.getColumn(id);
    if (column) {
      return column;
    }

    return null;
  },
};

export default queries;
