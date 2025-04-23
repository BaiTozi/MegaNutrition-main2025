import React, { useState } from 'react';
import Navbar from './components/Navbar/Navbar';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import Cart from './pages/Cart/Cart';
import PlaceOrder from './pages/PlaceOrder/PlaceOrder';
import AdminPanel from './AdminPanel/AdminPanel';  // Import the AdminPanel component
import AccountPanel from './AccountPanel/AccountPanel';
import LoginPopup from './components/LoginPage/LoginPopup';
import Footer from './components/footer/footer';
import BMICalculator from './components/BMICalculator/BMICalculator'; // Импортирай BMI калкулатора

const App = () => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      {showLogin ? <LoginPopup setShowLogin={setShowLogin} /> : <></>}
      <div className='app'>
        <Navbar setShowLogin={setShowLogin} />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/order' element={<PlaceOrder />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/account" element={<AccountPanel />}/>
          <Route path="/login" element={<LoginPopup />} />
          <Route path="/bmi" element={<BMICalculator />} /> {/* Нов маршрут за BMI калкулатора */}
          <Route path='/checkout' element={<PlaceOrder />} />
        </Routes>  
      </div>
      <Footer/>      
    </>
  );
};

export default App;