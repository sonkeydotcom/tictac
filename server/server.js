import { randomUUID } from "crypto";
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

const clientRooms = {};
let players = [];
let board = Array(9).fill(null);
let currentPlayerIndex = 0;
let sessionStore = new Map();

const randomId = () => {
  return randomUUID();
};

/** 
io.use((socket, next) => {
  const sessionID = socket.handshake.auth && socket.handshake.auth.sessionID;
  if (sessionID) {
    const session = sessionStore.get(sessionID);
    if (session) {
      socket.sessionID = sessionID;
      socket.userID = session.userID;
      return next();
    }
  }
  const username = socket.handshake.auth && socket.handshake.auth.username;
  if (!username) {
    return next(new Error("invalid username"));
  }
  socket.sessionID = randomId();
  socket.userID = randomId();
  socket.username = username;
  next();

  console.log({
    sessionID: socket.sessionID,
    userID: socket.userID,
    username: socket.username,
    socketID: socket.id,
  });
});

*/

io.on("connection", (socket) => {
  console.log("Client connected");
  console.log("Players:", players);

  socket.on("join", (id) => {
    socket.leave(socket.id);
    socket.join(id);
    socket.id = id;
  });

  socket.on("new-game", () => {
    console.log("Creating new game");
    //use a function to generate a random game ID alphanumeric string
    let gameId = Math.random().toString(36).substring(2, 7);
    clientRooms[socket.id] = gameId;
    let playerOne = socket.id;
    socket.join(gameId);
    players.push({ playerOne: playerOne });
    socket.to(gameId).emit("group-message", "you have joined " + gameId);
    socket.emit("game-created", gameId);
    console.log("Game ID:", gameId);
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
    socket.join(gameId);
    players.push({ playerTwo: playerTwo });
    socket.to(gameId).emit("player-joined", {
      players: players,
    });
    socket.emit("player-joined");
    console.log("Room:", room);
    io.to(gameId).emit("group-message", "Sonkey ko " + gameId);
    console.log("Players:", players);
    io.to(gameId).emit("semira", { players });
    console.log("Semira:", players);
  });

  socket.on("moves-count", (data) => {
    console.log("Count moves:", data);
    io.emit("count-moves", {
      xMoves: data.xMoves + 1,
      oMoves: data.oMoves,
    });
  });

  socket.on("restart-game", ({ gameId }) => {
    io.to(gameId).emit("restart-game");
  });

  socket.on("test-message", (message) => {
    const gameId = clientRooms[socket.id];
    console.log("Message:", message);
    if (!gameId) {
      console.error("No gameId found for socket:", socket.id);
      return;
    }
    io.to(gameId).emit("test-message", message);
    console.log("Game ID:", gameId);
  });

  socket.on("send-message", (message, gameId) => {
    console.log("Message:", message);
    io.to(gameId).emit("group-message", message);
  });

  socket.on("move", (data) => {
    const gameId = clientRooms[socket.id];
    console.log("Move:", data, socket.id);
    io.to(gameId).emit("move", data);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    players = players.filter(
      (player) =>
        player.playerOne !== socket.id && player.playerTwo !== socket.id
    );
    console.log("CLient with ID", socket.id, "disconnected");
  });
});

app.get("/", (req, res) => {
  res.send({ "Server is running": true });
});

server.listen(PORT, HOST, () => {
  console.log(`Server running on host http://${HOST}:${PORT}`);
});
