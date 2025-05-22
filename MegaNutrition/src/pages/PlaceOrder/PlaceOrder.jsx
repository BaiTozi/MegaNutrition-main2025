import React, { useContext, useState } from 'react';
import './PlaceOrder.css';
import { StoreContext } from '../../context/StoreContext';
import { db, auth } from '../../firebase/config';
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';

const PlaceOrder = () => {
  const { cartItems, getTotalCartAmount, products, setCartItems } = useContext(StoreContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    phone: '',
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) {
      alert("You must be logged in to place an order.");
      return;
    }

    const selectedProducts = Object.entries(cartItems)
      .filter(([id, qty]) => qty > 0)
      .map(([id, qty]) => {
        const product = products.find(p => p.id === id);
        return {
          id,
          name: product?.name || "Unknown",
          price: product?.price || 0,
          quantity: qty,
          total: (product?.price || 0) * qty
        };
      });

    if (selectedProducts.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    try {
      const orderData = {
        userId: user.uid,
        cart: selectedProducts,
        totalAmount: getTotalCartAmount() + 2,
        deliveryFee: 2,
        deliveryInfo: formData,
        createdAt: Timestamp.now()
      };

      await addDoc(collection(db, "orders"), orderData);
      alert("Order placed successfully!");
      setCartItems({}); // изчистваме количката
      navigate('/');
    } catch (error) {
      console.error("Error placing order: ", error);
      alert("Error placing order.");
    }
  };

  return (
    <form className='place-order' onSubmit={handleSubmit}>
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input type="text" name="firstName" placeholder='First name' onChange={handleChange} required />
          <input type="text" name="lastName" placeholder='Last name' onChange={handleChange} required />
        </div>
        <input type="email" name="email" placeholder='Email address' onChange={handleChange} required />
        <input type="text" name="street" placeholder='Street' onChange={handleChange} required />
        <div className="multi-fields">
          <input type="text" name="city" placeholder='City' onChange={handleChange} required />
          <input type="text" name="state" placeholder='State' onChange={handleChange} required />
        </div>
        <div className="multi-fields">
          <input type="text" name="zip" placeholder='Zip code' onChange={handleChange} required />
          <input type="text" name="country" placeholder='Country' onChange={handleChange} required />
        </div>
        <input type="tel" name="phone" placeholder='Phone' onChange={handleChange} required />
      </div>

      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>{getTotalCartAmount()} BGN</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>2 BGN</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>{getTotalCartAmount() + 2} BGN</b>
            </div>
          </div>
          <button type="submit">Order</button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
