import { createBrowserRouter } from "react-router";

import RootLayouts from "../Layout/RootLayouts";

import Home from "../Pages/Home/Home/Home";

import Cart from "../Pages/Cart/Cart";

// import Orders from "../Pages/Admin/Orders/Orders";
import Orders from "../Pages/Admin/Order/Orders";

import AdminRoute from "./AdminRoute";
import Login from "../Pages/Auth/Login/Login";
import Waiter from "../Pages/Waiter/Waiter";
import WaiterRoute from "./WaiterRoute";


export const router = createBrowserRouter([

  {
    path: "/",

    Component: RootLayouts,

    children: [

      {
        index: true,
        Component: Home,
      },


      {
        path: "cart",
        Component: Cart,
      },
      {
        path: "login",
        Component: Login,
      },
      {
        path: "waiter",
        Component: Waiter,
      },


      {
        path: "admin/orders",

        element: (
          <AdminRoute>
            <Orders />
          </AdminRoute>
        ),
      },
      {
        path: "waiter",

        element: (
          <WaiterRoute>
            <Waiter />
          </WaiterRoute>
        ),
      },


    ],
  },

]);