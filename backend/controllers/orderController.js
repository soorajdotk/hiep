const Order = require('../models/orderModel')
const Cart = require('../models/cartModel')

//TRANSACTION CLASS


//CREATE ORDER
const createOrder = async(req, res) => {
    try {
        // Extract order data from request body
        const { username, orderItems, paymentId, totalAmount } = req.body;
        console.log(req.body)
        // Create a new Order instance
        const newOrder = new Order({
          username,
          orderItems,
          paymentId,
          totalAmount
        });
    
        // Save the new order to the database
        const savedOrder = await newOrder.save();

        await Cart.deleteMany({ username })
    
        // Respond with the saved order details
        res.status(201).json(savedOrder);
      } catch (error) {
        // Handle any errors
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
}

//GET ORDER
const getOrder = async(req, res) => {
  const { username } = req.params

  try{
    const orders = await Order.find({ username })
    const validOrders = await Order.find({
      username,
      'orderItems': { $exists: true, $not: { $size: 0 } }
    });
    res.status(201).json(validOrders)
  } catch (error) {
    // Handle any errors
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  } 
}

module.exports ={
    createOrder,
    getOrder
}