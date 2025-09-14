import React, { useEffect, useState } from "react";

const Orders = () => {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const storedOrder = JSON.parse(localStorage.getItem("order"));
    setOrder(storedOrder);
  }, []);

  if (!order) {
    return (
      <div style={{ padding: "20px" }}>
        <h1>My Orders</h1>
        <p>No orders found. Please place an order first.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>My Orders</h1>
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "20px",
          marginTop: "10px",
        }}
      >
        <h2>Order Summary</h2>
        <p><b>Date:</b> {order.date}</p>
        <p><b>Name:</b> {order.customer.name}</p>
        <p><b>Email:</b> {order.customer.email}</p>
        <p><b>Address:</b> {order.customer.address}, {order.customer.city} - {order.customer.pincode}</p>
        <p><b>Phone:</b> {order.customer.phone}</p>

        <h3>Items:</h3>
        {order.items.map((item, index) => (
          <div key={index} style={{ marginBottom: "10px" }}>
            <p><b>{item.title}</b> x {item.quantity || 1}</p>
            <p>₹ {item.price * (item.quantity || 1)}</p>
          </div>
        ))}

        <hr />
        <h2>Total: ₹ {order.total}</h2>
      </div>
    </div>
  );
};

export default Orders;
