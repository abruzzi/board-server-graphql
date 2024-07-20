import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

import { Card, Board, Column } from "@prisma/client";

export class BoardsDataSource {
  async getBoard(
    id: string
  ): Promise<(Board & { columns: (Column & { cards: Card[] })[] }) | null> {
    return prisma.board.findUnique({
      where: { id },
      include: { columns: { include: { cards: true } } },
    });
  }

  async getColumn(id: string): Promise<(Column & { cards: Card[] }) | null> {
    return prisma.column.findUnique({
      where: { id },
      include: { cards: true },
    });
  }

  async createBoard(name: string) {
    return prisma.board.create({
      data: { name },
    });
  }

  async getBoards(): Promise<(Board & { columns: Column[] })[]> {
    return prisma.board.findMany({
      include: { columns: true },
    });
  }

  async createColumn(boardId: string, name: string, position: number) {
    return prisma.column.create({
      data: { boardId, name, position },
    });
  }

  async createCard(
    columnId: string,
    title: string,
    description: string
  ): Promise<Card> {
    if (columnId && title) {
      return prisma.card.create({
        data: { columnId, title, description, position: 1 },
      });
    } else {
      throw new Error("Invalid input");
    }
  }

  async createSimpleCard(columnId: string, title: string): Promise<Card> {
    if (columnId && title) {
      return prisma.card.create({
        data: { columnId, title, description: "", position: 1 },
        include: { column: true },
      });
    } else {
      throw new Error("Invalid input");
    }
  }

  async moveCard(
    cardId: string,
    targetColumnId: string,
    targetPosition: number
  ) {
    return prisma.card.update({
      where: { id: cardId },
      data: {
        columnId: targetColumnId,
        position: targetPosition,
      },
    });
  }
}
