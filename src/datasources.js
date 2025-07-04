"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoardsDataSource = void 0;
const client_1 = require("@prisma/client");
const uuid_1 = require("uuid");
const prisma = new client_1.PrismaClient();
const INCREASE_STEP = 10;
const POSITION_STEP = 100;
class BoardsDataSource {
    async getUser(id) {
        return prisma.user.findUnique({
            where: { id },
        });
    }
    async getUserByEmail(email) {
        return prisma.user.findUnique({ where: { email } });
    }
    async getComments(cardId, first, after) {
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
                endCursor: comments.length > 0 ? comments[comments.length - 1].id : null,
                hasNextPage: comments.length === first,
            },
        };
    }
    async findInvitation(token) {
        return prisma.invitation.findUnique({
            where: { token: token },
            include: { board: true },
        });
    }
    async addUserToBoard(invitation, userId) {
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
    async getBoard(id) {
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
        if (!board) {
            return null;
        }
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
    async createInvitation(email, boardId) {
        const token = (0, uuid_1.v4)();
        return prisma.invitation.create({
            data: {
                email: email,
                token: token,
                boardId: boardId,
            },
        });
    }
    async updateBoardImageUrl(boardId, imageUrl) {
        return prisma.board.update({ where: { id: boardId }, data: { imageUrl } });
    }
    async updateBoardName(boardId, name) {
        return prisma.board.update({ where: { id: boardId }, data: { name } });
    }
    async toggleFavoriteBoard(boardId, userId) {
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
        }
        else {
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
    async getColumn(id) {
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
    async createBoardWithDefaultColumns(name, userId) {
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
    async getBoards(userId) {
        return prisma.board.findMany({
            where: { userId },
            include: { columns: true },
        });
    }
    async getCollaborateBoards(userId) {
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
    async getFavoriteBoards(userId) {
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
    async createColumn(boardId, name, position) {
        return prisma.column.create({
            data: { boardId, name, position },
        });
    }
    async createUser(email, name, avatarUrl) {
        return prisma.user.create({
            data: { name, email, avatarUrl },
        });
    }
    async updateUser(id, name, avatarUrl) {
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
    async getCard(id) {
        return prisma.card.findUnique({ where: { id } });
    }
    async createSimpleCard(columnId, title) {
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
    async createCardFromComment(cardId, title, description) {
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
    async softDeleteCard(cardId) {
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
    async addCommentToCard(cardId, content, userId) {
        const newComment = await prisma.comment.create({
            data: {
                content,
                card: { connect: { id: cardId } },
                user: { connect: { id: userId } },
            },
            include: {
                user: true,
                card: true,
            },
        });
        const response = {
            commentEdge: {
                node: newComment,
                cursor: newComment.id,
            },
            card: {
                id: cardId,
            },
        };
        return response;
    }
    async removeComment(commentId) {
        return prisma.comment.delete({ where: { id: commentId } });
    }
    async updateCardTitle(cardId, title) {
        return prisma.card.update({
            where: { id: cardId },
            data: {
                title,
            },
        });
    }
    async updateCardDescription(cardId, description) {
        return prisma.card.update({
            where: { id: cardId },
            data: {
                description,
            },
        });
    }
    async updateCardImageUrl(cardId, imageUrl) {
        return prisma.card.update({
            where: { id: cardId },
            data: {
                imageUrl,
            },
        });
    }
    async rebalancePositions(columnId) {
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
        const updates = updatedCards.map((card) => prisma.card.update({
            where: { id: card.id },
            data: { position: card.position },
        }));
        await prisma.$transaction(updates);
    }
    async moveCard(cardId, targetColumnId, targetPosition) {
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
            }
            else {
                // now we need to re-balance the column
                await this.rebalancePositions(targetColumnId);
                return this.getBoard(column.boardId);
            }
        }
        else if (targetPosition === -1) {
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
        }
        else {
            // now we're in between somewhere
            const cards = await prisma.card.findMany({
                where: { columnId: targetColumnId },
                orderBy: { position: "asc" },
            });
            //70
            const updatedCards = cards.filter((card) => card.id !== cardId);
            const targetIndex = updatedCards.findIndex((card) => card.position >= targetPosition);
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
            if (newPosition - previousPosition < INCREASE_STEP ||
                nextPosition - newPosition < INCREASE_STEP) {
                await this.rebalancePositions(targetColumnId);
            }
            return this.getBoard(column.boardId);
        }
    }
}
exports.BoardsDataSource = BoardsDataSource;
