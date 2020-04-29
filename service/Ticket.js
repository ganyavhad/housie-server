const Ticket = require('../model/TicketModel');
const _ = require('lodash')
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
            let end = 10;
            for (i = 0; i < 9; i++) {
                let shuffleArr = _.shuffle(
                    _.shuffle(_.shuffle(_.slice(numberArr, start, end)))
                );
                start = start + 10;
                end = end + 10;
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

    }
}