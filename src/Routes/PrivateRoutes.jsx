import React from "react";
import { Navigate } from "react-router";

import { useAuth } from "../Context/AuthContext";


const PrivateRoutes = ({ children }) => {

  const {
    user,
    loading,
  } = useAuth();


  // ======================================
  // AUTH LOADING
  // ======================================
  if (loading) {

    return (
      <div className="min-h-screen bg-[#F7F5EF] flex items-center justify-center">

        <div className="text-center">

          <span className="loading loading-spinner loading-lg text-[#252525]"></span>

          <p className="mt-3 text-sm text-[#8A806B]">
            Checking authentication...
          </p>

        </div>

      </div>
    );

  }


  // ======================================
  // USER NOT LOGGED IN
  // ======================================
  if (!user) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );

  }


  // ======================================
  // USER LOGGED IN
  // ======================================
  return children;

};


export default PrivateRoutes;