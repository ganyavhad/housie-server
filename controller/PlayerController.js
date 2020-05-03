const Router = require('express').Router()
const Player = require('../service/Player')
Router.get('/', (req, res) => {
    res.send('Test')
})

Router.post('/guestLogin', async (req, res, next) => {
    try {
        let playerData = await Player.guestLogin(req.body);
        if (playerData) {
            res.status(200).send(playerData)
        } else {
            res.status(404).send('Player Not Found')
        }
    } catch (err) {
        res.status(500).send(err)
    }
})
Router.post('/facebookLogin', async (req, res, next) => {
    try {
        let playerData = await Player.facebookLogin(req.body);
        if (playerData) {
            res.status(200).send(playerData)
        } else {
            res.status(404).send('Player Not Found')
        }
    } catch (err) {
        res.status(500).send(err)
    }
})

module.exports = Router