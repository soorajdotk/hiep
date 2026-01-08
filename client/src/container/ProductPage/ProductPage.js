import React, { useEffect, useState } from 'react';
import './ProductPage.css'
import { useParams } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaShoppingCart } from "react-icons/fa";
import ProfileBlock from '../../components/ProfileBlock/ProfileBlock';
import { useAuthContext } from '../../hooks/useAuthContext';

const ProductPage = () => {
  const { user } = useAuthContext()
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(''); 
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [isAddedToWishlist, setIsAddedToWishlist] = useState(false);
  const[wishlistMessage, setWishlistMessage] = useState('')
  const [sizeError, setSizeError] = useState('');

    const handleAddToCart = async() => {
      if (!selectedSize) {
        setSizeError('Please select a size.'); // Set size error if size is not selected
        return; // Return early if size is not selected
      }
      try{
        const response = await fetch(`http://localhost:4000/api/cart/add-to-cart/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: user.username, quantity, size: selectedSize})
      });
      if (response.ok) {
        const data = await response.json()
        setIsAdded(true); // Update state to show the success message
        setTimeout(() => setIsAdded(false), 1000); // Hide the message after 3 seconds
        console.log(data)
      } else {
        console.error('Failed to add item to the cart');
      }
      }catch(error){
        
      console.error('Error:', error);
      }
    };

    const checkWishlist = async() =>{
      try{
        const response = await fetch(`http://localhost:4000/api/user/check-wishlist/${user.username}/${productId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (response.ok) {
        const data = await response.json()
        if (data.inWishlist === true){
          setIsAddedToWishlist(true)
        }
        else{
          setIsAddedToWishlist(false)
        }
      } else {
        console.error('Failed to add item to the cart');
      }
      }catch(error){
        console.error("Error: ", error)
      }
    }

    // Function to handle quantity change
    const handleQuantityChange = (event) => {
        setQuantity(parseInt(event.target.value));
    };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/product/${productId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }
        const data = await response.json();
        setProduct(data); // Update the state with fetched product
        setLoading(false); // Set loading to false once product is fetched
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct();
    checkWishlist();
  }, [productId]);

  if (loading) {
    return <div>Loading...</div>; // Render loading indicator while fetching product
  }

  if (!product) {
    return <div>No product found.</div>; // Handle case where product is not found
  }

    // Function to handle size selection
    const handleSizeClick = (size) => {
        setSelectedSize(size);
    };

    const handleAddToWishlist = async() => {
      try{
        const response = await fetch(`http://localhost:4000/api/user/add-to-wishlist/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: user.username})
      });
      if (response.ok) {
        const data = await response.json()
        console.log(data)
        setIsAddedToWishlist(true);
        setWishlistMessage('Item added to wishlist');
        setTimeout(() => setWishlistMessage(''), 2000);
      } else {
        console.error('Failed to add item to the cart');
      }
      }catch(error){
        
      console.error('Error:', error);
      }
    };

    const handleRemoveFromWishlist = async() =>{
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
        setIsAddedToWishlist(false)
        setWishlistMessage('Item removed from wishlist');
        setTimeout(() => setWishlistMessage(''), 2000);
      } else {
        console.error('Failed to add item to the cart');
      }
      }catch(error){
        
      console.error('Error:', error);
      }
    }
    

  return (
    <div className="products">

    <div className='product-page'>
      <div className="product-image-half">
        <div className="product-image">
            <img src={require(`../../images/${product.image}`)} alt={product.name} className="product-image" />
        </div>
      </div>
        <div className="product-details-half">
            <div className='designer-profile'>
              <ProfileBlock designer={product.designer} />
            </div>
            <div className="product-details">
                <h2>{product.name}</h2>
                <p>{product.description}</p>
            </div>
            <div className="product-price">
            <h3>₹{product.price}</h3>
            </div>
            {sizeError && <p className="error">{sizeError}</p>}
            <div className="product-size">
                <label>Select Size:</label>
                <div className="size-options">
                    {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
                        <div
                            key={size}
                            className={`size-option ${selectedSize === size ? 'selected' : ''}`}
                            onClick={() => handleSizeClick(size)}
                        >
                            {size}
                        </div>
                    ))}
                </div>
            </div>
            <div className="product-quantity">
              <h3>Quantity:</h3>
                <select value={quantity} onChange={handleQuantityChange}>
                    {[...Array(5).keys()].map((num) => (
                        <option key={num + 1} value={num + 1}>{num + 1}</option>
                    ))}
                </select>
            </div>
            
            <div className="product-btn">
              <button className='add-to-cart' onClick={handleAddToCart}><FaShoppingCart className='react-icon' size={17}/>ADD TO CART</button>
              <button className='wishlist-btn' onClick={isAddedToWishlist? handleRemoveFromWishlist : handleAddToWishlist}>
                {!isAddedToWishlist? <FaRegHeart className={`react-icons ${isAddedToWishlist ? 'filled' : ''}`} size={25} /> : <FaHeart className={`react-icons ${isAddedToWishlist ? 'filled' : ''}`} size={25} />}
                  WISHLIST
              </button>
              {isAdded && <div className="popup">Item added to cart!</div>}
              {wishlistMessage && <div className='popup'>{wishlistMessage}</div>}
            </div>
        </div>
    </div>
    {/* <div className="more">
        <h2>More From {product.designer}</h2>
    </div> */}
    </div>
  );
};

export default ProductPage;
