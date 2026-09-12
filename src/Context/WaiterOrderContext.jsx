import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const WaiterOrderContext = createContext();

export const useWaiterOrder = () => {
  return useContext(WaiterOrderContext);
};

const WaiterOrderProvider = ({ children }) => {
  // ========================================
  // LOAD WAITER ORDER FROM LOCAL STORAGE
  // ========================================
  const [orderItems, setOrderItems] = useState(() => {
    try {
      const savedOrder = localStorage.getItem("chaBuzzWaiterOrder");

      return savedOrder ? JSON.parse(savedOrder) : [];
    } catch (error) {
      console.error("Failed to load waiter order:", error);
      return [];
    }
  });

  // ========================================
  // SAVE WAITER ORDER TO LOCAL STORAGE
  // ========================================
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

  // ========================================
  // ADD FOOD TO WAITER ORDER
  // ========================================
  const addToWaiterOrder = (food) => {
    setOrderItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.id === food.id
      );

      // Food already exists
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

      // New food
      return [
        ...currentItems,
        {
          id: food.id,
          name: food.name,
          price: Number(food.price),
          image: food.image,
          category: food.category,
          quantity: 1,
        },
      ];
    });
  };

  // ========================================
  // INCREASE QUANTITY
  // ========================================
  const increaseWaiterQuantity = (foodId) => {
    setOrderItems((currentItems) =>
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

  // ========================================
  // DECREASE QUANTITY
  // ========================================
  const decreaseWaiterQuantity = (foodId) => {
    setOrderItems((currentItems) =>
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

  // ========================================
  // REMOVE FOOD
  // ========================================
  const removeFromWaiterOrder = (foodId) => {
    setOrderItems((currentItems) =>
      currentItems.filter(
        (item) => item.id !== foodId
      )
    );
  };

  // ========================================
  // CLEAR CURRENT ORDER
  // ========================================
  const clearWaiterOrder = () => {
    setOrderItems([]);
  };

  // ========================================
  // TOTAL PRICE
  // ========================================
  const totalPrice = useMemo(() => {
    return orderItems.reduce(
      (total, item) =>
        total + Number(item.price) * item.quantity,
      0
    );
  }, [orderItems]);

  // ========================================
  // TOTAL ITEMS
  // ========================================
  const totalItems = useMemo(() => {
    return orderItems.reduce(
      (total, item) =>
        total + item.quantity,
      0
    );
  }, [orderItems]);

  // ========================================
  // CONTEXT VALUE
  // ========================================
  const waiterOrderInfo = {
    orderItems,
    totalPrice,
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