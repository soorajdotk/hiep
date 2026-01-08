// SearchPage.js
import React, { useEffect, useState } from 'react';
import './SearchPage.css'
import Navbar from '../../components/Navbar/Navbar';
import { Link, useParams } from 'react-router-dom';
import ProductCard from '../../components/ProductCard/ProductCard';

const SearchPage = () => {
    const [searchResults, setSearchResults] = useState([]);
    const { searchQuery } = useParams()

    useEffect(() =>{
        const handleSearchResults = async () => {
            try {
                const response = await fetch(`http://localhost:4000/api/product/search?search=${searchQuery}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                const data = await response.json();
                setSearchResults(data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        }

        handleSearchResults()
    }, [])

    return (
        <div className='search-page'>
            <Navbar/>
            <div className="product-list">
            {searchResults.map((product) => (
            <Link to={`/product/${product._id}`}>
                <ProductCard key={product._id} product={product} />
            </Link> 
            ))}
            </div>
        </div>
    );
}

export default SearchPage;
