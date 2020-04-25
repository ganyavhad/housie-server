const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    profilePic: {
        type: String
    },
    balance: {
        type: Number,
        default: 500
    },
    type: {
        type: String,
        enum: ['Guest', 'Member']
    }
});
module.exports = mongoose.model("Player", schema);