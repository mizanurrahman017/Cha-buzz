import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";

import { RouterProvider } from "react-router/dom";
import { router } from "./Routes/Router";

import CartProvider from "./Contexts/CartContext";
import AuthProvider from "./Context/AuthContext";
import WaiterOrderProvider from "./Context/WaiterOrderContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <WaiterOrderProvider>
          <RouterProvider router={router} />
        </WaiterOrderProvider>
      </CartProvider>
    </AuthProvider>
  </StrictMode>
);