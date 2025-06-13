import { ApolloServer } from "@apollo/server";

import resolvers from "./resolvers/index.js";
import { BoardsDataSource } from "./datasources.js";

import { readFileSync } from "fs";
import express from "express";
import http from "http";
import cors from "cors";

import { expressMiddleware } from "@apollo/server/express4";
import { OAuth2Client } from "google-auth-library";
import { getUser, User } from "./get-user.js";
import jwt from "jsonwebtoken";
import { sendInvitationEmail } from "./sendInvitationEmail.js";

const typeDefs = readFileSync("./schema.graphql", { encoding: "utf-8" });

export interface BoardContext {
  user: User | null;
  dataSources: {
    boardsAPI: BoardsDataSource;
  };
}

const boardsAPI = new BoardsDataSource();
const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.OAUTH_REDIRECT_URI
);

const corsOptions = {
  origin: "http://localhost:5173", // Frontend origin
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

async function startServer() {
  const app = express();
  const httpServer = http.createServer(app);

  const server = new ApolloServer<BoardContext>({
    typeDefs,
    resolvers,
  });

  await server.start();

  app.use(cors(corsOptions));
  app.options("*", cors(corsOptions)); // This handles preflight requests

  app.use(
    "/graphql",
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const authHeader = req.headers.authorization || "";
        const token = authHeader.split(" ")[1];

        const user = process.env.NODE_ENV === 'development' ? 
          {
              id: "user-local",
              name: "Juntao Qiu",
              email: "juntao.qiu@gmail.com"
          } : getUser(token)

        return {
          user,
          dataSources: {
            boardsAPI: boardsAPI,
          },
        };
      },
    })
  );

  app.post("/auth/google-callback", express.json(), async (req, res) => {
    const { code } = req.body;
    try {
      // Exchange code for tokens
      const { tokens } = await oauth2Client.getToken(code);
      const idToken = tokens.id_token;

      // Verify the ID token
      oauth2Client.setCredentials(tokens);
      const ticket = await oauth2Client.verifyIdToken({
        idToken: idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      const { email, name, picture } = payload;

      // Check if user exists in your database
      let user = await boardsAPI.getUserByEmail(email);

      if (!user) {
        // User doesn't exist, create a new account
        user = await boardsAPI.createUser(email, name, picture);
      } else {
        // User exists, update their information if necessary
        user = await boardsAPI.updateUser(user.id, name, picture);
      }

      // Create a JWT token for your app
      const appToken = jwt.sign(user, process.env.JWT_SECRET, {
        expiresIn: "3d",
      });

      // Send the token back to the frontend
      res.json({ token: appToken });
    } catch (error) {
      console.error(
        "Error exchanging code for tokens:",
        error.response?.data || error.message
      );
      res.status(500).json({ error: "Failed to exchange code for tokens" });
    }
  });

  app.post("/invite", express.json(), async (req, res, next) => {
    try {
      const { email, boardId } = req.body;

      const board = await boardsAPI.getBoard(boardId);

      if (!board) {
        return res.status(404).json({ error: "Board not found" });
      }

      const invitation = await boardsAPI.createInvitation(email, boardId);
      const invitationLink = `${process.env.APP_BASE_URI}/accept-invitation?token=${invitation.token}&board=${board.id}`;

      await sendInvitationEmail(email, board.name, invitationLink);

      res.json({ message: "Invitation sent" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to sent invitation" });
    }
  });

  app.post("/accept-invitation", express.json(), async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization || "";
      const token = authHeader.split(" ")[1];

      const user = getUser(token);

      if (!user) {
        return res
          .status(401)
          .json({ error: "The user should be authenticated first" });
      }

      const { invitationToken } = req.body;

      const invitation = await boardsAPI.findInvitation(invitationToken);

      if (!invitation) {
        return res.status(404).json({ error: "Invitation not found" });
      }

      if (invitation.status !== "pending") {
        return res.status(400).json({ error: "Invitation already processed" });
      }

      const board = await boardsAPI.addUserToBoard(invitation, user.id);

      // now they can use the id to navigate to the current board
      res.json({ boardId: board.id });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to accept the invitation" });
    }
  });

  const port = parseInt(process.env.PORT) || 8080;
  await new Promise<void>((resolve) => httpServer.listen({ port }, resolve));

  console.log(`🚀 Server ready at http://localhost:${port}/graphql`);
}

startServer();
