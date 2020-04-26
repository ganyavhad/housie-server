const Room = require('../model/RoomModel');

module.exports = {
    createRoom: async function (data) {
        try {
            let roomId = parseInt(Math.random() * 100000000);
            let roomObj = {}
            roomObj.creator = data._id;
            roomObj.roomId = roomId;
            roomObj.startTime = new Date();
            roomObj.maxPlayer = data.maxPlayer;
            roomObj.players = [data._id];
            let room = new Room(roomObj);
            return await room.save();
        } catch (error) {
            throw error
        }
    },
    joinRoom: async function (data) {
        try {
            let roomData = await Room.findOne({
                roomId: data.roomId,
                status: 'Active'
            })
            if (!roomData) {
                return {
                    data: "Room not found",
                    status: false
                }
            }
            let playerIndex = roomData.players.indexOf(data._id);
            if (playerIndex !== -1) {
                return {
                    data: roomData,
                    status: true
                }
            }
            let updatedData = await Room.updateOne({
                _id: roomData._id
            }, {
                $push: {
                    players: data._id
                }
            })
            console.log("updatedData", updatedData)
            if (updatedData.nModified && updatedData.nModified >= 1) {
                roomData.players.push(data._id)
                return {
                    data: roomData,
                    status: true
                }
            }
            return {
                data: "Failed to join room",
                status: false
            }
        } catch (error) {
            throw error
        }
    }
}