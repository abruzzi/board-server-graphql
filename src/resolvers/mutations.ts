import { MutationResolvers } from "../__generated__/resolvers-types";
import {pubsub} from "../pubsub";

const mutationResolvers: MutationResolvers = {
  // @ts-ignore
  createBoard: async (_, { name }, { user, dataSources }) => {
    if (!user) throw new Error("Not authenticated");
    return dataSources.boardsAPI.createBoardWithDefaultColumns(name, user.id);
  },

  // @ts-ignore
  updateBoardImageUrl: async (
    _,
    { boardId, imageUrl },
    { user, dataSources }
  ) => {
    if (!user) throw new Error("Not authenticated");
    return dataSources.boardsAPI.updateBoardImageUrl(boardId, imageUrl);
  },

  // @ts-ignore
  updateBoardName: async (_, { boardId, name }, { user, dataSources }) => {
    if (!user) throw new Error("Not authenticated");
    return dataSources.boardsAPI.updateBoardName(boardId, name);
  },

  // @ts-ignore
  toggleFavoriteBoard: async (_, { boardId }, { user, dataSources }) => {
    if (!user) throw new Error("Not authenticated");
    return dataSources.boardsAPI.toggleFavoriteBoard(boardId, user.id);
  },

  // @ts-ignore
  addCommentToCard: async (_, { cardId, content }, { user, dataSources }) => {
    if (!user) throw new Error("Not authenticated");
    return dataSources.boardsAPI.addCommentToCard(cardId, content, user.id);
  },

  // @ts-ignore
  removeComment: async (_, { commentId }, { user, dataSources }) => {
    if (!user) throw new Error("Not authenticated");
    return dataSources.boardsAPI.removeComment(commentId);
  },

  // @ts-ignore
  deleteCard: async (_, { cardId }, { user, dataSources }) => {
    if (!user) throw new Error("Not authenticated");
    return dataSources.boardsAPI.softDeleteCard(cardId);
  },

  // @ts-ignore
  updateCardTitle: async (_, { cardId, title }, { user, dataSources }) => {
    if (!user) throw new Error("Not authenticated");
    return dataSources.boardsAPI.updateCardTitle(cardId, title);
  },

  // @ts-ignore
  updateCardDescription: async (
    _,
    { cardId, description },
    { user, dataSources }
  ) => {
    if (!user) throw new Error("Not authenticated");
    return dataSources.boardsAPI.updateCardDescription(cardId, description);
  },

  // @ts-ignore
  updateCardImageUrl: async (
    _,
    { cardId, imageUrl },
    { user, dataSources }
  ) => {
    if (!user) throw new Error("Not authenticated");
    return dataSources.boardsAPI.updateCardImageUrl(cardId, imageUrl);
  },

  // @ts-ignore
  createSimpleCard: async (_, { columnId, title }, { user, dataSources }) => {
    if (!user) throw new Error("Not authenticated");
    return dataSources.boardsAPI.createSimpleCard(columnId, title);
  },

  // @ts-ignore
  moveCard: async (
    _,
    { cardId, targetColumnId, targetPosition },
    { user, dataSources }
  ) => {
    if (!user) throw new Error("Not authenticated");

    const updatedBoard = await dataSources.boardsAPI.moveCard(
      cardId,
      targetColumnId,
      targetPosition
    );

    pubsub.publish(`CARD-MOVED-ON-BOARD-${updatedBoard.id}`, {
      cardUpdated: updatedBoard,
    });

    return updatedBoard;
  },

  // @ts-ignore
  createCardFromComment: async (
    _,
    { cardId, title, description },
    { user, dataSources }
  ) => {
    if (!user) throw new Error("Not authenticated");
    return dataSources.boardsAPI.createCardFromComment(
      cardId,
      title,
      description
    );
  },
};

export { mutationResolvers };
