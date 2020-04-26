const Room = require('../model/RoomModel');
const TicketService = require('../service/Ticket')
module.exports = {
    createRoom: async function (data) {
        try {
            let roomId = parseInt(Math.random() * 100000000);
            let roomObj = {}
            roomObj.creator = data._id;
            roomObj.roomId = roomId;
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
    },
    startGame: async function (data) {
        try {
            let roomData = await Room.findOne({
                creator: data._id,
                roomId: data.roomId,
                status: 'Active',
                gameStatus: 'BeforeStart'
            })
            if (!roomData) {
                return {
                    data: "Room Not Found",
                    value: false
                }
            }
            await Room.updateOne({
                _id: roomData._id
            }, {
                $set: {
                    startTime: new Date(),
                    gameStatus: "Start"
                }
            })

            let isTicketGenerated = await TicketService.addTickets({
                roomId: roomData._id,
                players: roomData.players
            })
            if (isTicketGenerated) {
                return {
                    data: "Game Start",
                    value: true
                }
            }
            return {
                data: "Failed to start game",
                value: false
            }
        } catch (error) {
            console.log("error", error)
            throw error
        }
    }
}