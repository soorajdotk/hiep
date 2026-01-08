const express = require('express')

const router = express.Router()

const { 
    createOrder,
    getOrder
 } = require('../controllers/orderController')


router.post('/create-order', createOrder)
router.get('/get-orders/:username', getOrder)

module.exports = router