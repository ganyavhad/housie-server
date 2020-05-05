const fullHousieShare = 40,
    juldiFiveShare = 15,
    firstLineShare = 15,
    secondLineShare = 15,
    thirdLineShare = 15

const Ticket = require('../model/TicketModel');
const PlayerService = require('../service/Player')
const _ = require('lodash');
const IntervalService = require('../service/Interval')
module.exports = {
    addTickets: async function (data) {
        try {
            data.players.forEach(async player => {
                let ticketObj = {}
                ticketObj.player = player
                ticketObj.room = data.room
                let ticketData = await this.generateTickets()
                ticketObj.ticket = {
                    firstLine: ticketData[0],
                    secondLine: ticketData[1],
                    thirdLine: ticketData[2]
                }
                ticketObj.roomId = data.roomId
                let ticket = new Ticket(ticketObj);
                await ticket.save()
                io.emit(`ticket_${data.roomId}`, {});
            });
            return true
        } catch (error) {
            console.log(error)
            return false
        }
    },
    generateTickets: async function () {
        try {
            let ticket = [
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0]
            ];
            let numberArr = [];
            for (let i = 1; i <= 90; i++) {
                numberArr.push(i);
            }
            let colArr = [];
            let start = 0;
            let end = 9;
            for (i = 0; i < 9; i++) {
                let shuffleArr = _.shuffle(
                    _.shuffle(_.shuffle(_.slice(numberArr, start, end)))
                );
                start = start + 10;
                end = end + 10;
                if (i == 8) {
                    end = end + 1
                }
                colArr.push(_.sortBy(shuffleArr.slice(0, 3)));
            }

            for (let i = 0; i < 9; i++) {
                for (let j = 0; j < 3; j++) {
                    ticket[j][i] = {
                        number: colArr[i][j],
                        status: "Pending"
                    };
                }
            }
            let tempArr = _.slice(numberArr, 0, 9);
            let shuffleArr = _.shuffle(_.shuffle(_.shuffle(tempArr)));
            for (let i = 0; i < 3; i++) {
                let arr = shuffleArr.slice(0, 4);
                shuffleArr = _.shuffle(_.shuffle(_.shuffle(shuffleArr.slice(4, 9))));
                arr.forEach((a) => {
                    ticket[i][a - 1] = {
                        number: 0,
                        status: "None"
                    };
                });
                if (arr.length == 1) {
                    let newArr = _.slice(_.shuffle(_.shuffle(_.shuffle(tempArr))), 0, 4);
                    let counter = 0;
                    newArr.forEach((a) => {
                        if (counter < 3 && a != arr[0]) {
                            ticket[i][a - 1] = {
                                number: 0,
                                status: "None"
                            };
                            counter++;
                        }
                    });
                }
            }
            return ticket;
        } catch (error) {
            throw error;
        }
    },
    getTicket: async function (data) {
        try {
            return await Ticket.findOne({
                roomId: data.roomId,
                player: data.userId
            })
        } catch (error) {
            throw error
        }

    },
    selectNumber: async function (data) {
        try {
            let filterObj = {}
            filterObj._id = data._id
            filterObj[`ticket.${data.line}.number`] = data.number
            updateObj = {}
            updateObj[`ticket.${data.line}.$.status`] = data.status
            let updatedData = await Ticket.updateOne(filterObj, {
                $set: updateObj
            })
            console.log(updatedData)
            if (updatedData.nModified >= 1) {
                return {
                    message: "Number Selected",
                    value: true
                }
            } else {
                return {
                    message: "Failed to select",
                    value: false
                }
            }
        } catch (error) {
            throw error
        }
    },
    fullHousie: async function (data) {
        let RoomService = require('../service/Room')
        try {
            let ticketData = await Ticket.findOne({
                _id: data._id
            }).populate({
                select: '',
                path: 'player'
            })
            if (!ticketData) {
                return {
                    message: 'Ticket Not Found',
                    value: false
                }
            }
            if (ticketData.status == 'Closed') {
                return {
                    message: 'Ticket Expired',
                    value: true,
                    errorNo: 1
                }
            }
            let firstLineNumbers = []
            let secondLineNumbers = []
            let thirdLineNumbers = []
            firstLineNumbers = _.map(ticketData.ticket.firstLine, fl => {
                if (fl.status == 'Selected') {
                    return fl.number
                }
            })
            secondLineNumbers = _.map(ticketData.ticket.secondLine, fl => {
                if (fl.status == 'Selected') {
                    return fl.number
                }
            })
            thirdLineNumbers = _.map(ticketData.ticket.thirdLine, fl => {
                if (fl.status == 'Selected') {
                    return fl.number
                }
            })
            let drawNumber = firstLineNumbers.concat(secondLineNumbers, thirdLineNumbers)
            _.remove(drawNumber, num => {
                return num === 0 || !num
            })
            if (drawNumber.length != 15) {
                return {
                    message: 'Please select Numbers',
                    value: true,
                    errorNo: 2
                }
            }
            let gameDetail = await RoomService.verifyStatus(ticketData.player, data.roomId, 'fullHousie', drawNumber)
            if (gameDetail.status) {
                await Ticket.updateOne({
                    _id: data._id
                }, {
                    $set: {
                        status: "Closed"
                    },
                    $push: {
                        winningGames: 'fullHousie'
                    }
                })
                let amount = gameDetail.potAmount * fullHousieShare / 100
                await PlayerService.addWinAmt(ticketData.player._id, amount)
                console.log("socket called", `winner_declared_${ticketData.roomId}`)
                io.emit(`winner_declared_${ticketData.roomId}`, {
                    winner: ticketData.player
                })
                let interval = {}
                IntervalService.clear(interval[ticketData.roomId])
                return {
                    message: gameDetail.message,
                    value: true,
                    errorNo: 0
                }
            } else {
                return {
                    message: gameDetail.message,
                    value: true,
                    errorNo: 2
                }
            }

        } catch (error) {
            throw error
        }
    },
    juldiFive: async function (data) {
        let RoomService = require('../service/Room')
        try {
            let ticketData = await Ticket.findOne({
                _id: data._id
            }).populate({
                select: '',
                path: 'player'
            })
            if (!ticketData) {
                return {
                    message: 'Ticket Not Found',
                    value: false
                }
            }
            if (ticketData.status == 'Closed') {
                return {
                    message: 'Ticket Expired',
                    value: true,
                    errorNo: 1
                }
            }
            let firstLineNumbers = []
            let secondLineNumbers = []
            let thirdLineNumbers = []
            firstLineNumbers = _.map(ticketData.ticket.firstLine, fl => {
                if (fl.status == 'Selected') {
                    return fl.number
                }
            })
            secondLineNumbers = _.map(ticketData.ticket.secondLine, fl => {
                if (fl.status == 'Selected') {
                    return fl.number
                }
            })
            thirdLineNumbers = _.map(ticketData.ticket.thirdLine, fl => {
                if (fl.status == 'Selected') {
                    return fl.number
                }
            })
            console.log(firstLineNumbers)
            console.log(secondLineNumbers)
            console.log(thirdLineNumbers)
            let drawNumber = firstLineNumbers.concat(secondLineNumbers, thirdLineNumbers)
            _.remove(drawNumber, num => {
                return num === 0 || !num
            })
            console.log("drawNumber.length", drawNumber, drawNumber.length)
            if (drawNumber.length < 5) {
                return {
                    message: 'Please select Numbers',
                    value: true,
                    errorNo: 2
                }
            }
            let gameDetail = await RoomService.verifyStatus(ticketData.player, data.roomId, 'juldiFive', drawNumber)
            if (gameDetail.status) {
                await Ticket.updateOne({
                    _id: data._id
                }, {
                    $push: {
                        winningGames: 'juldiFive'
                    }
                })
                let amount = gameDetail.potAmount * juldiFiveShare / 100
                await PlayerService.addWinAmt(ticketData.player._id, amount)
                console.log("socket called", `juldi_five_${ticketData.roomId}`)
                io.emit(`juldi_five_${ticketData.roomId}`, {
                    winner: ticketData.player
                })
                return {
                    message: gameDetail.message,
                    value: true,
                    errorNo: 0
                }
            } else {
                return {
                    message: gameDetail.message,
                    value: true,
                    errorNo: 2
                }
            }

        } catch (error) {
            throw error
        }
    },
    firstLine: async function (data) {
        let RoomService = require('../service/Room')
        try {
            let ticketData = await Ticket.findOne({
                _id: data._id
            }).populate({
                select: '',
                path: 'player'
            })
            if (!ticketData) {
                return {
                    message: 'Ticket Not Found',
                    value: false
                }
            }
            if (ticketData.status == 'Closed') {
                return {
                    message: 'Ticket Expired',
                    value: true,
                    errorNo: 1
                }
            }
            let drawNumber = []
            drawNumber = _.map(ticketData.ticket.firstLine, fl => {
                if (fl.status == 'Selected') {
                    return fl.number
                }
            })

            _.remove(drawNumber, num => {
                return num === 0 || !num
            })
            if (drawNumber.length < 5) {
                return {
                    message: 'Please select Numbers',
                    value: true,
                    errorNo: 2
                }
            }
            let gameDetail = await RoomService.verifyStatus(ticketData.player, data.roomId, 'firstLine', drawNumber)
            console.log("gameDetail", gameDetail)
            if (gameDetail.status) {
                await Ticket.updateOne({
                    _id: data._id
                }, {
                    $push: {
                        winningGames: 'firstLine'
                    }
                })
                let amount = gameDetail.potAmount * firstLineShare / 100
                await PlayerService.addWinAmt(ticketData.player._id, amount)
                console.log("socket called", `first_line_${ticketData.roomId}`)
                io.emit(`first_line_${ticketData.roomId}`, {
                    winner: ticketData.player
                })
                return {
                    message: gameDetail.message,
                    value: true,
                    errorNo: 0
                }
            } else {
                return {
                    message: gameDetail.message,
                    value: true,
                    errorNo: 2
                }
            }

        } catch (error) {
            throw error
        }
    },
    secondLine: async function (data) {
        let RoomService = require('../service/Room')
        try {
            let ticketData = await Ticket.findOne({
                _id: data._id
            }).populate({
                select: '',
                path: 'player'
            })
            if (!ticketData) {
                return {
                    message: 'Ticket Not Found',
                    value: false
                }
            }
            if (ticketData.status == 'Closed') {
                return {
                    message: 'Ticket Expired',
                    value: true,
                    errorNo: 1
                }
            }
            let drawNumber = []
            drawNumber = _.map(ticketData.ticket.secondLine, line => {
                if (line.status == 'Selected') {
                    return line.number
                }
            })

            _.remove(drawNumber, num => {
                return num === 0 || !num
            })
            if (drawNumber.length < 5) {
                return {
                    message: 'Please select Numbers',
                    value: true,
                    errorNo: 2
                }
            }
            let gameDetail = await RoomService.verifyStatus(ticketData.player, data.roomId, 'secondLine', drawNumber)
            if (gameDetail.status) {
                await Ticket.updateOne({
                    _id: data._id
                }, {
                    $push: {
                        winningGames: 'secondLine'
                    }
                })
                let amount = gameDetail.potAmount * secondLineShare / 100
                await PlayerService.addWinAmt(ticketData.player._id, amount)
                console.log("socket called", `second_line_${ticketData.roomId}`)
                io.emit(`second_line_${ticketData.roomId}`, {
                    winner: ticketData.player
                })
                return {
                    message: gameDetail.message,
                    value: true,
                    errorNo: 0
                }
            } else {
                return {
                    message: gameDetail.message,
                    value: true,
                    errorNo: 2
                }
            }

        } catch (error) {
            throw error
        }
    },
    thirdLine: async function (data) {
        let RoomService = require('../service/Room')
        try {
            let ticketData = await Ticket.findOne({
                _id: data._id
            }).populate({
                select: '',
                path: 'player'
            })
            if (!ticketData) {
                return {
                    message: 'Ticket Not Found',
                    value: false
                }
            }
            if (ticketData.status == 'Closed') {
                return {
                    message: 'Ticket Expired',
                    value: true,
                    errorNo: 1
                }
            }
            let drawNumber = []
            drawNumber = _.map(ticketData.ticket.thirdLine, line => {
                if (line.status == 'Selected') {
                    return line.number
                }
            })

            _.remove(drawNumber, num => {
                return num === 0 || !num
            })
            if (drawNumber.length < 5) {
                return {
                    message: 'Please select Numbers',
                    value: true,
                    errorNo: 2
                }
            }
            let gameDetail = await RoomService.verifyStatus(ticketData.player, data.roomId, 'thirdLine', drawNumber)
            if (gameDetail.status) {
                await Ticket.updateOne({
                    _id: data._id
                }, {
                    $push: {
                        winningGames: 'thirdLine'
                    }
                })
                let amount = gameDetail.potAmount * thirdLineShare / 100
                await PlayerService.addWinAmt(ticketData.player._id, amount)
                console.log("socket called", `third_line_${ticketData.roomId}`)
                io.emit(`third_line_${ticketData.roomId}`, {
                    winner: ticketData.player
                })
                return {
                    message: gameDetail.message,
                    value: true,
                    errorNo: 0
                }
            } else {
                return {
                    message: gameDetail.message,
                    value: true,
                    errorNo: 2
                }
            }

        } catch (error) {
            throw error
        }
    }
}