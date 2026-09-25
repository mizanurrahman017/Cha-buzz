import { createBrowserRouter } from "react-router";

import RootLayouts from "../Layout/RootLayouts";

import Home from "../Pages/Home/Home/Home";
import Cart from "../Pages/Cart/Cart";

import Orders from "../Pages/Admin/Order/Orders";

import AdminRoute from "./AdminRoute";
import WaiterRoute from "./WaiterRoute";

import Login from "../Pages/Auth/Login/Login";
import Waiter from "../Pages/Waiter/Waiter";
import PaymentSuccess from "../Pages/PaymentSuccess/PaymentSuccess";

export const router = createBrowserRouter([
  {
    path: "/",

    Component: RootLayouts,

    children: [

      // ==================================
      // HOME
      // ==================================
      {
        index: true,
        Component: Home,
      },

      // ==================================
      // CART
      // ==================================
      {
        path: "cart",
        Component: Cart,
      },

      // ==================================
      // LOGIN
      // ==================================
      {
        path: "login",
        Component: Login,
      },

      // ==================================
      // PAYMENT SUCCESS
      // ==================================
      {
        path: "payment-success",
        Component: PaymentSuccess,
      },

      // ==================================
      // WAITER PANEL
      // ==================================
      {
        path: "waiter",

        element: (
          <WaiterRoute>
            <Waiter />
          </WaiterRoute>
        ),
      },

      // ==================================
      // ADMIN ORDERS
      // ==================================
      {
        path: "admin/orders",

        element: (
          <AdminRoute>
            <Orders />
          </AdminRoute>
        ),
      },
    ],
  },
]);