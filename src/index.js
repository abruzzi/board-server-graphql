"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("@apollo/server");
const index_js_1 = __importDefault(require("./resolvers/index.js"));
const datasources_js_1 = require("./datasources.js");
const fs_1 = require("fs");
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const express4_1 = require("@apollo/server/express4");
const google_auth_library_1 = require("google-auth-library");
const get_user_js_1 = require("./get-user.js");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sendInvitationEmail_js_1 = require("./sendInvitationEmail.js");
const ws_1 = require("ws");
const ws_2 = require("graphql-ws/dist/use/ws");
const schema_1 = require("@graphql-tools/schema");
const typeDefs = (0, fs_1.readFileSync)("./schema.graphql", { encoding: "utf-8" });
const boardsAPI = new datasources_js_1.BoardsDataSource();
const oauth2Client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.OAUTH_REDIRECT_URI);
const corsOptions = {
    origin: "http://localhost:5173", // Frontend origin
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};
async function startServer() {
    const app = (0, express_1.default)();
    const httpServer = http_1.default.createServer(app);
    const schema = (0, schema_1.makeExecutableSchema)({ typeDefs, resolvers: index_js_1.default });
    // WebSocket server
    const wsServer = new ws_1.WebSocketServer({
        server: httpServer,
        path: "/graphql",
    });
    // Enable subscriptions
    (0, ws_2.useServer)({
        schema,
        context: async (ctx) => {
            const authHeader = ctx.connectionParams?.authorization;
            const token = authHeader?.split(" ")[1];
            const user = process.env.NODE_ENV === "development"
                ? {
                    id: "user-local",
                    name: "Juntao Qiu",
                    email: "juntao.qiu@gmail.com",
                }
                : (0, get_user_js_1.getUser)(token);
            return {
                user,
                dataSources: {
                    boardsAPI: boardsAPI,
                },
            };
        },
    }, wsServer);
    const server = new server_1.ApolloServer({ schema });
    await server.start();
    app.use((0, cors_1.default)(corsOptions));
    app.options("*", (0, cors_1.default)(corsOptions)); // This handles preflight requests
    app.use("/graphql", express_1.default.json(), (0, express4_1.expressMiddleware)(server, {
        context: async ({ req }) => {
            const authHeader = req.headers.authorization || "";
            const token = authHeader.split(" ")[1];
            const user = process.env.NODE_ENV === "development"
                ? {
                    id: "user-local",
                    name: "Juntao Qiu",
                    email: "juntao.qiu@gmail.com",
                }
                : (0, get_user_js_1.getUser)(token);
            return {
                user,
                dataSources: {
                    boardsAPI: boardsAPI,
                },
            };
        },
    }));
    app.post("/auth/google-callback", express_1.default.json(), async (req, res) => {
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
            }
            else {
                // User exists, update their information if necessary
                user = await boardsAPI.updateUser(user.id, name, picture);
            }
            // Create a JWT token for your app
            const appToken = jsonwebtoken_1.default.sign(user, process.env.JWT_SECRET, {
                expiresIn: "3d",
            });
            // Send the token back to the frontend
            res.json({ token: appToken });
        }
        catch (error) {
            console.error("Error exchanging code for tokens:", error.response?.data || error.message);
            res.status(500).json({ error: "Failed to exchange code for tokens" });
        }
    });
    app.post("/invite", express_1.default.json(), async (req, res, next) => {
        try {
            const { email, boardId } = req.body;
            const board = await boardsAPI.getBoard(boardId);
            if (!board) {
                return res.status(404).json({ error: "Board not found" });
            }
            const invitation = await boardsAPI.createInvitation(email, boardId);
            const invitationLink = `${process.env.APP_BASE_URI}/accept-invitation?token=${invitation.token}&board=${board.id}`;
            await (0, sendInvitationEmail_js_1.sendInvitationEmail)(email, board.name, invitationLink);
            res.json({ message: "Invitation sent" });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ error: "Failed to sent invitation" });
        }
    });
    app.post("/accept-invitation", express_1.default.json(), async (req, res, next) => {
        try {
            const authHeader = req.headers.authorization || "";
            const token = authHeader.split(" ")[1];
            const user = (0, get_user_js_1.getUser)(token);
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
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ error: "Failed to accept the invitation" });
        }
    });
    const port = parseInt(process.env.PORT) || 8080;
    await new Promise((resolve) => httpServer.listen({ port }, resolve));
    console.log(`🚀 Server ready at http://localhost:${port}/graphql`);
}
startServer();
