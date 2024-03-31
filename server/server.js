import { Socket } from "dgram";
import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const PORT = 3000;
const HOST = "192.168.0.5"; // Example network IP address

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.get("/", (req, res) => {
  res.send({ "Server is running": true });
});

const clientRooms = {};
let players = [];
let board = Array(9).fill(null);
let currentPlayerIndex = 0;

io.on("connection", (socket) => {
  console.log("Client connected");

  console.log("Players:", players);

  socket.emit("gameState", {
    board,
    currentPlayer: players[currentPlayerIndex],
  });

  socket.on("new-game", () => {
    console.log("Creating new game");
    //use a function to generate a random game ID alphanumeric string
    let gameId = Math.random().toString(36).substring(2, 7);
    clientRooms[socket.id] = gameId;
    let playerOne = socket.id;
    players.push({ playerOne: playerOne });
    socket.join(gameId);
    socket.to(gameId).emit("group-message", "you have joined " + gameId);
    socket.emit("game-created", gameId);
    console.log("Game ID:", gameId);
    io.to(gameId).emit("group-message", "Player joined " + gameId);
  });

  socket.on("send-message", (message, gameId) => {
    console.log("Message:", message);
    io.to(gameId).emit("group-message", message);
  });

  socket.on("join-game", (gameId) => {
    console.log("Joining game", gameId);
    const room = io.sockets.adapter.rooms.get(gameId);
    let numClients = 0;
    if (room) {
      numClients = room.size;
    }
    if (numClients === 0) {
      socket.emit("unknown-game");
      return;
    } else if (numClients > 1) {
      socket.emit("too-many-players");
      return;
    }

    clientRooms[socket.id] = gameId;
    let playerTwo = socket.id;
    players.push({ playerTwo: playerTwo });
    socket.join(gameId);
    socket.to(gameId).emit("player-joined", {
      players: players,
    });

    socket.emit("player-joined");
    console.log("Room:", room);

    console.log("Players:", players);
    io.emit("semira", { gameId: gameId, players });
    io.to(gameId).emit("group-message", "Player joined " + gameId);
  });

  socket.on("move", (index) => {
    console.log("Move:", index, socket.id);

    io.emit("move", index);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    players = players.filter((player) => player !== socket.id);
  });
});

server.listen(PORT, HOST, () => {
  console.log(`Server running on host http://${HOST}:${PORT}`);
});
