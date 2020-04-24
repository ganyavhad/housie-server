const express = require("express");
const app = express();

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

app.get("/getTicket", (req, res) => {
  const ticket = require("./ticket")();
  res.status(200).send(ticket);
});

app.listen(3000, () => {
  console.log("Listening on 3000");
});
