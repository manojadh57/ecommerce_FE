import React, { useEffect, useState } from "react";
import { useCart } from "../hooks/useCart";
import { FaShoppingCart } from "react-icons/fa"; // or whatever icon you use
import "./CartButton.css";

export default function CartButton({ onClick }) {
  const { items } = useCart();
  const totalCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const [bump, setBump] = useState(false);

  // trigger bump on count change
  useEffect(() => {
    if (totalCount === 0) return;
    setBump(true);
    const timer = setTimeout(() => setBump(false), 300);
    return () => clearTimeout(timer);
  }, [totalCount]);

  return (
    <button className={`cart-button ${bump ? "bump" : ""}`} onClick={onClick}>
      <FaShoppingCart />
      <span className="badge">{totalCount}</span>
    </button>
  );
}
