import React, { useEffect, useState } from "react";

import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaSignInAlt,
} from "react-icons/fa";

import { useNavigate } from "react-router";

import { useAuth } from "../../../Context/AuthContext";
import { useLanguage } from "../../../Context/LanguageContext";

const Login = () => {
  const navigate = useNavigate();

  const {
    user,
    userRole,
    loading,
    loginUser,
  } = useAuth();

  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] =
    useState(false);

  const [loginLoading, setLoginLoading] =
    useState(false);

  const [error, setError] = useState("");

  // ======================================
  // IF ALREADY LOGGED IN
  // ======================================
  useEffect(() => {
    if (loading) return;

    if (user) {
      if (userRole === "admin") {
        navigate("/admin/orders", {
          replace: true,
        });
      }

      else if (userRole === "waiter") {
        navigate("/waiter", {
          replace: true,
        });
      }

      else {
        navigate("/", {
          replace: true,
        });
      }
    }
  }, [
    user,
    userRole,
    loading,
    navigate,
  ]);

  // ======================================
  // INPUT CHANGE
  // ======================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  // ======================================
  // LOGIN
  // ======================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const email =
      formData.email.trim();

    const password =
      formData.password;

    if (!email) {
      setError("Please enter your email.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoginLoading(true);

      const result = await loginUser(
        email,
        password
      );

      // ==================================
      // ROLE BASED REDIRECT
      // ==================================
      if (result.role === "admin") {
        navigate("/admin/orders", {
          replace: true,
        });
      }

      else if (result.role === "waiter") {
        navigate("/waiter", {
          replace: true,
        });
      }

      else {
        navigate("/", {
          replace: true,
        });
      }

    } catch (error) {
      console.error("Login error:", error);

      if (
        error.code ===
        "auth/invalid-credential"
      ) {
        setError(
          "Invalid email or password."
        );
      }

      else if (
        error.code ===
        "auth/user-not-found"
      ) {
        setError(
          "No account found with this email."
        );
      }

      else if (
        error.code ===
        "auth/wrong-password"
      ) {
        setError(
          "Incorrect password."
        );
      }

      else if (
        error.code ===
        "auth/invalid-email"
      ) {
        setError(
          "Please enter a valid email."
        );
      }

      else {
        setError(
          "Login failed. Please try again."
        );
      }

    } finally {
      setLoginLoading(false);
    }
  };

  // ======================================
  // LOADING
  // ======================================
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F3EC] flex items-center justify-center">

        <div className="text-center">

          <span className="loading loading-spinner loading-lg text-[#8B4F26]"></span>

          <p className="mt-3 text-sm text-[#8A806B]">
            Checking login...
          </p>

        </div>

      </div>
    );
  }

  // ======================================
  // LOGIN PAGE
  // ======================================
  return (
    <main className="min-h-screen bg-[#F7F3EC] flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-md">

        {/* Card */}
        <div className="bg-white rounded-3xl border border-[#E2D8CA] shadow-[0_10px_40px_rgba(90,60,30,0.10)] p-6 sm:p-8">

          {/* Logo */}
          <div className="text-center mb-7">

            <div className="w-20 h-20 mx-auto rounded-full overflow-hidden mb-4">

              <img
                src="/cha buzz logo.jpg"
                alt="Cha Buzz"
                className="w-full h-full object-contain"
              />

            </div>

            <h1 className="text-2xl font-extrabold text-[#5A2E16]">
              Welcome Back
            </h1>

            <p className="text-sm text-[#9A6A43] mt-2">
              Login to your Cha Buzz account
            </p>

          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Email */}
            <div>

              <label className="block text-sm font-semibold text-[#5A2E16] mb-2">
                Email Address
              </label>

              <div className="relative">

                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A96F3D]" />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  autoComplete="email"
                  className="w-full h-12 pl-11 pr-4 rounded-xl border border-[#DCCDBB] bg-[#FFFCF8] text-sm text-[#3E2415] outline-none focus:border-[#A96F3D] focus:ring-4 focus:ring-[#A96F3D]/10"
                />

              </div>

            </div>

            {/* Password */}
            <div>

              <label className="block text-sm font-semibold text-[#5A2E16] mb-2">
                Password
              </label>

              <div className="relative">

                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A96F3D]" />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="w-full h-12 pl-11 pr-12 rounded-xl border border-[#DCCDBB] bg-[#FFFCF8] text-sm text-[#3E2415] outline-none focus:border-[#A96F3D] focus:ring-4 focus:ring-[#A96F3D]/10"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (previous) =>
                        !previous
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9A6A43] hover:text-[#5A2E16]"
                >
                  {showPassword ? (
                    <FaEyeSlash />
                  ) : (
                    <FaEye />
                  )}
                </button>

              </div>

            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loginLoading}
              className="w-full h-12 rounded-xl bg-[#8B4F26] hover:bg-[#6B3D1F] disabled:bg-[#B8A18D] text-white font-semibold flex items-center justify-center gap-2 transition-all"
            >

              {loginLoading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Logging in...
                </>
              ) : (
                <>
                  <FaSignInAlt />
                  Login
                </>
              )}

            </button>

          </form>

        </div>

      </div>

    </main>
  );
};

export default Login;