import React, { useState, useEffect } from 'react';
import './CheckOut.css';
import { useAuthContext } from '../../hooks/useAuthContext';

const loadScript = src => new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => {
      console.log('razorpay loaded successfully');
      resolve(true);
    };
    script.onerror = () => {
      console.log('error in loading razorpay');
      resolve(false);
    };
    document.body.appendChild(script);
  });

const CheckOut = () => {
  const { user } = useAuthContext();
  const [shippingDetails, setShippingDetails] = useState({});
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState({})
  const[orderItems, setOrderItems] = useState([])

  const price = cartItems
  .map((item, index) => (products[index] && products[index].price) * item.quantity) // Calculate subtotal for each item
  .filter(price => typeof price === 'number') // Filter out any null or non-numeric prices
  .reduce((total, price) => total + price, 0) // Sum up the prices


  useEffect(() => {
    // Fetch user's shipping details
    const fetchShippingDetails = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/account/get-account/${user.username}`);
        if (response.ok) {
          const data = await response.json();
          setShippingDetails(data);
        } else {
          console.error('Failed to fetch shipping details');
        }
      } catch (error) {
        console.error('Error fetching shipping details:', error);
      }
    };

    fetchShippingDetails();

    // Fetch user's cart items
    const fetchCartItems = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/cart/view-cart/${user.username}`);
        if (response.ok) {
          const data = await response.json();
          setCartItems(data.cart);
          const productsArray = await Promise.all(data.cart.map(item => fetchProduct(item.productId)));
            setProducts(productsArray);
        } else {
          console.error('Failed to fetch cart items');
        }
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };

    fetchCartItems();
  }, [user]);

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

  const displayRazorpay = async (options) => {
    try {
        // Load Razorpay script
        const scriptLoaded = await loadScript('https://checkout.razorpay.com/v1/checkout.js');

        // If script loaded successfully
        if (scriptLoaded) {
            // Create new Razorpay instance with provided options
            const razorpay = new window.Razorpay(options);

            // Open the payment modal
            razorpay.open();
        } else {
            throw new Error('Failed to load Razorpay script');
        }
    } catch (error) {
        console.error('Error:', error);
        // Handle error
    }
}

const checkoutHandler = async (amount) => {
    try {
      const orderItemsArray = cartItems.map((item, index) => {
        return {
          productId: products[index]._id,
          name: products[index].name,
          price: products[index].price * item.quantity,
          quantity: item.quantity,
          // Add other properties as needed
        };
      });

      // Set orderItems state
      const orderItemsData = orderItemsArray
      setOrderItems(orderItemsData);
      console.log("Items Array",orderItemsArray)
      console.log("Items Data",orderItemsData)
      console.log(orderItems)
        const getKeyResponse = await fetch("http://localhost:4000/api/getkey");
        if (!getKeyResponse.ok) {
            throw new Error('Failed to fetch key');
        }
        const { key } = await getKeyResponse.json();

        const checkoutResponse = await fetch("http://localhost:4000/api/payment/checkout", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ amount }),
        });
        if (!checkoutResponse.ok) {
            throw new Error('Failed to initiate checkout');
        }
        const order = await checkoutResponse.json();
        console.log("order:", order)
        console.log("Key", key)

        const options = {
            key,
            amount: order.amount,
            currency: "INR",
            name: "Hiep",
            description: "Final Year Project",
            image: "../../assets/logo.png",
            order_id: order.id,
            callback_url: "http://localhost:4000/api/payment/paymentverification",
            prefill: {
                name: "Hiep ",
                email: "hiep@example.com",
                contact: "9999999999"
            },
            notes: {
                "address": "Razorpay Corporate Office"
            },
            theme: {
                "color": "#121212"
            },
        };
        displayRazorpay(options)
        confirmOrder()
    } catch (error) {
        console.error('Error:', error);
        // Handle error
    }
};

const confirmOrder = async() => {
  try{
    const response = await fetch("http://localhost:4000/api/order/create-order",{
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: user.username, orderItems, paymentId:"jknkdsjs", totalAmount: price})
    })

    if (!response.ok) {
      throw new Error('Failed to initiate checkout');
    }
    const order = await response.json();
    console.log("order:", order)
  }catch(error){
    console.error("Error: ", error)
  }
  
}

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>
      <div className="shipping-details">
        <h2>Shipping Details</h2>
        <p>Name: {shippingDetails.name}</p>
        <p>Address: {shippingDetails.address}</p>
        <p>City: {shippingDetails.city}</p>
        <p>State: {shippingDetails.state}</p>
        <p>Pincode: {shippingDetails.pincode}</p>
        {/* Display other shipping details */}
      </div>
      <div className="order-details">
        <h2>Order Details</h2>
        <ul>
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
                                <p>Quantity: {item.quantity}</p>
                                
                            </div>
                            <div className='cart-product-size'>
                                <p>Size : {item.size}</p>
                            </div>
                        </div>
                    </>
                )}
            </div>
        ))}
        </ul>
      </div>    
      <div className="cart-summary">
                <h2>Cart Summary</h2>
                <p>Total Items: {cartItems.length}</p>
                <p>Total Price: ₹{price}</p>
        </div>  
      <button onClick={() => checkoutHandler(price)}>Confirm Order</button>
    </div>
  );
};

export default CheckOut;