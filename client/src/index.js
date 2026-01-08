import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.js'
import './index.css'
import {BrowserRouter} from 'react-router-dom'
import { AuthContextProvider } from './context/AuthContext.js'
import PostContextProvider from './context/PostContext.js'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthContextProvider>  
        <PostContextProvider>
            <App/>
        </PostContextProvider>
      </AuthContextProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
