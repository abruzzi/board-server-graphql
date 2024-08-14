import { QueryResolvers } from "__generated__/resolvers-types";
import { CardResolvers } from "__generated__/resolvers-types";

export const cardResolvers: CardResolvers = {
  // @ts-ignore
  comments: async (card, { first, after }, { user, dataSources }) => {
    if (!user) throw new Error("Not authenticated");
    return dataSources.boardsAPI.getComments(card.id, first, after);
  },
};

export const queryResolvers: QueryResolvers = {
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
  favoriteBoards: async (_, __, { user, dataSources }) => {
    if (!user) throw new Error("Not authenticated");
    return dataSources.boardsAPI.getFavoriteBoards(user.id);
  },

  // @ts-ignore
  board: async (_, { id }, { user, dataSources }) => {
    if (!user) throw new Error("Not authenticated");
    return dataSources.boardsAPI.getBoard(id);
  },

  // @ts-ignore
  tags: async (_, {}, { user, dataSources }) => {
    if (!user) throw new Error("Not authenticated");
    return dataSources.boardsAPI.getTags();
  },

  // @ts-ignore
  card: async (_, { id }, { user, dataSources }) => {
    if (!user) throw new Error("Not authenticated");
    return dataSources.boardsAPI.getCard(id);
  },

  // @ts-ignore
  column: async (_, { id }, { user, dataSources }) => {
    if (!user) throw new Error("Not authenticated");
    return dataSources.boardsAPI.getColumn(id);
  },

  // @ts-ignore
  node: async (_, { id }, { user, dataSources }) => {
    if (!user) throw new Error("Not authenticated");

    // Try to find the node as a Column first
    const column = await dataSources.boardsAPI.getColumn(id);
    if (column) {
      return column;
    }

    // If not found, try to find it as a Board
    const board = await dataSources.boardsAPI.getBoard(id);
    if (board) {
      return board;
    }

    // Return null if no match is found
    return null;
  },
};

