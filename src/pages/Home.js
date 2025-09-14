import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:1000/api/User/product/all-products");
        setProducts(res.data.products);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProducts();
  }, []);

  // Add to Cart function
  const addToCart = (product) => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    localStorage.setItem("cart", JSON.stringify([...storedCart, product]));
    alert(`${product.title} added to cart!`);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ marginBottom: "20px" }}>Products</h1>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        gap: "20px"
      }}>
        {products.map((product) => (
          <div key={product._id} style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "10px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
          }}>
            {/* Image */}
            <Link to={`/product/${product._id}`}>
              <img
                src={`http://localhost:1000/${product.image.replace(/\\/g, "/")}`}
                alt={product.title}
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                  borderRadius: "8px"
                }}
              />
            </Link>

            {/* Title */}
            <Link to={`/product/${product._id}`} style={{ textDecoration: "none", color: "#000", margin: "10px 0" }}>
              <h3>{product.title}</h3>
            </Link>

            {/* Description */}
            <p style={{ fontSize: "14px", color: "#555", flexGrow: 1 }}>{product.description}</p>

            {/* Price */}
            <p style={{ fontWeight: "bold", margin: "10px 0" }}>₹ {product.price}</p>

            {/* Add to Cart button */}
            <button
              onClick={() => addToCart(product)}
              style={{
                padding: "10px 15px",
                backgroundColor: "#007bff",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                transition: "background-color 0.3s"
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = "#0056b3"}
              onMouseOut={(e) => e.target.style.backgroundColor = "#007bff"}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
