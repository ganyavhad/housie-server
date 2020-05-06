const Player = require('../model/PlayerModel');

module.exports = {
    guestLogin: async function (data) {
        try {
            let lastGuestUser = await Player.findOne({
                type: 'Guest'
            }, {
                id: 1
            }).sort({
                _id: -1
            })
            let guest = {}
            if (lastGuestUser) {
                guest.id = lastGuestUser.id + 1
                guest.name = 'Guest_' + guest.id
            } else {
                guest.id = 1
                guest.name = 'Guest' + 1
            }
            guest.type = 'Guest'
            let player = new Player(guest)
            return await player.save()
        } catch (error) {
            throw error
        }

    },
    facebookLogin: async function (data) {
        try {
            let member = await Player.findOne({
                type: 'Member',
                id: data.id
            })
            if (member) {
                return member
            }
            data.type = 'Member'
            let player = new Player(data)
            return await player.save()
        } catch (error) {
            throw error
        }
    },
    collectCoins: async function (players, amount) {
        try {
            await Player.updateMany({
                _id: {
                    $in: players
                }
            }, {
                $inc: {
                    balance: -amount
                }
            })
            let players = await find({
                _id: {
                    $in: players
                }
            }, {
                balance: 1
            })
            players.forEach(player => {
                io.emit(`balance_${player._id}`, {
                    balance: player.balance
                })
            })
            return
        } catch (error) {
            throw error
        }
    },
    addWinAmt: async function (player, amount) {
        try {
            return Player.updateMany({
                _id: player
            }, {
                $inc: {
                    balance: amount
                }
            })
        } catch (error) {
            throw error
        }
    },
    getPlayerDetail: async function (data) {
        try {
            return await Player.findOne({
                _id: data._id
            })
        } catch (error) {
            throw error
        }
    }
}