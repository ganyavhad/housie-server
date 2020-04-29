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
    roomId: {
        type: Number
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
    status: {
        type: String,
        enum: ['Open', 'Closed', 'Suspend'],
        default: 'Open'
    },
    winningGames: []
});
module.exports = mongoose.model("Ticket", schema);