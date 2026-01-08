const mongoose = require('mongoose')

const Schema = mongoose.Schema

const postSchema = new Schema({
    image:{
        type: String,
        required: true
    },
    caption:{
        type: String
    },
    author:{
        type: String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    likes:[{
        type: String,
    }],
    tags:{
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }
})

module.exports = mongoose.model('Post', postSchema)