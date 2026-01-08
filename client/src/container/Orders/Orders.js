import React, { useEffect, useState } from 'react';
import './Orders.css'; // Import CSS file
import { useAuthContext } from '../../hooks/useAuthContext';
import OrderItem from '../../components/OrderItem/OrderItem'; // Import OrderItem component

const Orders = () => {
  const { user } = useAuthContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserOrders = async () => {
    try {
      // Fetch user orders from the backend
      const response = await fetch(`http://localhost:4000/api/order/get-orders/${user.username}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user orders');
      }
      const data = await response.json();
      const orderData = data
      setOrders(orderData);
        setLoading(false);
    } catch (error) {
      console.error('Error fetching user orders:', error);
    }
  };


  useEffect(() => {
    fetchUserOrders();
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="orders-container">
      <h2>My Orders</h2>
      <div className="order-list">
        {orders.map((order) => (
          <OrderItem key={order._id} order={order} />
        ))}
      </div>
    </div>
  );
};

export default Orders;
