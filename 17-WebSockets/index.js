const express = require("express");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

//Socket.io
io.on("connection", (socket) => {
  socket.on("userMessage", (message) => {
    io.emit("message", message);
  });
});

app.use(express.static(path.resolve("./public")));

app.get("/", (Req, res) => {
  res.sendFile(path.resolve("./public/index.html"));
});

server.listen(9000, console.log("server started at port 9000"));
