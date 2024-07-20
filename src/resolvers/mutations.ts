import { MutationResolvers } from "__generated__/resolvers-types";

const mutations: MutationResolvers = {
  // @ts-ignore
  createBoard: async (_, { name }, { dataSources }) => {
    return dataSources.boardsAPI.createBoard(name);
  },

  // @ts-ignore
  createCard: async (_, { columnId, title, description }, { dataSources }) => {
    return dataSources.boardsAPI.createCard(columnId, title, description);
  },

  // @ts-ignore
  deleteCard: async (_, { cardId }, { dataSources }) => {
    return dataSources.boardsAPI.deleteCard(cardId);
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
};

export default mutations;
