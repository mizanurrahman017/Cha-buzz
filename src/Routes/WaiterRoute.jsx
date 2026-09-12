import React from "react";
import { Navigate } from "react-router";

import { useAuth } from "../Context/AuthContext";

const WaiterRoute = ({ children }) => {
  const { user, userRole, loading } = useAuth();

  // Firebase auth check চলাকালীন
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F5EF] flex items-center justify-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-[#252525]"></span>

          <p className="mt-3 text-sm text-[#8A806B]">
            Checking access...
          </p>
        </div>
      </div>
    );
  }

  // Login করা নেই
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Login করা আছে কিন্তু waiter না
  if (userRole !== "waiter") {
    return <Navigate to="/" replace />;
  }

  // শুধু waiter ঢুকতে পারবে
  return children;
};

export default WaiterRoute;