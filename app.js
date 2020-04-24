const express = require("express");
const app = express();

const server = require("http").createServer(app);
io = require("socket.io")(server);

io.on("connection", () => {
  console.log("socket connected");
});
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

const draw = require("./draw")();
app.get("/getTicket", (req, res) => {
  const ticket = require("./ticket")();
  res.status(200).send(ticket);
});

server.listen(3000, () => {
  console.log("Listening on 3000");
});
