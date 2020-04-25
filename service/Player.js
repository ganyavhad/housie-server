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

    }
}