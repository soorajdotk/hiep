import React, { useEffect, useState } from 'react';
import './Wishlist.css'; // Import CSS file
import { FaTrash, FaCartPlus } from 'react-icons/fa'; // Import icons
import { useAuthContext } from '../../hooks/useAuthContext';

const Wishlist = ({ addToCart }) => {
    const { user } = useAuthContext()
    const username = user.username
    const [wishlistItems, setWishlistItems] = useState([])
    useEffect(() =>{
        fetchWishlistItems()
    }, [user.username])

    const fetchWishlistItems = async () => {
        console.log(username)
        if(!user){
            console.log("User not logged in")
            return
        }
        try {
            // Make a request to fetch cart items for the current user
            const response = await fetch(`http://localhost:4000/api/user/view-wishlist/${username}`);
            if (!response.ok) {
                throw new Error('Failed to fetch cart items');
            }
            const data = await response.json();
            console.log(data)
            setWishlistItems(data.wishlist); // Update cart items state\

        } catch (error) {
            console.error(error);
        }
    }

    const removeFromWishlist = async(productId) =>{
        try{
          const response = await fetch(`http://localhost:4000/api/user/remove-from-wishlist/${productId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username: user.username})
        });
        if (response.ok) {
          const data = await response.json()
          console.log("Item removed from wishlist",data)
        } else {
          console.error('Failed to add item to the cart');
        }
        }catch(error){
          
        console.error('Error:', error);
        }
      }

    return (
        <div className="wishlist-page">
            <h1>My Wishlist</h1>
            {wishlistItems.length > 0 ? (
                <div className="wishlist-items">
                    {wishlistItems.map(item => (
                        <div key={item.id} className="wishlist-item">
                            <img src={require(`../../images/${item.image}`)} alt={item.name} className="wishlist-product-image" />
                            <div className="wishlist-product-details">
                                <h2>{item.name}</h2>
                                <p>Price: ₹{item.price}</p>
                                <div className="wishlist-actions">
                                    <button className="add-to-cart-button" onClick={() => addToCart(item._id)}>
                                        <FaCartPlus className="cart-icon" />
                                        Add to Cart
                                    </button>
                                    <button className="remove-button" onClick={() => removeFromWishlist(item._id)}>
                                        <FaTrash className="trash-icon" />
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>Your wishlist is empty.</p>
            )}
        </div>
    );
};

export default Wishlist;
