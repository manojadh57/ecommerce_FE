import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  // Add a product
  const addToCart = ({ product, quantity }) => {
    setItems((cur) => {
      const idx = cur.findIndex((i) => i.product._id === product._id);
      if (idx > -1) {
        // update existing
        const copy = [...cur];
        copy[idx].quantity += quantity;
        return copy;
      }
      // new entry
      return [...cur, { product, quantity }];
    });
  };

  // Remove a product completely
  const removeFromCart = (productId) => {
    setItems((cur) => cur.filter((i) => i.product._id !== productId));
  };

  // Update to a specific quantity
  const updateQty = (productId, newQty) => {
    setItems((cur) =>
      cur.map((i) =>
        i.product._id === productId ? { ...i, quantity: newQty } : i
      )
    );
  };

  // Clear cart
  const clearCart = () => setItems([]);

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQty, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
