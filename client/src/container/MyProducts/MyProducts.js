import React, { useEffect, useState } from 'react';
import './MyProducts.css'; // Import CSS file
import { useAuthContext } from '../../hooks/useAuthContext';
import { MdModeEdit } from "react-icons/md";
import { Link } from 'react-router-dom'

const MyProducts = () => {
  const { user } = useAuthContext();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyProducts = async () => {
      try {
        // Make a request to fetch products posted by the current designer (user)
        const response = await fetch(`http://localhost:4000/api/product/my-products/${user.username}`);
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchMyProducts();
  }, [user.id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="my-products-page">
      <h1>My Products</h1>
      <div className="my-product-list">
        {products.map((product) => (
          <div key={product._id} className="my-product">
            {/* <div className='my-product-edit'>
                <MdModeEdit className='edit-btn'/>
            </div> */}
            <img src={require(`../../images/${product.image}`)} alt={product.name} className="my-product-image" />
            <div className="my-product-details">
                <h2>{product.name}</h2>
                <p>{product.description}</p>
                <h3>Price: ₹{product.price}</h3>
                {/* <h5>Orders: {product.orders}</h5> */}
                <h5>Quantity: {product.quantity}</h5>
            </div>
        </div>
        ))}
      </div>
      <div className='new-product'>
        <Link to="/add-product" className="add-product-link">Add New Product</Link>
      </div>
    </div>
  );
};

export default MyProducts;
