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
