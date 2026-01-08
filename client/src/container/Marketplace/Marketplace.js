import React, { useEffect, useState } from 'react'
import './Marketplace.css'
import Navbar from '../../components/Navbar/Navbar'
import Products from '../../components/Products/Products'


const Marketplace = () => {
  return (
    <div className="marketplace-container">
      <Navbar/>
      <Products/>
    </div>
  )
}

export default Marketplace
