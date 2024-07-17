import { MutationResolvers } from "__generated__/resolvers-types";

const mutations: MutationResolvers = {
  // @ts-ignore
  createBoard: async (_, { name }, { dataSources }) => {
    return dataSources.boardsAPI.createBoard(name);
  },

  // @ts-ignore
  createCard: async (
    _,
    { columnId, title, description, position },
    { dataSources }
  ) => {
    return dataSources.boardsAPI.createCard(
      columnId,
      title,
      description,
      position
    );
  },

  // @ts-ignore
  createColumn: async (_, { boardId, name, position }, { dataSources }) => {
    return dataSources.boardsAPI.createColumn(boardId, name, position);
  },

  // @ts-ignore
  moveCard: async (_, { cardId, targetColumnId, targetPosition }, { dataSources }) => {
    return dataSources.boardsAPI.moveCard(cardId, targetColumnId, targetPosition);
  },
};

export default mutations;
