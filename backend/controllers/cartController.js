const Cart = require('../models/cartModel')
const Product = require('../models/productModel')
const User = require('../models/userModel')

//CART CLASS

//ADD TO CART
const addToCart = async(req, res) => {
    const { productId } = req.params
    const { username, quantity, size } = req.body
    try{
        const cart = await Cart.findOneAndUpdate(
            { username },
            { $push: { products: { productId, quantity, size } } },
            { upsert: true, new: true }
        );
        res.json({ message: "Item added to cart", cart})
    }catch(error){
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

//REMOVE FROM CART
const removeFromCart = async(req, res) =>{
    
    const { productId } = req.params
    const { username } = req.body
    try{
        const cart = await Cart.findOneAndUpdate({ username }, { $pull: { products: {productId} } })
        res.json({ message: "Item removed from cart", cart})
    }catch(error){
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// VIEW CART
const viewCart = async(req, res) =>{
    const { username } = req.params
    try{
        const cart = await Cart.findOne({username})

        const productIds = cart.products.map(product => product.productId); // Get array of product IDs
        
        const cartItems = await Product.find({ '_id': { $in: productIds } })
        .sort({ createdAt: -1 })

        res.json({ cart: cart.products });
    }catch(error){
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = {
    addToCart,
    removeFromCart,
    viewCart
}