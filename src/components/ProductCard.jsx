import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCart } from "../hooks/useCart";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import "../styles/ProductCard.css";

/* Stars (hidden if no reviews) */
const StarBar = ({ value = 0, count = 0 }) => {
  if (!count) return null;
  const v = Math.max(0, Math.min(5, Math.round((Number(value) || 0) * 2) / 2));
  const slots = Array.from({ length: 5 }, (_, i) => {
    const n = i + 1;
    return v >= n ? "full" : v >= n - 0.5 ? "half" : "empty";
  });
  return (
    <div className="d-flex align-items-center gap-2 small text-muted mb-2">
      <span className="rating-stars" aria-label={`${v} out of 5 stars`}>
        {slots.map((t, i) =>
          t === "full" ? (
            <FaStar key={i} />
          ) : t === "half" ? (
            <FaStarHalfAlt key={i} />
          ) : (
            <FaRegStar key={i} />
          )
        )}
      </span>
      <span>({count})</span>
    </div>
  );
};

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const imgSrc = product.images?.[0]
    ? `${(import.meta.env.VITE_IMAGE_BASE_URL || "").replace(/\/$/, "")}/${
        product.images[0]
      }`
    : "https://i.imgur.com/pjITBzX.jpg";

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
    toast.success(`${product.name} added to cart`);
  };

  const avg = typeof product.avgRating === "number" ? product.avgRating : 0;
  const cnt = typeof product.reviewCount === "number" ? product.reviewCount : 0;

  const price = Number(product.price || 0);
  const formatted =
    Math.round(price * 100) % 100 === 0
      ? price.toLocaleString() // 1,279
      : price.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });

  return (
    <div
      className="product-card card h-100"
      onClick={() => navigate(`/product/${product._id}`)}
      tabIndex={0}
      role="button"
      onKeyDown={(e) =>
        (e.key === "Enter" || e.key === " ") &&
        navigate(`/product/${product._id}`)
      }
    >
      {/* Image */}
      <div className="product-thumb">
        <img className="product-img" src={imgSrc} alt={product.name} />
      </div>

      {/* Body */}
      <div className="card-body d-flex flex-column">
        <h5 className="product-title mb-1">{product.name}</h5>

        <StarBar value={avg} count={cnt} />

        {/* Centered price ticket */}
        <div className="d-flex justify-content-center my-2">
          <span
            className="price-sticker"
            aria-label={`Price ${formatted} dollars`}
          >
            <span className="currency">$</span>
            <span className="amount">{formatted}</span>
          </span>
        </div>

        <button
          className="btn btn-primary w-100 mt-auto"
          onClick={handleAddToCart}
        >
          + Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
