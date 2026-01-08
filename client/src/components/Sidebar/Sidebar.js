import React, { useState } from 'react';
import './Sidebar.css'; // Import your CSS for Sidebar styling
import { Link } from 'react-router-dom';
import Logo from '../../assets/logo.png'
import { IoHome, IoHomeOutline, IoSearchCircle, IoSearchCircleOutline } from "react-icons/io5";
import { CgLogOut, CgPerformance, CgProfile } from "react-icons/cg";
import { MdOutlineUpload, MdUpload } from "react-icons/md";
import { TbMessage2, TbMessageCircle2 } from "react-icons/tb";
import { useLogout } from '../../hooks/useLogout';
import { RiStore3Line } from "react-icons/ri";
import Search from '../Search/Search';
import { useAuthContext } from '../../hooks/useAuthContext';


const Sidebar = () => {
  const { user } = useAuthContext()
  const { logout } = useLogout()
  const [active, setActive] = useState('home')

  const handleActive = (link) => {
    setActive(link)
  }

  const handleLogoutClick = () =>{
    logout()
  }

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img src={Logo} alt='Hiep Logo' className='logo-container-logo'/>
      </div>
      <div className="sidebar-content">
        <Link to='/home'  onClick={() => handleActive('home')}>
            <button className='sidebar-content-btn'>{active === 'home' ? <IoHome size='25px'/>: <IoHomeOutline size='25px'/>}<span>Home</span></button>
        </Link>
        <Link to='/search-page'>
            <button className='sidebar-content-btn'  onClick={() => handleActive('search')}>{active === 'search' ?<IoSearchCircle size='25px'/>: <IoSearchCircleOutline size='25px'/>}<span>Search</span></button>
        </Link>
        <Link to='/messages'>
            <button className='sidebar-content-btn' onClick={() => handleActive('messages')}>{active === 'messages' ? <TbMessage2 size='25px'/> : <TbMessageCircle2 size='25px'/>}<span>Messages</span></button>
        </Link>
        <Link to='/upload'>
            <button className='sidebar-content-btn' onClick={() => handleActive('upload')}>{active === 'upload' ? <MdUpload size='25px'/>:<MdOutlineUpload size='25px'/>}<span>Upload</span></button>
        </Link>
        <Link to={`/${user && user.username}`}>
            <button className='sidebar-content-btn' onClick={() => handleActive('profile')}>{active === 'profile' ? <CgPerformance size='25px'/>: <CgProfile size='25px'/>}<span>Profile</span></button>
        </Link>
        <Link to='/marketplace'>
            <button className='sidebar-content-btn' onClick={() => handleActive('marketplace')}><RiStore3Line size='25px'/><span>Marketplace</span></button>
        </Link>
        <Link>
            <button className='sidebar-content-btn logout' onClick={handleLogoutClick}><CgLogOut size='25px'/><span>Logout</span></button>
        </Link>
      </div>
      {/* Search Overlay */}
      {active === "search" && (
        <div className="search-overlay">
          <Search/>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
