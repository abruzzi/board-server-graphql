import { pubsub } from "../pubsub";
import { SubscriptionResolvers } from "../__generated__/resolvers-types";

export const subscriptionResolvers: SubscriptionResolvers = {
  // @ts-ignore
  cardUpdated: {
    subscribe: (_: any, { boardId }: { boardId: string }) => {
      return pubsub.asyncIterator(`CARD-MOVED-ON-BOARD-${boardId}`);
    },
  },
};
