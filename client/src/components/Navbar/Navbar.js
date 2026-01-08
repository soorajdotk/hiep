import React, { useEffect, useState } from 'react'
import './Navbar.css'
import { useAuthContext } from '../../hooks/useAuthContext'
import { Link} from 'react-router-dom'
import SearchBar from '../SearchBar/SearchBar'
import Products from '../Products/Products'

const Navbar = () => {
  const { user } = useAuthContext()
  const [isDesigner, setIsDesigner] = useState(false);
  const [searchResults, setSearchResults] = useState([])

  useEffect(() => {
    // Check if the user is a designer
    const checkUserRole = () => {
      // Assuming the user object has a role property indicating the user's role
      setIsDesigner(user.role === 'designer');
    };

    checkUserRole();
  }, [user]);

  return (
    <div className="top-bar">
        <div className="logo-container">
        <img src="/path/to/hiep_marketplace_logo.png" alt="Hiep Marketplace Logo" className="logo" />
        </div>
        <SearchBar/>
        <div className="navigation-options">
        {isDesigner && <Link to="/products">Products</Link>}
        <Link to="/orders">Orders</Link>
        <Link to="/wishlist">Wishlist</Link>
        <Link to="/cart">Cart</Link>
        <Link to="/account">Account</Link>
        {/* Add more navigation options as needed */}
        </div>
    </div>
  )
}

export default Navbar
