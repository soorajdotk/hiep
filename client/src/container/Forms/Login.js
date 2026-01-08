import React, { useState } from 'react'
import './Login.css'
import {Link} from 'react-router-dom'
import { useLogin } from '../../hooks/useLogin'
import Logo from '../../assets/logo.png'
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const Login = () => {
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [visible, setVisible] = useState(false)

  const { login, error, isLoading } = useLogin()

  const handleSubmit = async(e) => {
      e.preventDefault()

      await login(email, password)
  }
  

  return (
    <div className='login-container'>
        <img src={Logo} alt='Hiep Logo' className='logo-container-logo'/>
        <h2 className='login-container-heading'>Log in to your account</h2>
        <p className='login-container-text'>
            Welcome back! please enter your details.
        </p>
        <form className='login-container-form' onSubmit={handleSubmit}>
            <div className='login-container-form-label'>Email</div>
            <input type='email' className='login-container-form-input' onChange={(e) => setEmail(e.target.value)} value={email} />
            <div className='login-container-form-label'>Password</div>
            <div className='login-container-form-pwd'>
              <input type={visible ? "text" : "password"} className='login-container-form-input-pwd' onChange={(e) => setPassword(e.target.value)} value={password} />
              {visible ? (
                    <AiOutlineEye
                      className="pwd-btn"
                      size={25}
                      onClick={() => setVisible(false)}
                    />
                  ) : (
                    <AiOutlineEyeInvisible
                      className="pwd-btn"
                      size={25}
                      onClick={() => setVisible(true)}
                    />
                  )}
              </div>
            <button type='submit' className='login-container-form-submit' disabled={isLoading}>Log In</button>
            {error && <div className="error">{error}</div>}
            <p className='login-container-form-text'>Don't have an account? <Link to='/signup'>Signup</Link></p>
        </form>
    </div>
  )
}

export default Login
