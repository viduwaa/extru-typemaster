import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { getTopPlayers, insertGameResults } from "./db/queries";
import pool from "./db/config";
import { Game,GameResult } from "./types";
import axios from "axios";

const app = express();
const server = http.createServer(app);

app.use(
    cors({
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
    })
);

app.get('/api/paragraphs', async (req, res) => {
    try {
        const response = await axios.get('http://metaphorpsum.com/paragraphs/2/4');
        
        /* console.log('Metaphorpsum response:', {
            status: response.status,
            data: response.data
        }); */
        
        res.setHeader('Content-Type', 'text/plain');
        res.status(200).send(response.data);
    } catch (error) {
        if (axios.isAxiosError(error)) {  // Type guard for Axios errors
            console.error('Proxy error:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
        } else {
            console.error('Unexpected error:', error);
        }
        res.status(500).send('Error fetching paragraphs');
    }
});

app.get("/api/leaderboard", async (req, res) => {
    try {
        const leaderboard = await getTopPlayers(pool);
        res.json(leaderboard);
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        res.status(500).json({ error: "Failed to fetch leaderboard" });
    }
});

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
        allowedHeaders: ["my-custom-header"],
    },
    pingTimeout: 60000,
    transports: ["websocket", "polling"],
});



const games: { [key: string]: Game } = {};

io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("createGame", ({ playerID, playerName, additionalInfo }) => {
        if (!playerID || !playerName || !additionalInfo) {
            console.error("Missing required parameters.");
            return;
        }

        const gameId = Math.random().toString(36).substring(2, 8);

        games[gameId] = {
            id: gameId,
            players: [
                {
                    id: playerID,
                    name: playerName,
                    avatar: additionalInfo.selectedAvatar,
                    university: additionalInfo.university,
                    role: additionalInfo.role,
                    isSchoolStudent: additionalInfo.isSchoolStudent,
                },
            ],
            paragraph: [],
            started: false,
            progress: [],
            results: [],
        };

        socket.join(gameId);
        socket.emit("gameCreated", gameId);
    });

    socket.on(
        "joinGame",
        ({ gameId, playerName, playerID, additionalInfo }) => {
            const game = games[gameId];

            if (game && game.players.length < 4 && !game.started) {
                const playerExists = game.players.some(
                    (player) => player.id === playerID
                );
                if (!playerExists) {
                    game.players.push({
                        id: playerID,
                        name: playerName,
                        avatar: additionalInfo.selectedAvatar,
                    });
                    socket.join(gameId);
                    io.to(gameId).emit("playerJoined", game.players, gameId);
                } else {
                    socket.emit(
                        "joinError",
                        "Player already exists in the game"
                    );
                }
            } else {
                socket.emit("joinError", "Unable to join the game");
            }

            console.log(game);
        }
    );

    socket.on(
        "startGame",
        ({ gameId, paragraph }: { gameId: string; paragraph: string[] }) => {
            const game = games[gameId];
            if (game && Object.keys(game.players).length >= 2) {
                game.started = true;
                game.paragraph = paragraph;
                io.to(gameId).emit("gameStarted", paragraph);
            }
        }
    );

    socket.on(
        "updateProgress",
        ({
            gameId,
            currentPlayer,
            progress,
        }: {
            gameId: string;
            currentPlayer: { id: string; name: string };
            progress: number;
        }) => {
            const game = games[gameId];
            if (game) {
                const playerIndex = game.progress.findIndex(
                    (p) => p.id === currentPlayer.id
                );
                if (playerIndex !== -1) {
                    // Update existing player's progress
                    game.progress[playerIndex].progress = progress;
                } else {
                    // Add new player's progress
                    game.progress.push({
                        id: currentPlayer.id,
                        player: currentPlayer.name,
                        progress,
                    });
                }
                io.to(gameId).emit("progressUpdated", game.progress);
            }
        }
    );

    socket.on(
        "gameEnded",
        async ({ gameId, results }: { gameId: string; results: GameResult }) => {
            const game = games[gameId];
            if (game) {
                game.results.push(results);
                console.log("After push:", game);
                io.to(gameId).emit("gameResults", game.results);

                if (game.results.length === game.players.length) {
                    try {
                        await insertGameResults(pool, game);

                        // Get updated leaderboard
                        const leaderboard = await getTopPlayers(pool);

                        // Emit updated leaderboard to all connected clients
                        io.emit("leaderboardUpdate", leaderboard);
                        delete games[gameId];
                    } catch (error) {
                        console.error("Error handling game end:", error);
                        socket.emit("error", "Failed to save game results");
                        
                    }
                }else{
                    return;
                }
            }
        }
    );

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});

const PORT = process.env.PORT || 3011;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
