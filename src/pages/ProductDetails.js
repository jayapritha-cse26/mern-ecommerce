import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ProductDetails = () => {
  const { id } = useParams(); // Get product id from URL
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:1000/api/User/product/single/${id}`);
        setProduct(res.data.product);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (quantity > product.stock) {
      alert(`Only ${product.stock} items available`);
      return;
    }

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingProductIndex = cart.findIndex((item) => item._id === product._id);

    if (existingProductIndex >= 0) {
      cart[existingProductIndex].quantity += quantity;
      if (cart[existingProductIndex].quantity > product.stock) {
        cart[existingProductIndex].quantity = product.stock;
        alert(`Quantity updated to max stock ${product.stock}`);
      }
    } else {
      cart.push({ ...product, quantity });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${product.title} added to cart!`);
  };

  if (!product) return <p>Loading product details...</p>;

  return (
    <div style={{ maxWidth: "800px", margin: "20px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}>
      <h1>{product.title}</h1>
      <img
        src={product.image ? `http://localhost:1000/${product.image.replace(/\\/g, "/")}` : "fallback-image.png"}
        alt={product.title}
        style={{ width: "100%", maxHeight: "400px", objectFit: "cover", borderRadius: "8px", marginBottom: "20px" }}
      />
      <p><strong>Description:</strong> {product.description}</p>
      <p><strong>Price:</strong> ₹ {product.price}</p>
      <p><strong>Stock:</strong> {product.stock}</p>
      <p><strong>Category:</strong> {product.category}</p>

      <div style={{ marginTop: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
        <label>Quantity:</label>
        <input
          type="number"
          min="1"
          max={product.stock}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          style={{ width: "60px", padding: "5px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
      </div>

      <button
        onClick={handleAddToCart}
        disabled={product.stock === 0}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: product.stock === 0 ? "#999" : "green",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: product.stock === 0 ? "not-allowed" : "pointer",
          transition: "background-color 0.3s"
        }}
        onMouseOver={(e) => {
          if (product.stock !== 0) e.target.style.backgroundColor = "#006400";
        }}
        onMouseOut={(e) => {
          if (product.stock !== 0) e.target.style.backgroundColor = "green";
        }}
      >
        {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
      </button>
    </div>
  );
};

export default ProductDetails;
