const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Player'
  },
  players: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player'
  }],
  roomId: {
    type: Number,
    required: true
  },
  draw: [{
    type: Number
  }],
  juldiFive: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player'
  }],
  firstLine: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player'
  }],
  secondLine: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player'
  }],
  thirdLine: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player'
  }],
  fullHousie: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player'
  }],
  points: Number,
  maxPlayer: Number,
  status: {
    type: String,
    enum: ["Active", "Closed"],
    default: "Active"
  },
  gameStatus: {
    type: String,
    enum: ["BeforeStart", "Start", "ResultDeclared"],
    default: "BeforeStart"
  },
  startTime: {
    type: Date
  },
  endTime: {
    type: Date
  },
  entryFee: {
    type: Number,
    default: 100
  }
});
module.exports = mongoose.model("Room", schema);