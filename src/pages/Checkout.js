import React, { useState, useEffect } from "react";

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    pincode: "",
    phone: ""
  });

  // Load cart items
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCart);
  }, []);

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + (item.price * (item.quantity || 1)),
    0
  );

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Place order
  const handleOrder = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.address || !formData.city || !formData.pincode || !formData.phone) {
      alert("Please fill all fields");
      return;
    }

    // Save order (for now just in localStorage)
    const order = {
      customer: formData,
      items: cartItems,
      total: totalPrice,
      date: new Date().toLocaleString()
    };

    localStorage.setItem("order", JSON.stringify(order));
    localStorage.removeItem("cart"); // clear cart after order
    alert("Order placed successfully!");
    window.location.href = "/"; // redirect to homepage
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Checkout</h1>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          
          {/* Shipping Form */}
          <form onSubmit={handleOrder} style={{ width: "45%" }}>
            <h2>Shipping Details</h2>
            <input type="text" name="name" placeholder="Full Name" onChange={handleChange} style={inputStyle} />
            <input type="email" name="email" placeholder="Email" onChange={handleChange} style={inputStyle} />
            <input type="text" name="address" placeholder="Address" onChange={handleChange} style={inputStyle} />
            <input type="text" name="city" placeholder="City" onChange={handleChange} style={inputStyle} />
            <input type="text" name="pincode" placeholder="Pincode" onChange={handleChange} style={inputStyle} />
            <input type="text" name="phone" placeholder="Phone Number" onChange={handleChange} style={inputStyle} />

            <button type="submit" style={buttonStyle}>
              Place Order
            </button>
          </form>

          {/* Order Summary */}
          <div style={{ width: "45%", border: "1px solid #ccc", padding: "20px", borderRadius: "8px" }}>
            <h2>Order Summary</h2>
            {cartItems.map((item) => (
              <div key={item._id} style={{ marginBottom: "10px" }}>
                <p><b>{item.title}</b> x {item.quantity || 1}</p>
                <p>₹ {item.price * (item.quantity || 1)}</p>
              </div>
            ))}
            <hr />
            <h3>Total: ₹ {totalPrice}</h3>
          </div>
        </div>
      )}
    </div>
  );
};

// Styling
const inputStyle = {
  display: "block",
  width: "100%",
  padding: "10px",
  margin: "10px 0",
  borderRadius: "5px",
  border: "1px solid #ccc"
};

const buttonStyle = {
  padding: "12px 20px",
  backgroundColor: "green",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer"
};

export default Checkout;
