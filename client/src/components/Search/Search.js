  import React, { useState } from 'react';
  import './Search.css'
  import { Link } from 'react-router-dom'

  const Search= () => {
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        fetchSuggestions(value);
    }

    const fetchSuggestions = async(value) => {
        try {
          const response = await fetch(`http://localhost:4000/api/user/users/suggestions?search=${value}`);
          if (!response.ok) {
            throw new Error('Failed to fetch suggestions');
          }
          const data = await response.json();
          const suggestionsData = data
          setSuggestions(suggestionsData) 
          if(suggestions.length<0){
            setError('User not found');
          }else{
            setError(null)
          }
        } catch (error) {
          console.error('Error fetching products:', error);
        } 
    }

    return (
      <div className="user-search-container">
        <h1>User Search</h1>
        <div className="search-container">
          <input
            type="text"
            placeholder="Enter username"
            className='user-search-input'
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <button>Search</button> 
          <div className={`user-suggestions-container ${searchQuery ? 'active' : ''}`}>
                <ul>
                    {suggestions.map((suggestion, index) => (
                      <li key={index}>
                        <div className="user-details">
                          <Link to={`/${suggestion.username}`}>
                          <img src={require(`../../images/${suggestion.profilePicture}`)} alt={suggestion.username} />
                            <p>{suggestion.username}</p>
                            <span>{suggestion.fullName}</span>
                          </Link>
                        </div>
                      </li>
                    ))}
                </ul> 
        </div>
        </div>
        
        {error && <p className="error">{error}</p>}
        
        
      </div>
    );
  };

  export default Search;
