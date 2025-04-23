import React from 'react';
import './Header.css';

const Header = () => {
  const scrollToSupplements = () => {
    const exploreSection = document.getElementById("explore-menu");
    if (exploreSection) {
      exploreSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className='header'>
      <div className="header-contents">
        <h2>Order your food supplements here</h2>
        <p>Choose from a diverse selection of supplements. Our mission is to satisfy your cravings and elevate your fitness journey.</p>
        <button onClick={scrollToSupplements}>View Supplements</button>
      </div>
    </div>
  );
};

export default Header;
