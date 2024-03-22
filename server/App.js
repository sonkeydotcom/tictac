import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

const io = new Server(server);

app.get("/", (req, res) => {
  res.status(404).send({
    message: "api v1.0.0 is running",
  });
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
