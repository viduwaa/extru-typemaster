import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const server = http.createServer(app);

app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST"],
  credentials: true
}));

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ["my-custom-header"]
  },
  pingTimeout: 60000,
  transports: ['websocket', 'polling']
});

interface Game {
  id: string;
  players: string[];
  paragraph: string[];
  started: boolean;
  progress: { [key: string]: number };
}

const games: { [key: string]: Game } = {};

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('createGame', (playerName: string) => {
    const gameId = Math.random().toString(36).substring(2, 8);
    games[gameId] = {
      id: gameId,
      players: [playerName],
      paragraph: [], // We'll set this when the game starts
      started: false,
      progress: {}
    };
    socket.join(gameId);
    socket.emit('gameCreated', gameId);
  });

  socket.on('joinGame', ({ gameId, playerName }: { gameId: string, playerName: string }) => {
    const game = games[gameId];
    if (game && game.players.length < 4 && !game.started) {
      game.players.push(playerName);
      socket.join(gameId);
      io.to(gameId).emit('playerJoined', game.players ,gameId);
    } else {
      socket.emit('joinError', 'Unable to join the game');
    }
  });

  socket.on('startGame', ({ gameId, paragraph }: { gameId: string, paragraph: string[] }) => {
    const game = games[gameId];
    if (game && game.players.length >= 2) {
      game.started = true;
      game.paragraph = paragraph;
      io.to(gameId).emit('gameStarted', paragraph);
    }
  });

  socket.on('updateProgress', ({ gameId, playerName, progress }: { gameId: string, playerName: string, progress: number }) => {
    const game = games[gameId];
    if (game) {
      game.progress[playerName] = progress;
      io.to(gameId).emit('progressUpdated', game.progress);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
    // Handle player disconnection (remove from game, etc.)
  });


});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

