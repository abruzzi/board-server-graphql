"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const queries_js_1 = require("./queries.js");
const subscriptions_js_1 = require("./subscriptions.js");
const resolvers = {
    Subscription: subscriptions_js_1.subscriptionResolvers,
    Query: queries_js_1.queryResolvers,
    Card: queries_js_1.cardResolvers,
    Viewer: queries_js_1.viewerResolvers,
    Mutation: queries_js_1.cardResolvers,
    Node: {
        __resolveType(obj, context, info) {
            if ("name" in obj && "columns" in obj) {
                return "Board";
            }
            if ("position" in obj && "cards" in obj) {
                return "Column";
            }
            if ("title" in obj && "description" in obj && "position" in obj) {
                return "Card";
            }
            return null;
        },
    },
};
exports.default = resolvers;
