const express = require('express')

const router = express.Router()

const {
    getMessage,
    getLastMessage
} = require('../controllers/messageController')

router.get('/get-message/:sender/:recipient', getMessage)
router.get('/last-message/:sender/:recipient', getLastMessage)

module.exports = router