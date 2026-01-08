const mongoose = require('mongoose')

const Schema = mongoose.Schema

const cartSchema = new Schema({
    username: {
        type: String,
        ref: 'User', // Reference to the User model
        required: true
    },
    products: [{
        productId: {
            type: Schema.Types.ObjectId,
            ref: 'Product', // Reference to the Product model
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        size: {
            type: String,
            required: true
        }
    }]
})


const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
