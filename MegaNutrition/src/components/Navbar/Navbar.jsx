import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { assets } from '../../assets/assets.js';
import { StoreContext } from '../../context/StoreContext.jsx';
import { auth } from '../../firebase/config';
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from '../../firebase/config';

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("home");
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [displayName, setDisplayName] = useState(null);
  const { getTotalCartAmount } = useContext(StoreContext);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user && user.uid) {
        setUser(user);

        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const userRole = userData?.role;
            const userName = userData?.name;

            setIsAdmin(userRole === "admin");
            setDisplayName(userName || user.email); // показваме име, ако има
          }
        } catch (error) {
          console.error("Error fetching user data in navbar:", error);
        }
      } else {
        setUser(null);
        setIsAdmin(false);
        setDisplayName(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setIsAdmin(false);
      setDisplayName(null);
      window.location.href = "/";
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <div className="navbar">
      <Link to='/'><img src={assets.logo} alt="" className="logo" /></Link>
      <ul className="navbar-menu">
        <Link to='/' onClick={() => setMenu("home")} className={menu === "home" ? "active" : ""}>Home</Link>
        <a href='#explore-menu' onClick={() => setMenu("menu")} className={menu === "menu" ? "active" : ""}>Menu</a>
        <a href='#app-download' onClick={() => setMenu("mobile-app")} className={menu === "mobile-app" ? "active" : ""}>Mobile-App</a>
        <a href='#footer' onClick={() => setMenu("contact-us")} className={menu === "contact-us" ? "active" : ""}>Contact us</a>

        {isAdmin && (
          <li>
            <Link to="/admin" className={menu === "admin" ? "active" : ""}>Admin Panel</Link>
          </li>
        )}

        <li>
          <Link to="/bmi" className={menu === "bmi" ? "active" : ""}>BMI Calculator</Link>
        </li>
      </ul>

      <div className="navbar-right">
        <img src={assets.search_icon} alt="" />
        <div className="navbar-search-icon">
          <Link to='/cart'><img src={assets.basket_icon} alt="" /></Link>
          <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
        </div>

        {user ? (
          <div className="navbar-user">
            <Link to="/account" className="account-link">{displayName}</Link>
            <button onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <button onClick={() => setShowLogin(true)}>Sign In</button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
