"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryResolvers = exports.viewerResolvers = exports.cardResolvers = void 0;
exports.cardResolvers = {
    // @ts-ignore
    comments: async (card, { first, after }, { user, dataSources }) => {
        if (!user)
            throw new Error("Not authenticated");
        return dataSources.boardsAPI.getComments(card.id, first, after);
    },
};
exports.viewerResolvers = {
    // @ts-ignore
    favoriteBoards: async (_, {}, { user, dataSources }) => {
        if (!user)
            throw new Error("Not authenticated");
        return dataSources.boardsAPI.getFavoriteBoards(user.id);
    },
    // @ts-ignore
    collaborateBoards: async (_, {}, { user, dataSources }) => {
        if (!user)
            throw new Error("Not authenticated");
        return dataSources.boardsAPI.getCollaborateBoards(user.id);
    },
    // @ts-ignore
    user: async (_, {}, { user, dataSources }) => {
        if (!user)
            throw new Error("Not authenticated");
        return dataSources.boardsAPI.getUser(user.id);
    },
    // @ts-ignore
    board: async (_, { id }, { user, dataSources }) => {
        if (!user)
            throw new Error("Not authenticated");
        return dataSources.boardsAPI.getBoard(id);
    },
    // @ts-ignore
    boards: async (_, __, { user, dataSources }) => {
        if (!user)
            throw new Error("Not authenticated");
        return dataSources.boardsAPI.getBoards(user.id);
    },
};
exports.queryResolvers = {
    // @ts-ignore
    node: async (_, { id }, { user, dataSources }) => {
        if (!user)
            throw new Error("Not authenticated");
        const board = await dataSources.boardsAPI.getBoard(id);
        if (board) {
            return board;
        }
        const card = await dataSources.boardsAPI.getCard(id);
        if (card) {
            return card;
        }
        return null;
    },
    // @ts-ignore
    viewer: async (_, __, { user, dataSources }) => {
        if (!user)
            throw new Error("Not authenticated");
        if (user.id) {
            const currentUser = await dataSources.boardsAPI.getUser(user.id);
            return {
                user: currentUser,
            };
        }
    },
};
