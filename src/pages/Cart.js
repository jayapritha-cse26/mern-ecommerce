import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  // Load cart items from localStorage
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCart);
  }, []);

  // Remove item from cart
  const removeFromCart = (id) => {
    const updatedCart = cartItems.filter(item => item._id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Increase quantity
  const increaseQuantity = (id) => {
    const updatedCart = cartItems.map(item => {
      if (item._id === id) {
        return { ...item, quantity: (item.quantity || 1) + 1 };
      }
      return item;
    });
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Decrease quantity
  const decreaseQuantity = (id) => {
    const updatedCart = cartItems.map(item => {
      if (item._id === id && (item.quantity || 1) > 1) {
        return { ...item, quantity: (item.quantity || 1) - 1 };
      }
      return item;
    });
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Navigate to Checkout
  const handleCheckout = () => {
    navigate("/checkout");
  };

  const totalPrice = cartItems.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);

  return (
    <div style={{ padding: "20px" }}>
      <h1>My Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div>
          {cartItems.map(item => (
            <div key={item._id} style={{ border: "1px solid #ccc", padding: "10px", margin: "10px 0", display: "flex", alignItems: "center" }}>
              <img src={`http://localhost:1000/${item.image}`} alt={item.title} style={{ width: "100px", marginRight: "20px" }} />
              <div style={{ flex: 1 }}>
                <h3>{item.title}</h3>
                <p>₹ {item.price}</p>
                <div>
                  <button onClick={() => decreaseQuantity(item._id)} style={{ marginRight: "5px" }}>-</button>
                  <span>{item.quantity || 1}</span>
                  <button onClick={() => increaseQuantity(item._id)} style={{ marginLeft: "5px" }}>+</button>
                </div>
              </div>
              <button
                onClick={() => removeFromCart(item._id)}
                style={{ padding: "8px 12px", backgroundColor: "red", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}
              >
                Remove
              </button>
            </div>
          ))}
          <h2>Total: ₹ {totalPrice}</h2>
          <button
            onClick={handleCheckout}
            style={{ padding: "10px 20px", backgroundColor: "green", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer", marginTop: "20px" }}
          >
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
