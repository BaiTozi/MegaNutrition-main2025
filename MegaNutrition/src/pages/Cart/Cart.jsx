import React, { useContext } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const {
    products,
    cartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
  } = useContext(StoreContext);
  const navigate = useNavigate();

  const totalAmount = getTotalCartAmount();

  if (!products || products.length === 0) {
    return <p className="cart-loading">Loading Products...</p>;
  }

  return (
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Item</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <hr />
        {Object.entries(cartItems)
          .filter(([id, quantity]) => quantity > 0)
          .map(([id, quantity]) => {
            const product = products.find((item) => item.id === id);
            if (!product) return null;

            return (
              <div key={id} className="cart-items-item">
                <img src={product.imageURL} alt={product.name} />
                <p>{product.name}</p>
                <p>{product.price} BGN</p>
                <div className="cart-quantity-adjust">
                  <button onClick={() => removeFromCart(id)} className="quantity-btn">−</button>
                  <span>{quantity}</span>
                  <button onClick={() => addToCart(id)} className="quantity-btn">+</button>
                </div>
                <p>{product.price * quantity} BGN</p>
                <p onClick={() => removeFromCart(id)} className="cross">x</p>
              </div>
            );
          })}
      </div>

      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Total: {totalAmount} BGN</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>{totalAmount} BGN</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>{totalAmount === 0 ? 0 : 2} BGN</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>{totalAmount === 0 ? 0 : totalAmount + 2} BGN</b>
            </div>
          </div>
          <button
            onClick={() => navigate("/checkout")}
            disabled={totalAmount === 0}
          >
            Order
          </button>
        </div>

        <div className="cart-promocode">
          <div>
            <p>If you have a promo code, Enter it here</p>
            <div className="cart-promocode-input">
              <input type="text" placeholder="promo code" />
              <button>Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
