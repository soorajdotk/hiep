import React from 'react';
import './OrderItem.css'; // Import CSS file
import { Link } from 'react-router-dom'

const OrderItem = ({ order }) => {
  const { _id, orderDate, orderItems, totalAmount, orderStatus } = order;

  return (
    <div className="order-item">
      <div className="order-header">
        <h3>Order ID: {_id}</h3>
        <p>Date: {orderDate}</p>
        <p>Status: {orderStatus}</p>
      </div>
      <div className="order-items">
        <h4>Order Items:</h4>
        <ul>
          {orderItems.map((item) => (
            <li key={item.productId}>
              <div className="order-item-details">
                <Link to={`/product/${item.productId}`}><p>{item.name}</p></Link>
                <p>Quantity: {item.quantity}</p>
                <p>Price: ₹{item.price}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="order-summary">
        <p>Total Amount: ₹{totalAmount}</p>
      </div>
    </div>
  );
};

export default OrderItem;
