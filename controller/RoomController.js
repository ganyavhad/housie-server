const Router = require('express').Router()

Router.get('/', (req, res) => {
    res.send('Test')
})

module.exports = Router