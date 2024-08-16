import { QueryResolvers, ViewerResolvers } from "__generated__/resolvers-types";
import { CardResolvers } from "__generated__/resolvers-types";

export const cardResolvers: CardResolvers = {
  // @ts-ignore
  comments: async (card, { first, after }, { user, dataSources }) => {
    if (!user) throw new Error("Not authenticated");
    return dataSources.boardsAPI.getComments(card.id, first, after);
  },
};

export const viewerResolvers: ViewerResolvers = {
  // @ts-ignore
  favoriteBoards: async (_, {}, { user, dataSources }) => {
    if (!user) throw new Error("Not authenticated");
    return dataSources.boardsAPI.getFavoriteBoards(user.id);
  },

  // @ts-ignore
  collaborateBoards: async (_, {}, { user, dataSources }) => {
    if (!user) throw new Error("Not authenticated");
    return dataSources.boardsAPI.getCollaborateBoards(user.id);
  },

  // @ts-ignore
  user: async (_, {}, { user, dataSources }) => {
    if (!user) throw new Error("Not authenticated");
    return dataSources.boardsAPI.getUser(user.id);
  },

  // @ts-ignore
  board: async (_, { id }, { user, dataSources }) => {
    if (!user) throw new Error("Not authenticated");
    return dataSources.boardsAPI.getBoard(id);
  },

  // @ts-ignore
  boards: async (_, __, { user, dataSources }) => {
    if (!user) throw new Error("Not authenticated");
    return dataSources.boardsAPI.getBoards(user.id);
  },
};

export const queryResolvers: QueryResolvers = {
  // @ts-ignore
  node: async (_, {id}, { user, dataSources }) => {
    if (!user) throw new Error("Not authenticated");

    const board = await dataSources.boardsAPI.getBoard(id);

    if(board) {
      return board;
    }

    const card = await dataSources.boardsAPI.getCard(id);

    if(card) {
      return card;
    }

    return null;
  },

  // @ts-ignore
  viewer: async (_, __, { user, dataSources }) => {
    if (!user) throw new Error("Not authenticated");
    if (user.id) {
      const currentUser = await dataSources.boardsAPI.getUser(user.id);
      return {
        user: currentUser,
      };
    }
  },
};
