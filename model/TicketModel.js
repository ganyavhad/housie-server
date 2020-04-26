const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    player: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player'
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room'
    },
    ticket: {
        firstLine: [{
            number: Number,
            status: {
                type: String,
                enum: ['None', 'Pending', 'Selected']
            }
        }],
        secondLine: [{
            number: Number,
            status: {
                type: String,
                enum: ['None', 'Pending', 'Selected']
            }
        }],
        thirdLine: [{
            number: Number,
            status: {
                type: String,
                enum: ['None', 'Pending', 'Selected']
            }
        }]
    },
    balance: {
        type: Number,
        default: 500
    },
    type: {
        type: String,
        enum: ['Guest', 'Member']
    },
    status: {
        type: String,
        enum: ['Open', 'Closed', 'Suspend']
    },
    winningGames: []
});
module.exports = mongoose.model("Player", schema);