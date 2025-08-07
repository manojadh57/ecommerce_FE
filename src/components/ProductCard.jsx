import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { toast } from "react-toastify";
import "../styles/ProductCard.css";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // Image URL with fallback
  const imgSrc = product.images?.[0]
    ? `${import.meta.env.VITE_IMAGE_BASE_URL?.replace(/\/$/, "")}/${
        product.images[0]
      }`
    : "https://i.imgur.com/pjITBzX.jpg";

  // Add to cart and show toast
  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div
      className="product-card"
      onClick={() => navigate(`/product/${product._id}`)}
      tabIndex={0}
      role="button"
    >
      <img className="product-img" src={imgSrc} alt={product.name} />

      <div className="card-content">
        <h5 className="product-title">{product.name}</h5>
        <p className="product-price">${product.price.toFixed(2)}</p>

        {/* Details button */}
        <button
          className="btn btn-outline-secondary btn-block detail-btn"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/product/${product._id}`);
          }}
        >
          View Details
        </button>

        {/* Add to Cart with toast */}
        <button
          className="btn btn-dark btn-block cart-btn"
          onClick={handleAddToCart}
        >
          + Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;

// - Uses react-toastify for notification
// - Short comments only
