import React from 'react';
import './ProductCard.css'; // Import the CSS file for styling
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <Link to={`/product/${product._id}`} className="product-card-link">
    <div className="product-card">
      <img src={require(`../../images/${product.image}`)} alt={product.name} className="product-image" />
      <div className="product-details">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">₹{product.price}</p>
      </div>
    </div>
    </Link>
  );
};

export default ProductCard;
