const express = require("express");
const app = express();
//  for setup socket.io , we need to get http module from http which is pre installed in node modules
const { createServer } = require("node:http"); // get create server from node:http
const path = require("node:path");
const socketIo = require("socket.io"); // get socket.io
const server = createServer(app); // create a server using node method createServer
const io = socketIo(server); // a connection request is comming from client so handle it
io.on("connection", function (socket) {
  // socket is a unique value
  //  accept the request sent by client
  socket.on("send-location", function (data) {
    //  send id and data that includes latitude ,longitude
    io.emit("recieve-location", { id: socket.id, ...data });
  });

  //   handle user disconnection
  socket.on("disconnect", (data) => {
    //  send id of those , who disconnected
    io.emit("user-disconnect", socket.id);
  });
//   console.log("connected to socket");
});

//  set view-engine with ejs
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", function (req, res) {
  res.render("index");
});

server.listen(8000, () => console.log("app is listening at 8000"));
