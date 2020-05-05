const Router = require('express').Router()
const Room = require('../service/Room')

Router.get('/', (req, res) => {
    res.send('Test')
})
Router.post('/createRoom', async (req, res) => {
    try {
        let roomData = await Room.createRoom(req.body);
        if (roomData.status) {
            res.status(200).send(roomData.data)
        } else {
            res.status(404).send(roomData.data)
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
Router.post('/startGame', async (req, res) => {
    try {
        let roomData = await Room.startGame(req.body);
        if (roomData.value) {
            res.status(200).send({
                message: roomData.data
            })
        } else {
            res.status(404).send({
                message: roomData.data
            })
        }
    } catch (error) {
        res.status(500).send(error)
    }
})

Router.get('/getRoom/:id', async (req, res, next) => {
    try {
        let room = await Room.getRoom({
            roomId: req.params.id
        })
        if (room) {
            res.status(200).send(room)
        } else {
            res.status(404).send({
                message: "Room not found"
            })
        }
    } catch (error) {
        res.status(500).send(error)
    }
})

module.exports = Router