const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true
  },
  designer: {
    type: String,
    ref: 'User', // Reference to the User model
    required: true
  }, 
  image : {
    type: String,
    required: true
  },
  orders: {
    type: Number,
    default: 0
  },
  quantity:{
    type:Number,
    required: true
  }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
