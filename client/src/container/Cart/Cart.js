import React, { useEffect, useState } from 'react';
import './Cart.css'; // Import CSS file
import { FaTrash } from 'react-icons/fa';
import { useAuthContext } from '../../hooks/useAuthContext';
import { Link } from 'react-router-dom'

const Cart = () => {
    const { user } = useAuthContext()
    const [cartItems, setCartItems] = useState([]);
    const [products, setProducts] = useState({})
    const[quantity, setQuantity] = useState(1)
    const username = user.username

    useEffect(() => {
        fetchCartItems()
    },[user.username])

    const fetchCartItems = async () => {
        console.log(username)
        if(!user){
            console.log("User not logged in")
            return
        }
        try {
            // Make a request to fetch cart items for the current user
            const response = await fetch(`http://localhost:4000/api/cart/view-cart/${username}`);
            if (!response.ok) {
                throw new Error('Failed to fetch cart items');
            }
            const data = await response.json();
            console.log(data)
            setCartItems(data.cart); // Update cart items state\

            const productsArray = await Promise.all(data.cart.map(item => fetchProduct(item.productId)));
            setProducts(productsArray);
        } catch (error) {
            console.error(error);
        }
    }

    const fetchProduct = async (productId) => {
        try {
          const response = await fetch(`http://localhost:4000/api/product/${productId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch product');
          }
          const data = await response.json();
          return data;
        } catch (error) {
          console.error('Error fetching product:', error);
          return null
        }
      };

    // Function to update quantity
    const handleQuantityChange = (event) => {
        setQuantity(parseInt(event.target.value));
    };

    // Function to remove item from cart
    const handleRemoveItem = async(productId) => {
        try{
            const response = await fetch(`http://localhost:4000/api/cart/remove-from-cart/${productId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: user.username})
          });
          if (response.ok) {
            const data = await response.json()
            console.log(data)
            fetchCartItems()
          } else {
            console.error('Failed to add item to the cart');
          }
          }catch(error){
            
          console.error('Error:', error);
          }
    };

    return (
        <div className="cart-page">
            <h1>Shopping Cart</h1>
            <div className="cart-items">
                {cartItems.map((item, index) => (
                    <div key={item._id} className="cart-item">
                        {products[index] && (
                            <>
                                <img src={require(`../../images/${products[index].image}`)} alt={products[index].name} className="cart-product-image" />
                                <div className="cart-product-details">
                                    <h2>{products[index].name}</h2>
                                    <p>{products[index].description}</p>
                                    <h3>Price: ₹{products[index].price}</h3>
                                    <div className="product-quantity">
                                        <label>Quantity:</label>
                                        <select value={item.quantity} onChange={handleQuantityChange}>
                                            {[...Array(5).keys()].map((num) => (
                                                <option key={num + 1} value={num + 1}>{num + 1}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className='cart-product-size'>
                                        
                                    </div>
                                    <button className="remove-button" onClick={() => handleRemoveItem(products[index]._id)}>
                                        <FaTrash className="trash-icon" />
                                        Remove
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
            <div className="cart-summary">
                <h2>Cart Summary</h2>
                <p>Total Items: {cartItems.length}</p>
                <p>Total Price: ₹{
                cartItems
                    .map((item, index) => (products[index] && products[index].price) * item.quantity) // Calculate subtotal for each item
                    .filter(price => typeof price === 'number') // Filter out any null or non-numeric prices
                    .reduce((total, price) => total + price, 0) // Sum up the prices
                }</p>
                <Link to='/checkout'><button className="checkout-button">Proceed to Checkout</button></Link>
            </div>
        </div>
    );
};

export default Cart;
