import React from 'react'
import './App.css'
import Login from './container/Forms/Login'
import {Routes, Route, Navigate, useLocation} from 'react-router-dom'
import AuthLayout from './container/AuthLayout/AuthLayout'
import Signup from './container/Forms/Signup'
import Home from './container/Home/Home'
import { useAuthContext } from './hooks/useAuthContext'
import Upload from './container/Upload/Upload'
import Sidebar from './components/Sidebar/Sidebar'
import Profile from './container/Profile/Profile'
import Search from './components/Search/Search'
import Marketplace from './container/Marketplace/Marketplace'
import ProductForm from './components/ProductForm/ProductForm'
import ProductPage from './container/ProductPage/ProductPage'
import Navbar from './components/Navbar/Navbar'
import Cart from './container/Cart/Cart'
import Wishlist from './container/Wishlist/Wishlist'
import MyProducts from './container/MyProducts/MyProducts'
import SearchPage from './container/SearchPage/SearchPage'
import AccountPage from './container/AccountPage/AccountPage'
import PaymentSuccess from './components/Payment/PaymentSuccess'
import CheckOut from './container/CheckOut/CheckOut'
import Orders from './container/Orders/Orders'
import MessagesPage from './container/MessagesPage/MessagesPage'
import PortfolioPage from './components/PortfolioPage/PortfolioPage'
// import Message from './components/Message/Message'

const App = () => {
  const {user} = useAuthContext()

  const  { pathname } = useLocation()

  const noSideBar = ['/login', '/signup']
  const showSideBar = !noSideBar.includes(pathname)


  return (
    <main className='main'>
      {showSideBar && <Sidebar className='sidebar'/>}
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={!user ? <Login /> : <Navigate to='/home' />} />
          <Route path="/signup" element={!user ? <Signup /> : <Navigate to='/home' />} />
        </Route>
          <Route path='/products' element={user? <MyProducts/> : <Navigate to='/login' />} />
          <Route path='/orders' element={user? <Orders/> : <Navigate to='/login' />} />
          <Route path="/paymentsuccess" element={user? <PaymentSuccess /> : <Navigate to='/login' />} />
          <Route path='/checkout' element={user? <CheckOut/> : <Navigate to='/login' />} />
          <Route path='/account' element={user? <AccountPage/> : <Navigate to='/login' />} />
          <Route path='/add-product' element={user? <ProductForm/> : <Navigate to='/login' />} />
          <Route path='/product/:productId' element={user? <ProductPage/> : <Navigate to='/login' />} />
          <Route path='/add-products' element={user? <ProductForm/> : <Navigate to='/login' />} />
          <Route path='/search/:searchQuery' element={user? <SearchPage/> : <Navigate to='/login' />} />
          <Route path='/cart' element={user? <Cart/> : <Navigate to='/login' />} />
          <Route path='/wishlist' element={user? <Wishlist/> : <Navigate to='/login' />} />
          <Route path='/messages' element={user? <MessagesPage/> : <Navigate to='/login' />} />
          <Route path='/upload' element={user? <Upload/> : <Navigate to='/login' />} />
          <Route path='/home' element={user? <Home/> : <Navigate to='/login' />} />
          <Route path='/search-page' element={user? <Search/> : <Navigate to='/login' />} />
          <Route path='/portfolio/:username' element={user? <PortfolioPage/> : <Navigate to='/login' />} />
          <Route path='/marketplace' element={user? <Marketplace/> : <Navigate to='/login' />} />
          <Route path='/:username' element={user? <Profile/> : <Navigate to='/login' />} />
          <Route path="/" element={user ? <Home /> : <Navigate to='/login' exact/>} />
      </Routes>
    </main>
  )
}

export default App
