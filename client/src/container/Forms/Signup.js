import React, { useState } from 'react'
import './Login.css'
import {Link} from 'react-router-dom'
import { useSignup } from "../../hooks/useSignup"
import Logo  from '../../assets/logo.png'
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const Signup = () => {

  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState('')
  const {signup, error, isLoading} = useSignup()
  const [visible, setVisible] = useState(false)
  const [cVisible, setCVisible] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords don't match.")
      return;
    } 

    await signup(email, password, username)
  }

  return (
    <div className='login-container'>
        <img src={Logo} alt='Hiep Logo'/>
        <h2 className='login-container-heading'>Create a new account</h2>
        <p className='login-container-text'>
            Welcome! Enter your details to continue
        </p>
        <form className='login-container-form' onSubmit={handleSubmit}>
            <div className='login-container-form-label'>Username</div>
            <input type='text' className='login-container-form-input-username' onChange={(e) => setUsername(e.target.value)} value={username}  />
            <div className='login-container-form-label'>Email</div>
            <input type='email' className='login-container-form-input' onChange={(e) => setEmail(e.target.value)} value={email}  />
            <div className='login-container-form-label'>Password</div>
            <div className='login-container-form-pwd'>
              <input type={visible ? "text" : "password"} className='login-container-form-input-pwd' onChange={(e) => setPassword(e.target.value)} value={password}  />
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
            <div className='login-container-form-label'>Confirm Password</div>
            <div className='login-container-form-pwd'>
              <input type={cVisible ? "text" : "password"} className='login-container-form-input-pwd' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
              {cVisible ? (
                    <AiOutlineEye
                      className="pwd-btn"
                      size={25}
                      onClick={() => setCVisible(false)}
                    />
                  ) : (
                    <AiOutlineEyeInvisible
                      className="pwd-btn"
                      size={25}
                      onClick={() => setCVisible(true)}
                    />
                  )}
            </div>
            <button type='submit' className='login-container-form-submit' disabled={isLoading}>Sign Up</button>
            {error && <div className="error">{error}</div>}
            {!error && confirmPasswordError && <div className="error">{confirmPasswordError}</div>}
            <p className='login-container-form-text'>Already have an account? <Link to='/login'>Log in</Link></p>
        </form>
    </div>
  )
}

export default Signup
