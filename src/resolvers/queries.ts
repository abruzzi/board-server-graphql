import { QueryResolvers } from "__generated__/resolvers-types";

const queries: QueryResolvers = {
  // @ts-ignore
  currentUser: async (_, __, { user, dataSources }) => {
    if (!user) throw new Error("Not authenticated");
    if (user.id) {
      return dataSources.boardsAPI.getUser(user.id);
    }
    return dataSources.boardsAPI.getUserByEmail(user.email);
  },

  // @ts-ignore
  boards: async (_, __, { user, dataSources }) => {
    if (!user) throw new Error("Not authenticated");
    return dataSources.boardsAPI.getBoards(user.id);
  },

  // @ts-ignore
  collaborateBoards: async (_, __, { user, dataSources }) => {
    if (!user) throw new Error("Not authenticated");
    return dataSources.boardsAPI.getCollaborateBoards(user.id);
  },

  // @ts-ignore
  board: async (_, { id }, { dataSources }) => {
    return dataSources.boardsAPI.getBoard(id);
  },

  // @ts-ignore
  comments: async (_, { cardId }, { dataSources }) => {
    return dataSources.boardsAPI.getComments(cardId);
  },

  // @ts-ignore
  tags: async (_, {}, { dataSources }) => {
    return dataSources.boardsAPI.getTags();
  },

  // @ts-ignore
  card: async (_, { id }, { dataSources }) => {
    return dataSources.boardsAPI.getCard(id);
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
