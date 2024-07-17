import {QueryResolvers} from "__generated__/resolvers-types";

const queries: QueryResolvers = {
  // @ts-ignore
  boards: async (_, __, {dataSources}) => {
    return dataSources.boardsAPI.getBoards();
  },
  // @ts-ignore
  board: async (_, {id}, {dataSources}) => {
    return dataSources.boardsAPI.getBoard(id);
  }
};

export default queries;
