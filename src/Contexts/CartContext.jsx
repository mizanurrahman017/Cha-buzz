
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { getProductPricing } from "../Utils/productPricing";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem("chaBuzzCart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Failed to load cart:", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("chaBuzzCart", JSON.stringify(cartItems));
    } catch (error) {
      console.error("Failed to save cart:", error);
    }
  }, [cartItems]);

  const addToCart = (food) => {
    setCartItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.id === food.id
      );

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === food.id
            ? { ...item, quantity: Number(item.quantity) + 1 }
            : item
        );
      }

      return [
        ...currentItems,
        {
          ...food,
          quantity: 1,
        },
      ];
    });
  };

  const removeFromCart = (foodId) => {
    setCartItems((currentItems) =>
      currentItems.filter((item) => item.id !== foodId)
    );
  };

  const increaseQuantity = (foodId) => {
    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.id === foodId
          ? { ...item, quantity: Number(item.quantity) + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (foodId) => {
    setCartItems((currentItems) =>
      currentItems
        .map((item) =>
          item.id === foodId
            ? { ...item, quantity: Number(item.quantity) - 1 }
            : item
        )
        .filter((item) => Number(item.quantity) > 0)
    );
  };

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const cartCount = cartItems.reduce(
    (total, item) => total + Number(item.quantity || 0),
    0
  );

  // Calculate the discounted subtotal.
  const totalPrice = cartItems.reduce((total, item) => {
    const pricing = getProductPricing(item);
    return total + pricing.discountedPrice * Number(item.quantity || 0);
  }, 0);

  // Total discount across all quantities.
  const totalDiscount = cartItems.reduce((total, item) => {
    const pricing = getProductPricing(item);
    return total + pricing.discountPerItem * Number(item.quantity || 0);
  }, 0);

  const value = {
    cartItems,
    cartCount,
    totalPrice,
    totalDiscount,
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