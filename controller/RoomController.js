const Router = require('express').Router()
const Room = require('../service/Room')
Router.get('/', (req, res) => {
    res.send('Test')
})
Router.post('/createRoom', async (req, res) => {
    try {
        let roomData = await Room.createRoom(req.body);
        if (roomData) {
            res.status(200).send(roomData)
        } else {
            res.status(404).send('Room Not Found')
        }
    } catch (err) {
        res.status(500).send(err)
    }
})

Router.post('/joinRoom', async (req, res) => {
    try {
        let roomData = await Room.joinRoom(req.body);
        if (roomData.status) {
            res.status(200).send(roomData.data)
        } else {
            res.status(404).send(roomData.data)
        }
    } catch (error) {
        res.status(500).send(error)
    }
})

module.exports = Router