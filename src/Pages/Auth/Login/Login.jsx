import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { FaEnvelope, FaLock, FaSignInAlt } from "react-icons/fa";
import { useAuth } from "../../../Context/AuthContext";


const Login = () => {
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const user = await loginUser(
        formData.email,
        formData.password
      );

      console.log("Logged in user:", user);

      // AuthContext userRole update হতে একটু সময় লাগতে পারে।
      // তাই Firestore থেকে role এখানে সরাসরি check করছি।
      const { doc, getDoc } = await import("firebase/firestore");
      const { db } = await import("../../../Firebase/Firebase.config");

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();

        if (userData.role === "admin") {
          navigate("/admin/orders");
        } else if (userData.role === "waiter") {
          navigate("/waiter");
        } else {
          navigate("/");
        }
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error(error);

      if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/wrong-password" ||
        error.code === "auth/user-not-found"
      ) {
        setError("Email অথবা password ভুল হয়েছে।");
      } else if (error.code === "auth/invalid-email") {
        setError("সঠিক email address দিন।");
      } else if (error.code === "auth/too-many-requests") {
        setError("অনেকবার চেষ্টা করা হয়েছে। কিছুক্ষণ পরে আবার চেষ্টা করুন।");
      } else {
        setError("Login করা যাচ্ছে না। আবার চেষ্টা করুন।");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F5EF] flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-md">

        {/* Logo / Brand */}
        <div className="text-center mb-8">

          <Link
            to="/"
            className="inline-flex items-center justify-center"
          >
            <div className="w-14 h-14 rounded-full bg-[#252525] flex items-center justify-center">
              <span className="text-[#F7F5EF] text-xl font-black">
                CB
              </span>
            </div>
          </Link>

          <h1 className="mt-4 text-3xl font-extrabold text-[#252525]">
            Welcome Back
          </h1>

          <p className="mt-2 text-sm text-[#8A806B]">
            Sign in to your Cha Buzz account
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl border border-[#E4E0D7] shadow-[0_10px_40px_rgba(37,37,37,0.08)] p-6 sm:p-8">

          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-[#252525] mb-2">
                Email Address
              </label>

              <div className="relative">

                <FaEnvelope
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A806B]"
                  size={15}
                />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  className="w-full h-12 rounded-xl border border-[#D8D5CC] bg-[#FAF9F5] pl-11 pr-4 text-sm text-[#252525] outline-none focus:border-[#252525] focus:ring-2 focus:ring-[#252525]/10 transition"
                />

              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-[#252525] mb-2">
                Password
              </label>

              <div className="relative">

                <FaLock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A806B]"
                  size={15}
                />

                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  className="w-full h-12 rounded-xl border border-[#D8D5CC] bg-[#FAF9F5] pl-11 pr-4 text-sm text-[#252525] outline-none focus:border-[#252525] focus:ring-2 focus:ring-[#252525]/10 transition"
                />

              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-[#252525] text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#A08E65] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
            >

              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Signing in...
                </>
              ) : (
                <>
                  <FaSignInAlt size={14} />
                  Sign In
                </>
              )}

            </button>

          </form>

          {/* Register */}
          <div className="text-center mt-6 pt-6 border-t border-[#E4E0D7]">

            <p className="text-sm text-[#8A806B]">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-bold text-[#252525] hover:text-[#A08E65] transition"
              >
                Create Account
              </Link>
            </p>

          </div>

        </div>

        {/* Back Home */}
        <div className="text-center mt-5">
          <Link
            to="/"
            className="text-sm text-[#8A806B] hover:text-[#252525] transition"
          >
            ← Back to Cha Buzz
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;