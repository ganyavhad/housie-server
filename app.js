const express = require("express");
const app = express();
const server = require("http").createServer(app);

// socket functionality
io = require("socket.io")(server);
io.on("connection", () => {
  console.log("socket connected");
});

// middlewares
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// db connection
require('./db')()

const playerController = require('./controller/PlayerController')
const roomController = require('./controller/RoomController')
const ticketController = require('./controller/TicketController')

app.use('/player', playerController)
app.use('/room', roomController)
app.use('/ticket', ticketController)

app.get("/getTicket", (req, res) => {
  const ticket = require("./ticket")();
  res.status(200).send(ticket);
});

server.listen(process.env.PORT || 3000, () => {
  console.log(`Listening on ${process.env.PORT?process.env.PORT:3000}`);
});