"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mutationResolvers = void 0;
const pubsub_1 = require("../pubsub");
const mutationResolvers = {
    // @ts-ignore
    createBoard: async (_, { name }, { user, dataSources }) => {
        if (!user)
            throw new Error("Not authenticated");
        return dataSources.boardsAPI.createBoardWithDefaultColumns(name, user.id);
    },
    // @ts-ignore
    updateBoardImageUrl: async (_, { boardId, imageUrl }, { user, dataSources }) => {
        if (!user)
            throw new Error("Not authenticated");
        return dataSources.boardsAPI.updateBoardImageUrl(boardId, imageUrl);
    },
    // @ts-ignore
    updateBoardName: async (_, { boardId, name }, { user, dataSources }) => {
        if (!user)
            throw new Error("Not authenticated");
        return dataSources.boardsAPI.updateBoardName(boardId, name);
    },
    // @ts-ignore
    toggleFavoriteBoard: async (_, { boardId }, { user, dataSources }) => {
        if (!user)
            throw new Error("Not authenticated");
        return dataSources.boardsAPI.toggleFavoriteBoard(boardId, user.id);
    },
    // @ts-ignore
    addCommentToCard: async (_, { cardId, content }, { user, dataSources }) => {
        if (!user)
            throw new Error("Not authenticated");
        return dataSources.boardsAPI.addCommentToCard(cardId, content, user.id);
    },
    // @ts-ignore
    removeComment: async (_, { commentId }, { user, dataSources }) => {
        if (!user)
            throw new Error("Not authenticated");
        return dataSources.boardsAPI.removeComment(commentId);
    },
    // @ts-ignore
    deleteCard: async (_, { cardId }, { user, dataSources }) => {
        if (!user)
            throw new Error("Not authenticated");
        return dataSources.boardsAPI.softDeleteCard(cardId);
    },
    // @ts-ignore
    updateCardTitle: async (_, { cardId, title }, { user, dataSources }) => {
        if (!user)
            throw new Error("Not authenticated");
        return dataSources.boardsAPI.updateCardTitle(cardId, title);
    },
    // @ts-ignore
    updateCardDescription: async (_, { cardId, description }, { user, dataSources }) => {
        if (!user)
            throw new Error("Not authenticated");
        return dataSources.boardsAPI.updateCardDescription(cardId, description);
    },
    // @ts-ignore
    updateCardImageUrl: async (_, { cardId, imageUrl }, { user, dataSources }) => {
        if (!user)
            throw new Error("Not authenticated");
        return dataSources.boardsAPI.updateCardImageUrl(cardId, imageUrl);
    },
    // @ts-ignore
    createSimpleCard: async (_, { columnId, title }, { user, dataSources }) => {
        if (!user)
            throw new Error("Not authenticated");
        return dataSources.boardsAPI.createSimpleCard(columnId, title);
    },
    // @ts-ignore
    moveCard: async (_, { cardId, targetColumnId, targetPosition }, { user, dataSources }) => {
        if (!user)
            throw new Error("Not authenticated");
        const updatedCard = await dataSources.boardsAPI.moveCard(cardId, targetColumnId, targetPosition);
        pubsub_1.pubsub.publish(`card-moved-on-board-${updatedCard.id}`, {
            cardUpdated: updatedCard,
        });
        return updatedCard;
    },
    // @ts-ignore
    createCardFromComment: async (_, { cardId, title, description }, { user, dataSources }) => {
        if (!user)
            throw new Error("Not authenticated");
        return dataSources.boardsAPI.createCardFromComment(cardId, title, description);
    },
};
exports.mutationResolvers = mutationResolvers;
