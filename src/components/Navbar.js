import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const linkStyle = {
    margin: "0 10px",
    textDecoration: "none",
    color: "#fff",
    fontWeight: "bold"
  };

  return (
    <nav style={{ padding: "10px", backgroundColor: "#007bff" }}>
      <Link to="/" style={linkStyle}>
        Home
      </Link>
      <Link to="/cart" style={linkStyle}>
        Cart
      </Link>
      <Link to="/orders" style={linkStyle}>
        Orders
      </Link>
    </nav>
  );
};

export default Navbar;
