const server = require("express");
const http = require("http").Server(server);
const io = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"],
  },
});

io.on("connection", function (socket) {
  console.log("A user connected: " + socket.id);

  socket.on("send", function (text) {
    let newText = "<" + socket.id + "> " + text;
    io.emit("receive", newText);
  });

  socket.on("create player", () => {
    console.log("hello form the server");
  });
  socket.on("disconnect", function () {
    console.log("A user disconnected: " + socket.id);
  });
});

http.listen(3000, function () {
  console.log("Server started!");
});

//Client Socket sends game data from Phaser -- what are all the actions that have to be transmitted -- spawning, moving, rendering with the character
//Server Socket recieves data and emits to all players
//Client Sockets recieve game data and send it to Phaser
//Then Phaser Renders
