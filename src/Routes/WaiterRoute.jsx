import React from "react";
import { Navigate } from "react-router";

import { useAuth } from "../Context/AuthContext";

const WaiterRoute = ({ children }) => {
  const {
    user,
    userRole,
    loading,
  } = useAuth();

  // ======================================
  // LOADING
  // ======================================
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F5EF] flex items-center justify-center">
        <div className="text-center">

          <span className="loading loading-spinner loading-lg text-[#8B4F26]"></span>

          <p className="mt-3 text-sm text-[#8A806B]">
            Checking waiter access...
          </p>

        </div>
      </div>
    );
  }

  // ======================================
  // NOT LOGGED IN
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
  // NOT WAITER
  // ======================================
  if (userRole !== "waiter") {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  // ======================================
  // WAITER
  // ======================================
  return children;
};

export default WaiterRoute;