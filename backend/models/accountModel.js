const mongoose = require('mongoose')

const Schema = mongoose.Schema

const accountSchema = new Schema({
    username:{
        type: String,
        ref: 'User'
    },
    name:{
        type: String,
        default: ""
    },
    address:{
        type: String,
        default: ""
    },
    city:{
        type: String,
        default: ""
    },
    state:{
        type: String,
        default: ""
    },
    pincode:{
        type: String,
        default:""
    },
    AccountHolderName:{
        type: String,
        default: ''
    },
    AccountNumber:{
        type: String,
        default: ''
    },
    IFSC: {
        type: String,
        default: ''
    },
    BankName: {
        type: String,
        default: ''
    },
    UPI:{
        type: String,
        default: ''
    }
})

module.exports = mongoose.model('Account', accountSchema)