"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscriptionResolvers = void 0;
const pubsub_1 = require("../pubsub");
exports.subscriptionResolvers = {
    // @ts-ignore
    cardUpdated: {
        subscribe: (_, { boardId }) => {
            return pubsub_1.pubsub.asyncIterator(`card-moved-on-board-${boardId}`);
        },
    },
};
