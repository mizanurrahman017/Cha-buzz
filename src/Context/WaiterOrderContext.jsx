
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { getProductPricing } from "../Utils/productPricing";

const WaiterOrderContext = createContext();

export const useWaiterOrder = () => useContext(WaiterOrderContext);

const WaiterOrderProvider = ({ children }) => {
  const [orderItems, setOrderItems] = useState(() => {
    try {
      const savedOrder = localStorage.getItem("chaBuzzWaiterOrder");
      return savedOrder ? JSON.parse(savedOrder) : [];
    } catch (error) {
      console.error("Failed to load waiter order:", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(
        "chaBuzzWaiterOrder",
        JSON.stringify(orderItems)
      );
    } catch (error) {
      console.error("Failed to save waiter order:", error);
    }
  }, [orderItems]);

  const addToWaiterOrder = (food) => {
    const pricing = getProductPricing(food);

    setOrderItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => String(item.id) === String(food.id)
      );

      if (existingItem) {
        return currentItems.map((item) =>
          String(item.id) === String(food.id)
            ? { ...item, quantity: Number(item.quantity || 0) + 1 }
            : item
        );
      }

      return [
        ...currentItems,
        {
          id: food.id,
          name: food.name,
          price: pricing.regularPrice,
          regularPrice: pricing.regularPrice,
          discountType: food.discountType || "fixed",
          discountValue: Number(food.discountValue || 0),
          discountActive: food.discountActive === true,
          discountPerItem: pricing.discountPerItem,
          discountedPrice: pricing.discountedPrice,
          packingCharge: Math.max(
            0,
            Number(food.packingCharge) || 0
          ),
          image: food.image || "",
          category: food.category || "",
          quantity: 1,
        },
      ];
    });
  };

  const increaseWaiterQuantity = (foodId) => {
    setOrderItems((items) =>
      items.map((item) =>
        String(item.id) === String(foodId)
          ? { ...item, quantity: Number(item.quantity || 0) + 1 }
          : item
      )
    );
  };

  const decreaseWaiterQuantity = (foodId) => {
    setOrderItems((items) =>
      items
        .map((item) =>
          String(item.id) === String(foodId)
            ? { ...item, quantity: Number(item.quantity || 0) - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromWaiterOrder = (foodId) => {
    setOrderItems((items) =>
      items.filter((item) => String(item.id) !== String(foodId))
    );
  };

  const clearWaiterOrder = () => setOrderItems([]);

  const totalPrice = useMemo(
    () =>
      orderItems.reduce((total, item) => {
        const pricing = getProductPricing(item);
        return total + pricing.discountedPrice * Number(item.quantity || 0);
      }, 0),
    [orderItems]
  );

  const totalDiscount = useMemo(
    () =>
      orderItems.reduce((total, item) => {
        const pricing = getProductPricing(item);
        return total + pricing.discountPerItem * Number(item.quantity || 0);
      }, 0),
    [orderItems]
  );

  // Packing charge is set per food by the admin.
  const totalPackingCharge = useMemo(
    () =>
      orderItems.reduce(
        (total, item) =>
          total +
          Math.max(0, Number(item.packingCharge) || 0) *
            Number(item.quantity || 0),
        0
      ),
    [orderItems]
  );

  const totalItems = useMemo(
    () =>
      orderItems.reduce(
        (total, item) => total + Number(item.quantity || 0),
        0
      ),
    [orderItems]
  );

  const waiterOrderInfo = {
    orderItems,
    totalPrice,
    totalDiscount,
    totalPackingCharge,
    totalItems,
    addToWaiterOrder,
    increaseWaiterQuantity,
    decreaseWaiterQuantity,
    removeFromWaiterOrder,
    clearWaiterOrder,
  };

  return (
    <WaiterOrderContext.Provider value={waiterOrderInfo}>
      {children}
    </WaiterOrderContext.Provider>
  );
};

export default WaiterOrderProvider;