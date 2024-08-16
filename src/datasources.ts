import {
  Board,
  Card,
  Column,
  Invitation,
  PrismaClient,
  Tag,
  User,
} from "@prisma/client";
import { v4 as uuid } from "uuid";

const prisma = new PrismaClient();

const INCREASE_STEP = 10;
const POSITION_STEP = 100;

export class BoardsDataSource {
  async getUser(id: string): Promise<User> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async getUserByEmail(email: string): Promise<User> {
    return prisma.user.findUnique({ where: { email } });
  }

  async getComments(cardId: string, first: number, after?: string) {
    const comments = await prisma.comment.findMany({
      where: {
        cardId: cardId,
      },
      take: first,
      skip: after ? 1 : 0,
      cursor: after ? { id: after } : undefined,
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      edges: comments.map((comment) => ({
        cursor: comment.id,
        node: comment,
      })),
      pageInfo: {
        endCursor:
          comments.length > 0 ? comments[comments.length - 1].id : null,
        hasNextPage: comments.length === first,
      },
    };
  }

  async findInvitation(token: string) {
    return prisma.invitation.findUnique({
      where: { token: token },
      include: { board: true },
    });
  }

  async addUserToBoard(invitation: Invitation, userId: string) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new Error("user does not exist");
    }

    await prisma.collaborator.create({
      data: {
        userId: userId,
        boardId: invitation.boardId,
      },
    });

    await prisma.invitation.update({
      where: { token: invitation.token },
      data: { status: "accepted" },
    });

