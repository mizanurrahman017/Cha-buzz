import { createBrowserRouter } from "react-router";
import RootLayouts from "../Layout/RootLayouts";
import Home from "../Pages/Home/Home/Home";

export const router = createBrowserRouter([
  {
    path: "/",
    Component:RootLayouts,
    children:[
        {
            index:true,
            Component:Home,
        }
    ]
  },
]);