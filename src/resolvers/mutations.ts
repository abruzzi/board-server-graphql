import { MutationResolvers } from "__generated__/resolvers-types";

const mutations: MutationResolvers = {
  // @ts-ignore
  createBoard: async (_, { name }, { user, dataSources }) => {
    if (!user) throw new Error("Not authenticated");
    return dataSources.boardsAPI.createBoardWithDefaultColumns(name, user.id);
  },

  // @ts-ignore
  addCommentToCard: async (_, { cardId, content }, { user, dataSources }) => {
    if (!user) throw new Error("Not authenticated");
    return dataSources.boardsAPI.addCommentToCard(cardId, content, user.id);
  },

  // @ts-ignore
  deleteCard: async (_, { cardId }, { dataSources }) => {
    return dataSources.boardsAPI.deleteCard(cardId);
  },

  // @ts-ignore
  updateCard: async (
    _,
    { cardId, title, description, imageUrl },
    { dataSources }
  ) => {
    return dataSources.boardsAPI.updateCard(
      cardId,
      title,
      description,
      imageUrl
    );
  },

  // @ts-ignore
  updateCardTitle: async (_, { cardId, title }, { dataSources }) => {
    return dataSources.boardsAPI.updateCardTitle(cardId, title);
  },

  // @ts-ignore
  updateCardDescription: async (
    _,
    { cardId, description },
    { dataSources }
  ) => {
    return dataSources.boardsAPI.updateCardTitle(cardId, description);
  },

  // @ts-ignore
  updateCardImageUrl: async (_, { cardId, imageUrl }, { dataSources }) => {
    return dataSources.boardsAPI.updateCardTitle(cardId, imageUrl);
  },

  // @ts-ignore
  createSimpleCard: async (_, { columnId, title }, { dataSources }) => {
    return dataSources.boardsAPI.createSimpleCard(columnId, title);
  },
  // @ts-ignore
  createColumn: async (_, { boardId, name, position }, { dataSources }) => {
    return dataSources.boardsAPI.createColumn(boardId, name, position);
  },

  // @ts-ignore
  moveCard: async (
    _,
    { cardId, targetColumnId, targetPosition },
    { dataSources }
  ) => {
    return dataSources.boardsAPI.moveCard(
      cardId,
      targetColumnId,
      targetPosition
    );
  },

  // @ts-ignore
  signUp: async (_, { email, name }, { dataSources }) => {
    return dataSources.boardsAPI.createUser(email, name);
  },

  // @ts-ignore
  signIn: async (_, { email }, { dataSources }) => {
    return dataSources.boardsAPI.signIn(email);
  },
};

export default mutations;
