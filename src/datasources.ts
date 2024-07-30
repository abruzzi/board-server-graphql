import { PrismaClient } from "@prisma/client";
import { Card, Board, Column, User, Comment, Tag } from "@prisma/client";

const prisma = new PrismaClient();

const INCREASE_STEP = 10;
const POSITION_STEP = 100;

export class BoardsDataSource {
  async getUser(id: string): Promise<User> {
    return prisma.user.findUnique({ where: { id } });
  }

  async getUserByEmail(email: string): Promise<User> {
    return prisma.user.findUnique({ where: { email } });
  }

  async getComments(cardId: string): Promise<Comment[]> {
    return prisma.comment.findMany({
      where: {
        cardId: cardId,
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async createTag(name: string) {
    const tag = await prisma.tag.findUnique({
      where: { name },
    });

    // if there is a same name tag exists
    if (tag) {
      return tag;
    }

    return prisma.tag.create({
      data: {
        name,
      },
    });
  }

  async addTagToCard(cardId: string, tagId: string) {
    return prisma.cardTag.create({
      data: {
        cardId,
        tagId,
      },
    });
  }

  async getTags(): Promise<Tag[]> {
    return prisma.tag.findMany();
  }

  async getBoard(id: string) {
    return prisma.board.findUnique({
      where: { id },
      include: {
        columns: {
          include: {
            cards: {
              where: {
                deleted: false,
              },
              include: {
                column: true,
                cardTags: {
                  include: {
                    tag: true,
                  },
                },
              },
              orderBy: { position: "asc" },
            },
          },
        },
      },
    });
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

  async createColumn(boardId: string, name: string, position: number) {
    return prisma.column.create({
      data: { boardId, name, position },
    });
  }

  async createUser(email: string, name: string) {
    return prisma.user.create({
      data: { name, email },
    });
  }

  async updateUser(id: string, email: string, name: string) {
    return prisma.user.update({
      where: {
        id,
      },
      data: {
        email,
        name,
      },
    });
  }

  async signIn(email: string) {
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({ data: { email } });
    }
    return user;
  }

  async createSimpleCard(columnId: string, title: string): Promise<Card> {
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

    if (columnId && title) {
      return prisma.card.create({
        data: {
          columnId,
          title,
          description: "",
          position: position,
        },
        include: { column: true },
      });
    } else {
      throw new Error("Invalid input");
    }
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

    return prisma.card.create({
      data: {
        columnId: card.columnId,
        title,
        description,
        position: position,
      },
      include: { column: true },
    });
  }

  async softDeleteCard(cardId: string): Promise<Card> {
    return prisma.card.update({
      where: { id: cardId },
      data: {
        deleted: true,
        deletedAt: new Date(),
      },
    });
  }

  async deleteCard(cardId: string): Promise<Card> {
    return prisma.card.delete({
      where: { id: cardId },
    });
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
        return prisma.card.update({
          where: {
            id: cardId,
          },
          data: {
            columnId: targetColumnId,
            position: POSITION_STEP,
          },
        });
      }

      if (smallestPositionCard.position >= INCREASE_STEP) {
        return prisma.card.update({
          where: { id: cardId },
          data: {
            columnId: targetColumnId,
            // replace the infinity to a reasonable number, so next time we insert it could be easier
            position: smallestPositionCard.position - INCREASE_STEP,
          },
        });
      } else {
        // now we need to re-balance the column
        await this.rebalancePositions(targetColumnId);
        return prisma.card.findUnique({ where: { id: cardId } });
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

      return prisma.card.update({
        where: { id: cardId },
        data: {
          columnId: targetColumnId,
          // replace the infinity to a reasonable number, so next time we insert it could be easier
          position: largestPositionCard.position + INCREASE_STEP,
        },
      });
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

      return prisma.card.findUnique({ where: { id: cardId } });
    }
  }
}