    return prisma.board.findUnique({ where: { id: invitation.boardId } });
  }

  async getBoard(id: string) {
    const board = await prisma.board.findUnique({
      where: { id },
      include: {
        columns: {
          include: {
            cards: {
              where: {
                deleted: false,
              },
              include: {
                tags: {
                  include: {
                    tag: true,
                  },
                },
                column: true,
              },
              orderBy: { position: "asc" },
            },
          },
        },
      },
    });

    // Transform the data to match GraphQL schema expectations
    return {
      ...board,
      columns: board.columns.map((column) => ({
        ...column,
        cards: column.cards.map((card) => ({
          ...card,
          tags: card.tags.map((tagConnection) => tagConnection.tag),
        })),
      })),
    };
  }

  async createInvitation(email: string, boardId: string) {
    const token = uuid();
    return prisma.invitation.create({
      data: {
        email: email,
        token: token,
        boardId: boardId,
      },
    });
  }

  async updateBoardImageUrl(boardId: string, imageUrl: string) {
    return prisma.board.update({ where: { id: boardId }, data: { imageUrl } });
  }

  async updateBoardName(boardId: string, name: string) {
    return prisma.board.update({ where: { id: boardId }, data: { name } });
  }

  async toggleFavoriteBoard(boardId: string, userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { favorites: true },
    });

    const isFavorite = user.favorites.some((board) => board.id === boardId);

    if (isFavorite) {
      return prisma.board.update({
        where: { id: boardId },
        data: {
          favoritedBy: {
            disconnect: {
              id: user.id,
            },
          },
        },
      });
    } else {
      return prisma.board.update({
        where: { id: boardId },
        data: {
          favoritedBy: {
            connect: {
              id: user.id,
            },
          },
        },
      });
    }
  }

  async getColumn(id: string): Promise<
    | (Column & {
        cards: Card[];
      })
    | null
  > {
    return prisma.column.findUnique({
      where: { id },
      include: {
        cards: {
          include: {
            column: true,
          },
          orderBy: { position: "asc" },
        },
      },
    });
  }

  async createBoardWithDefaultColumns(name: string, userId: string) {
    // Verify the user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const board = await prisma.board.create({
      data: { name, userId },
    });

    const columns = ["To do", "In progress", "Done"];

    for (const [index, col] of columns.entries()) {
      await this.createColumn(board.id, col, index);
    }

    return board;
  }

  async getBoards(userId: string): Promise<
    (Board & {
      columns: Column[];
    })[]
  > {
    return prisma.board.findMany({
      where: { userId },
      include: { columns: true },
    });
  }

  async getCollaborateBoards(userId: string) {
    return prisma.board.findMany({
      where: {
        collaborators: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        collaborators: true,
      },
    });
  }

  async getFavoriteBoards(userId: string) {
    return prisma.board.findMany({
      where: {
        favoritedBy: {
          some: {
            id: userId,
          },
        },
      },
      include: {
        favoritedBy: true,
      },
    });
  }

  async createColumn(boardId: string, name: string, position: number) {
    return prisma.column.create({
      data: { boardId, name, position },
    });
  }

  async createUser(email: string, name: string, avatarUrl: string) {
    return prisma.user.create({
      data: { name, email, avatarUrl },
    });
  }

  async updateUser(id: string, name: string, avatarUrl: string) {
    return prisma.user.update({
      where: {
        id,
      },
      data: {
        name,
        avatarUrl,
      },
    });
  }

  async createSimpleCard(columnId: string, title: string): Promise<Column> {
    if (!columnId) {
      throw new Error("Invalid input");
    }

    const largestPositionCard = await prisma.card.findFirst({
      where: {
        columnId: columnId,
      },
      orderBy: {
        position: "desc",
      },
    });

    const position = largestPositionCard
      ? largestPositionCard.position + POSITION_STEP
      : POSITION_STEP;

    await prisma.card.create({
      data: {
        columnId,
        title,
        description: "",
        position: position,
      },
      include: { column: true },
    });

    return this.getColumn(columnId);
  }

  async createCardFromComment(
    cardId: string,
    title: string,
    description: string
  ) {
    const card = await prisma.card.findUnique({ where: { id: cardId } });
    if (!card) {
      throw new Error("Invalid card");
    }

    const largestPositionCard = await prisma.card.findFirst({
      where: {
        columnId: card.columnId,
      },
      orderBy: {
        position: "desc",
      },
    });

    const position = largestPositionCard
      ? largestPositionCard.position + POSITION_STEP
      : POSITION_STEP;

    await prisma.card.create({
      data: {
        columnId: card.columnId,
        title,
        description,
        position: position,
      },
      include: { column: true },
    });

    return this.getColumn(card.columnId);
  }

  async softDeleteCard(cardId: string): Promise<Column> {
    const card = await prisma.card.update({
      where: { id: cardId },
      data: {
        deleted: true,
        deletedAt: new Date(),
      },
      include: { column: true },
    });

    return this.getColumn(card.columnId);
  }

  async addCommentToCard(cardId: string, content: string, userId: string) {
    return prisma.comment.create({
      data: {
        content,
        card: { connect: { id: cardId } },
        user: { connect: { id: userId } },
      },
    });
  }

  async removeComment(commentId: string) {
    return prisma.comment.delete({ where: { id: commentId } });
  }

  async updateCardTitle(cardId: string, title: string): Promise<Card> {
    return prisma.card.update({
      where: { id: cardId },
      data: {
        title,
      },
    });
  }

  async updateCardDescription(
    cardId: string,
    description: string
  ): Promise<Card> {
    return prisma.card.update({
      where: { id: cardId },
      data: {
        description,
      },
    });
  }

  async updateCardImageUrl(cardId: string, imageUrl: string): Promise<Card> {
    return prisma.card.update({
      where: { id: cardId },
      data: {
        imageUrl,
      },
    });
  }

  private async rebalancePositions(columnId: string) {
    const cards = await prisma.card.findMany({
      where: { columnId },
      orderBy: { position: "asc" },
    });

    // Reassign positions with a larger step size
    const updatedCards = cards.map((card, index) => ({
      ...card,
      position: (index + 1) * POSITION_STEP,
    }));

    // Batch update positions
    const updates = updatedCards.map((card) =>
      prisma.card.update({
        where: { id: card.id },
        data: { position: card.position },
      })
    );

    await prisma.$transaction(updates);
  }

  async moveCard(
    cardId: string,
    targetColumnId: string,
    targetPosition: number
  ) {
    const column = await prisma.column.findUnique({
      where: { id: targetColumnId },
    });
    if (!column) {
      throw new Error(`column ${targetColumnId} doesn't exist`);
    }

    // when moving, we're pretty sure there is already a card otherwise the moveCard should not be called.
    if (targetPosition === 0) {
      // try to insert to the top
      // update all the others if we have too
      const smallestPositionCard = await prisma.card.findFirst({
        where: {
          columnId: targetColumnId,
        },
        orderBy: {
          position: "asc",
        },
      });

      // when move into an empty column, there isn't any cards in the column yet
      if (!smallestPositionCard) {
        await prisma.card.update({
          where: {
            id: cardId,
          },
          data: {
            columnId: targetColumnId,
            position: POSITION_STEP,
          },
        });

        return this.getBoard(column.boardId);
      }

      if (smallestPositionCard.position >= INCREASE_STEP) {
        await prisma.card.update({
          where: { id: cardId },
          data: {
            columnId: targetColumnId,
            // replace the infinity to a reasonable number, so next time we insert it could be easier
            position: smallestPositionCard.position - INCREASE_STEP,
          },
        });

        return this.getBoard(column.boardId);
      } else {
        // now we need to re-balance the column
        await this.rebalancePositions(targetColumnId);
        return this.getBoard(column.boardId);
      }
    } else if (targetPosition === -1) {
      // insert to the bottom
      const largestPositionCard = await prisma.card.findFirst({
        where: {
          columnId: targetColumnId,
        },
        orderBy: {
          position: "desc",
        },
      });

      await prisma.card.update({
        where: { id: cardId },
        data: {
          columnId: targetColumnId,
          // replace the infinity to a reasonable number, so next time we insert it could be easier
          position: largestPositionCard.position + INCREASE_STEP,
        },
      });

      return this.getBoard(column.boardId);
    } else {
      // now we're in between somewhere
      const cards = await prisma.card.findMany({
        where: { columnId: targetColumnId },
        orderBy: { position: "asc" },
      });

      //70
      const updatedCards = cards.filter((card) => card.id !== cardId);
      const targetIndex = updatedCards.findIndex(
        (card) => card.position >= targetPosition
      );

      const previousPosition = updatedCards[targetIndex - 1].position;
      const nextPosition = updatedCards[targetIndex].position;
      const newPosition = Math.round((previousPosition + nextPosition) / 2);

      await prisma.card.update({
        where: { id: cardId },
        data: {
          columnId: targetColumnId,
          position: nextPosition,
        },
      });

      if (
        newPosition - previousPosition < INCREASE_STEP ||
        nextPosition - newPosition < INCREASE_STEP
      ) {
        await this.rebalancePositions(targetColumnId);
      }

      return this.getBoard(column.boardId);
    }
  }
}
