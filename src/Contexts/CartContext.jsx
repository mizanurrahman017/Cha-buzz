import React, { createContext, useContext, useEffect, useState } from "react";

// Create Context
const CartContext = createContext();

// Custom Hook
export const useCart = () => {
  return useContext(CartContext);
};

const CartProvider = ({ children }) => {
  // LocalStorage থেকে আগের cart নেওয়া
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("chaBuzzCart");

    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Cart পরিবর্তন হলে LocalStorage-এ save হবে
  useEffect(() => {
    localStorage.setItem("chaBuzzCart", JSON.stringify(cartItems));
  }, [cartItems]);

  // =========================
  // ADD TO CART
  // =========================
  const addToCart = (food) => {
    setCartItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.id === food.id
      );

      // যদি food আগে থেকেই cart-এ থাকে
      if (existingItem) {
        return currentItems.map((item) =>
          item.id === food.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      // নতুন food হলে
      return [
        ...currentItems,
        {
          ...food,
          quantity: 1,
        },
      ];
    });
  };

  // =========================
  // REMOVE FROM CART
  // =========================
  const removeFromCart = (foodId) => {
    setCartItems((currentItems) =>
      currentItems.filter((item) => item.id !== foodId)
    );
  };

  // =========================
  // INCREASE QUANTITY
  // =========================
  const increaseQuantity = (foodId) => {
    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.id === foodId
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  };

  // =========================
  // DECREASE QUANTITY
  // =========================
  const decreaseQuantity = (foodId) => {
    setCartItems((currentItems) =>
      currentItems
        .map((item) =>
          item.id === foodId
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // =========================
  // CLEAR CART
  // =========================
  const clearCart = () => {
    setCartItems([]);
  };

  // =========================
  // TOTAL ITEMS
  // =========================
  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // =========================
  // TOTAL PRICE
  // =========================
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Context values
  const value = {
    cartItems,
    cartCount,
    totalPrice,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;