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
  maxPlayer: Number
});
module.exports = mongoose.model("Room", schema);