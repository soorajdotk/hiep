const express = require('express')

const router = express.Router()

const {
    getAccountDetails, 
    updateAccountDetails,

} = require('../controllers/accountController')

router.get('/get-account/:username', getAccountDetails)
router.post('/update-account', updateAccountDetails)

module.exports = router