const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    username: {
    type: String,
    ref: 'User',
    required: true
  },
  orderDate: {
    type: Date,
    default: Date.now
  },
  orderItems: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name:{
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    price: {
      type: Number,
      required: true
    }
  }],
    paymentId: {
      type: String,
      required: true
    // Add more payment-related fields as needed
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered'],
    default: 'pending'
  },
  totalAmount: {
    type: Number,
    required: true
  },
  // Additional metadata fields
}, {
  timestamps: true 
})

module.exports = mongoose.model('Order', orderSchema)