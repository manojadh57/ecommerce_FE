import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cart_items") || "[]");
    } catch {
      return [];
    }
  }); // [{ product, quantity }...]

  // persist to localStorage on change
  React.useEffect(() => {
    try {
      localStorage.setItem("cart_items", JSON.stringify(items));
    } catch {}
  }, [items]);

  const addToCart = (product, quantity) => {
    console.log("Adding to cart:", product?._id, "qty:", quantity);
    setItems((cur) => {
      const idx = cur.findIndex((i) => i.product._id === product._id);
      let next;
      if (idx > -1) {
        next = [...cur];
        next[idx].quantity += quantity;
      } else {
        next = [...cur, { product, quantity }];
      }
      console.log("Cart now:", next);
      return next;
    });
  };

  const updateQty = (productId, newQty) => {
    setItems((cur) => {
      const next = cur.map((i) =>
        i.product._id === productId ? { ...i, quantity: newQty } : i
      );
      console.log("Updated qty for", productId, "=>", newQty, "Cart:", next);
      return next;
    });
  };

  const removeFromCart = (productId) => {
    setItems((cur) => {
      const next = cur.filter((i) => i.product._id !== productId);
      console.log("Removed from cart:", productId, "Cart:", next);
      return next;
    });
  };

  const clearCart = () => {
    console.log("Clearing cart");
    setItems([]);
  };

  return (
    <CartContext.Provider
      value={{ items, addToCart, updateQty, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
