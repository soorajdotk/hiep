import React, { useState } from 'react';
import './SearchBar.css'
import { Link } from 'react-router-dom'

const SearchBar = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        fetchSuggestions(value);
    }

    const fetchSuggestions = async(value) => {
        try {
          const response = await fetch(`http://localhost:4000/api/product/products/suggestions?search=${value}`);
          if (!response.ok) {
            throw new Error('Failed to fetch suggestions');
          }
          const data = await response.json();
          setSuggestions(data) // Update the state with fetched products
        } catch (error) {
          console.error('Error fetching products:', error);
        } 
    }

    return (
        <div className="search-bar">
            <input
                type="text"
                placeholder="Search..."
                // className="search-input"
                value={searchQuery}
                onChange={handleSearchChange}
            />
            <Link to={`/search/${searchQuery}`}><button
                type="button"
                // className="search-button"
            >
                Search
            </button></Link>
            <div className={`user-suggestions-container ${searchQuery ? 'active' : ''}`}>
                <ul>
                    {suggestions.map((suggestion, index) => (
                        <li key={index}>{suggestion.name}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default SearchBar;
