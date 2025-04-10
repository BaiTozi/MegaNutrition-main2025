import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom'; // Import Link for routing
import './Navbar.css';
import { assets } from '../../assets/assets.js';
import { StoreContext } from '../../context/StoreContext.jsx';
import { auth } from '../../firebase/config'; // Import Firebase auth
import { signOut } from "firebase/auth"; // Import Firebase signOut
import { doc, getDoc } from "firebase/firestore"; // Import Firestore functions
import { db } from '../../firebase/config'; // Import Firestore instance

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("home");
  const [user, setUser] = useState(null); // State to store user data
  const [isAdmin, setIsAdmin] = useState(false); // State to check if user is admin
  const { getTotalCartAmount } = useContext(StoreContext);

  // Check if user is logged in and fetch user role
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user); // Set user data

        // Fetch user role from Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userRole = userDoc.data().role;
          setIsAdmin(userRole === "admin"); // Set isAdmin to true if role is 'admin'
        }
      } else {
        setUser(null); // Clear user data if not logged in
        setIsAdmin(false); // Reset isAdmin
      }
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null); // Clear user data
      setIsAdmin(false); // Reset isAdmin
      window.location.href = "/"; // Redirect to home page
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <div className="navbar">
      <Link to='/'><img src={assets.logo} alt="" className="logo" /></Link>
      <ul className="navbar-menu">
        <Link to='/' onClick={() => setMenu("home")} className={menu === "home" ? "active" : ""}>home</Link>
        <a href='#explore-menu' onClick={() => setMenu("menu")} className={menu === "menu" ? "active" : ""}>menu</a>
        <a href='#app-download' onClick={() => setMenu("mobile-app")} className={menu === "mobile-app" ? "active" : ""}>mobile-app</a>
        <a href='#footer' onClick={() => setMenu("contact-us")} className={menu === "contact-us" ? "active" : ""}>contact us</a>

        {/* Show Admin Panel link only for admin users */}
        {isAdmin && (
          <li>
            <Link to="/admin" className={menu === "admin" ? "active" : ""}>Admin Panel</Link>
          </li>
        )}

        {/* Линк към BMI калкулатора */}
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

        {/* Show user email and logout button if logged in, otherwise show sign-in button */}
        {user ? (
          <div className="navbar-user">
            <span>{user.email}</span>
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