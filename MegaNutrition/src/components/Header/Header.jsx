import React from 'react'
import './Header.css'
import { useNavigate } from 'react-router-dom'

const Header = () => {
  const navigate = useNavigate();

  return (
    <div className='header'>
      <div className="header-contents">
        <h2>Order your food supplements here</h2>
        <p>
          Choose from a diverse selection. Our mission is to satisfy your cravings
          and elevate your experience in the fitness environment.
        </p>
        <button onClick={() => navigate('/')}>View supplements</button>
      </div>
    </div>
  )
}

export default Header
