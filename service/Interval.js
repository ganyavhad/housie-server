const _ = require('lodash')
module.exports = {
    set: async function (id) {
        const RoomService = require('../service/Room')
        try {
            let drawNumbers = {}
            let interval = {}
            drawNumbers[id] = []
            for (i = 1; i <= 90; i++) {
                drawNumbers[id].push(i);
            }
            drawNumbers[id] = _.shuffle(_.shuffle(_.shuffle(drawNumbers[id])));
            interval[id] = setInterval(async () => {
                if (!_.isEmpty(drawNumbers[id])) {
                    _.shuffle(_.shuffle(_.shuffle(drawNumbers[id])));
                    let num = drawNumbers[id].pop();
                    let updatedRoom = await RoomService.addDraw({
                        roomId: id,
                        number: num
                    })
                    if (updatedRoom && updatedRoom.nModified >= 1) {
                        io.emit(`draw_${id}`, num);
                    } else {
                        this.clear(interval[id])
                    }
                } else {
                    this.clear(interval[id])
                }
            }, 5 * 1000)
        } catch (error) {
            throw error;
        }
    },
    clear: function (intervalId) {
        clearTimeout(intervalId)
    }
}