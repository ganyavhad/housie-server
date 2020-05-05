const Room = require('../model/RoomModel');
const TicketService = require('../service/Ticket')
const Player = require('../model/PlayerModel')
const PlayerService = require('../service/Player')
const IntervalService = require('../service/Interval')
module.exports = {
    createRoom: async function (data) {
        try {
            let roomId = parseInt(Math.random() * 100000000);
            let roomObj = {}
            let player = await player.findOne({
                _id: data._id
            })
            if (!player) {
                return {
                    data: "Player not found",
                    status: false
                }
            }
            if (player.balance < 100) {
                return {
                    data: "Insufficient Balance",
                    status: false
                }
            }
            roomObj.creator = data._id;
            roomObj.roomId = roomId;
            roomObj.maxPlayer = data.maxPlayer;
            roomObj.players = [data._id];
            let room = new Room(roomObj);
            let savedData = await room.save();
            return {
                data: savedData,
                status: true
            }
        } catch (error) {
            throw error
        }
    },
    joinRoom: async function (data) {
        try {
            let player = await Player.findOne({
                _id: data._id
            }, {
                name: 1,
                balance: 1
            })
            console.log(player)
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
            if (roomData.players.length >= roomData.maxPlayer) {
                return {
                    data: "Room Full",
                    status: false
                }
            }
            if (roomData.entryFee > player.balance) {
                return {
                    data: "Insufficient Balance",
                    status: false
                }
            }
            let updatedData = await Room.updateOne({
                _id: roomData._id
            }, {
                $push: {
                    players: data._id
                },
                $inc: {
                    potAmount: roomData.entryFee
                }
            })
            if (updatedData.nModified && updatedData.nModified >= 1) {
                roomData.players.push(data._id)
                io.emit(`table_join_${roomData.roomId}`, player)
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
            console.log(error)
            throw error
        }
    },
    startGame: async function (data) {
        try {
            let roomData = await Room.findOne({
                creator: data._id,
                roomId: data.roomId,
                status: 'Active',
                gameStatus: 'BeforeStart',
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
                room: roomData._id,
                players: roomData.players,
                roomId: roomData.roomId
            })
            if (isTicketGenerated) {
                await PlayerService.collectCoins(roomData.players, roomData.entryFee)
                io.emit(`game_start_${roomData.roomId}`, {})
                IntervalService.set(roomData.roomId)
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
    },
    addDraw: async function (data) {
        return await Room.updateOne({
            roomId: data.roomId,
            status: "Active",
            gameStatus: "Start"
        }, {
            $push: {
                draw: data.number
            }
        })
    },
    getRoom: async function (data) {
        try {
            return await Room.findOne({
                roomId: data.roomId,
                status: 'Active',
                gameStatus: "Start"
            }, {
                players: 0
            })
        } catch (error) {
            throw error
        }
    },
    verifyStatus: async function (player, roomId, type, drawNumber) {
        try {
            let roomData = await Room.findOne({
                _id: roomId,
                status: 'Active',
                gameStatus: "Start"
            })
            if (!roomData) {
                return {
                    status: false,
                    message: "Room Not Found"
                }
            }
            let status = true
            let updateObj = {}
            drawNumber.forEach(num => {
                if (roomData.draw.indexOf(num) === -1) {
                    status = false
                }
            })
            if (type == 'fullHousie') {
                if (roomData.fullHousie.length >= 1) {
                    return {
                        status: false,
                        message: "Full housie already claimed"
                    }
                }
                updateObj = {
                    $set: {
                        gameStatus: "ResultDeclared",
                        status: "Closed",
                    },
                    $push: {
                        fullHousie: player
                    }
                }
            }
            if (type == 'juldiFive') {
                if (roomData.juldiFive.length >= 1) {
                    return {
                        status: false,
                        message: "Juldi Five already claimed"
                    }
                }
                updateObj = {
                    $push: {
                        juldiFive: player
                    }
                }
            }
            if (type == 'firstLine') {
                if (roomData.firstLine.length >= 1) {
                    return {
                        status: false,
                        message: "First Line already claimed"
                    }
                }
                updateObj = {
                    $push: {
                        firstLine: player
                    }
                }
                console.log("updateObj", updateObj, status)
            }
            if (type == 'secondLine') {
                if (roomData.secondLine.length >= 1) {
                    return {
                        status: false,
                        message: "Second Line already claimed"
                    }
                }
                updateObj = {
                    $push: {
                        secondLine: player
                    }
                }
            }

            if (type == 'thirdLine') {
                if (roomData.thirdLine.length >= 1) {
                    return {
                        status: false,
                        message: "Third Line already claimed"
                    }
                }
                updateObj = {
                    $push: {
                        thirdLine: player
                    }
                }
            }

            console.log("status::::", status)
            if (status) {
                await Room.updateOne({
                    _id: roomId,
                    status: 'Active',
                    gameStatus: "Start"
                }, updateObj)
                return {
                    status: true,
                    message: `Claim accepted for ${type}`,
                    potAmount: roomData.potAmount
                }
            } else {
                return {
                    status: false,
                    message: "Claim rejected"
                }
            }
        } catch (error) {
            console.log("error", error)
            throw error
        }
    }
}