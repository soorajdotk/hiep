const express = require('express')

const router = express.Router()

const {
    addToCart,
    removeFromCart,
    viewCart
} = require('../controllers/cartController')


router.put('/add-to-cart/:productId', addToCart)
router.put('/remove-from-cart/:productId', removeFromCart)
router.get('/view-cart/:username', viewCart)

module.exports = router