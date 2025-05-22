import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'
const Footer = () => {
  return (
    <div className='footer' id='footer'>
        <div className="footer-content">
            <div className="footer-content-left">
                <img src={assets.logo} alt="" className='logo-style'/>
                <p>We offer the best sports supplements for your health and performance. Browse our products and contact us for more information.</p>
                <div className="footer-social-icons">
                    <img src={assets.facebook_icon} alt="" />
                    <img src={assets.twitter_icon} alt="" />
                    <img src={assets.linkedin_icon} alt="" />
                </div>
            </div>
            <div className="footer-content-center">
                <h2>COMPANY</h2>
                <ul>
                  <li>Home</li>
                  <li>About us</li>
                  <li>Delivery</li>
                  <li>Privacy policy</li>
                </ul>
            </div>
            <div className="footer-content-right">
                <h2>GET IN TOUCH</h2>
                <ul>
                  <li>+359887754911</li>
                  <li>contact@MegaNutrition.com</li>
                </ul>
            </div>      
        </div>
        <hr />
        <p className="footer-copyright">Copyright 2025 c MegaNutrition.com - All rights Reserved.</p>
    </div>
  )
}

export default Footer