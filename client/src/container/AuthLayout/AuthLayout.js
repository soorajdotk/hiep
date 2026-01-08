import React from 'react'
import {Outlet} from 'react-router-dom'
import './AuthLayout.css'
import sideImage from '../../assets/side-img.svg'

const AuthLayout = () => {
  return (
    <>
      <section className='authlayout-section'>
        <Outlet/>
      </section>
      {/* <img src={sideImage} alt='img' className='authlayout-img' /> */}
    </>
  )
}

export default AuthLayout
