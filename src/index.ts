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
  origin: "https://fellow-olive.vercel.app", // Frontend origin
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
        const token = req.headers.authorization || "";
        const user = getUser(token);

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
      const { email, name } = payload;

      // Check if user exists in your database
      const user = await boardsAPI.getUserByEmail(email);

      if (!user) {
        // User doesn't exist, create a new account
        await boardsAPI.createUser(email, name);
      } else {
        // User exists, update their information if necessary
        await boardsAPI.updateUser(user.id, email, name);
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

  const port = parseInt(process.env.PORT) || 8080;
  await new Promise<void>((resolve) => httpServer.listen({ port }, resolve));

  console.log(`🚀 Server ready at http://localhost:${port}/graphql`);
}

startServer();
