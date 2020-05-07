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
    player: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player'
    },
    winAmt: {
      type: Number
    }
  }],
  firstLine: [{
    player: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player'
    },
    winAmt: {
      type: Number
    }
  }],
  secondLine: [{
    player: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player'
    },
    winAmt: {
      type: Number
    }
  }],
  thirdLine: [{
    player: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player'
    },
    winAmt: {
      type: Number
    }
  }],
  fullHousie: [{
    player: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player'
    },
    winAmt: {
      type: Number
    }
  }],
  potAmount: Number,
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