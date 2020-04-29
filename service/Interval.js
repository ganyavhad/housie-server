const _ = require('lodash')
module.exports = {
    set: async function (id) {
        const RoomService = require('../service/Room')
        console.log(RoomService)

        try {
            let drawNumbers = {}
            let interval = {}
            drawNumbers[id] = []
            for (i = 1; i <= 90; i++) {
                drawNumbers[id].push(i);
            }
            drawNumbers[id] = _.shuffle(_.shuffle(_.shuffle(drawNumbers[id])));
            interval[id] = setInterval(async () => {
                console.log('interval called', id)
                if (!_.isEmpty(drawNumbers[id])) {
                    _.shuffle(_.shuffle(_.shuffle(drawNumbers[id])));
                    let num = drawNumbers[id].pop();
                    let updatedRoom = await RoomService.addDraw({
                        roomId: id,
                        number: num
                    })
                    console.log(updatedRoom)
                    if (updatedRoom && updatedRoom.nModified >= 1) {
                        io.emit(`draw_${id}`, num);
                        console.log(num, drawNumbers[id].length)
                    } else {
                        this.clear(interval[id])
                    }
                } else {
                    this.clear(interval[id])
                }
            }, 10 * 1000)
        } catch (error) {
            throw error;
        }
    },
    clear: function (intervalId) {
        clearTimeout(intervalId)
    }
}