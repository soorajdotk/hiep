import React, { useEffect, useState } from 'react';
import ProductCard from '../ProductCard/ProductCard';
import './Products.css'

const Products = () => {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/product/products');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      console.log(data)
      setProducts(data) // Update the state with fetched products
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };


  useEffect(() => {

    fetchProducts();
  }, []);


  return (
    <div className="products-container">
      <h2>Products</h2>
      <div className="product-list">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Products;
