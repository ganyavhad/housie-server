const Router = require('express').Router()
const Ticket = require('../service/Ticket')
Router.post('/getTicket', async (req, res, next) => {
    try {
        let ticket = await Ticket.getTicket(req.body)
        if (ticket) {
            res.status(200).send(ticket)
        } else {
            res.status(404).send({
                message: "Ticket not found"
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})
Router.post('/selectNumber', async (req, res, next) => {
    try {
        let ticket = await Ticket.selectNumber(req.body)
        if (ticket.value) {
            res.status(200).send(ticket)
        } else {
            res.status(404).send({
                message: "Ticket not found"
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})
Router.post('/fullHousie', async (req, res, next) => {
    try {
        let ticket = await Ticket.fullHousie(req.body)
        if (ticket.value) {
            res.status(200).send(ticket)
        } else {
            res.status(404).send({
                message: "Ticket not found"
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})
Router.post('/juldiFive', async (req, res, next) => {
    try {
        let ticket = await Ticket.juldiFive(req.body)
        if (ticket.value) {
            res.status(200).send(ticket)
        } else {
            res.status(404).send({
                message: "Ticket not found"
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})
Router.post('/firstLine', async (req, res, next) => {
    try {
        let ticket = await Ticket.firstLine(req.body)
        if (ticket.value) {
            res.status(200).send(ticket)
        } else {
            res.status(404).send({
                message: "Ticket not found"
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})
Router.post('/secondLine', async (req, res, next) => {
    try {
        let ticket = await Ticket.secondLine(req.body)
        if (ticket.value) {
            res.status(200).send(ticket)
        } else {
            res.status(404).send({
                message: "Ticket not found"
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})

Router.post('/thirdLine', async (req, res, next) => {
    try {
        let ticket = await Ticket.thirdLine(req.body)
        if (ticket.value) {
            res.status(200).send(ticket)
        } else {
            res.status(404).send({
                message: "Ticket not found"
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})

module.exports = Router