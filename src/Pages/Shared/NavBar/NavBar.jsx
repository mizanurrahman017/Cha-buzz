import React, { useState } from "react";
import {
  FaSearch,
  FaShoppingCart,
  FaCoffee,
} from "react-icons/fa";
import { Link } from "react-router";
import { useCart } from "../../../Contexts/CartContext";

const NavBar = () => {
  const [search, setSearch] = useState("");
  const [language, setLanguage] = useState("EN");

  // CartContext থেকে cartCount নিচ্ছি
  const { cartCount } = useCart();

  const isBangla = language === "BN";

  const handleSearch = (e) => {
    setSearch(e.target.value);

    // পরে Home-এর food search-এর সাথে connect করবো
    console.log("Search:", e.target.value);
  };

  const toggleLanguage = () => {
    setLanguage(isBangla ? "EN" : "BN");
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#F7F5EF] border-b border-[#D8D5CC] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="min-h-20 flex items-center justify-between gap-4">

          {/* ================= LOGO ================= */}
          <Link
            to="/"
            className="flex items-center gap-3 shrink-0"
          >
            <div className="w-11 h-11 rounded-full bg-[#252525] text-[#F7F5EF] flex items-center justify-center">
              <FaCoffee className="text-lg" />
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-wider text-[#252525]">
                CHA BUZZ
              </h1>

              <p className="text-[9px] sm:text-[10px] tracking-[0.2em] text-[#8A806B]">
                {isBangla
                  ? "ক্যাফে ও রেস্টুরেন্ট"
                  : "CAFE & RESTAURANT"}
              </p>
            </div>
          </Link>

          {/* ================= SEARCH ================= */}
          <div className="hidden sm:flex flex-1 max-w-md relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A806B]" />

            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder={
                isBangla
                  ? "মেনুতে খাবার খুঁজুন..."
                  : "Search food..."
              }
              className="
                w-full
                h-11
                pl-11
                pr-4
                rounded-full
                border
                border-[#D8D5CC]
                bg-white/80
                text-sm
                text-[#252525]
                placeholder:text-[#9A968B]
                outline-none
                focus:border-[#A08E65]
                focus:ring-2
                focus:ring-[#A08E65]/20
                transition-all
              "
            />
          </div>

          {/* ================= RIGHT SIDE ================= */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* ================= MOBILE SEARCH ================= */}
            <button
              className="
                sm:hidden
                w-10
                h-10
                rounded-full
                border
                border-[#D8D5CC]
                flex
                items-center
                justify-center
                text-[#252525]
                hover:text-[#A08E65]
                transition
              "
              title={isBangla ? "খুঁজুন" : "Search"}
            >
              <FaSearch />
            </button>

            {/* ================= LANGUAGE ================= */}
            <button
              onClick={toggleLanguage}
              className="
                h-10
                px-3
                sm:px-4
                rounded-full
                border
                border-[#D8D5CC]
                bg-white/60
                text-sm
                font-semibold
                text-[#252525]
                hover:border-[#A08E65]
                hover:text-[#A08E65]
                transition-all
                flex
                items-center
                gap-2
              "
              title={
                isBangla
                  ? "Switch to English"
                  : "বাংলায় পরিবর্তন করুন"
              }
            >
              <span className={!isBangla ? "text-[#A08E65]" : ""}>
                EN
              </span>

              <span className="text-[#C3BFB4]">|</span>

              <span className={isBangla ? "text-[#A08E65]" : ""}>
                বাংলা
              </span>
            </button>

            {/* ================= CART ================= */}
            <Link
              to="/cart"
              className="
                relative
                w-10
                h-10
                sm:w-11
                sm:h-11
                rounded-full
                bg-[#252525]
                text-[#F7F5EF]
                flex
                items-center
                justify-center
                hover:bg-[#A08E65]
                transition-all
              "
              title={isBangla ? "কার্ট" : "Cart"}
            >
              <FaShoppingCart className="text-sm sm:text-base" />

              {/* Dynamic Cart Count */}
              <span
                className="
                  absolute
                  -top-1
                  -right-1
                  min-w-5
                  h-5
                  px-1
                  rounded-full
                  bg-[#A08E65]
                  text-white
                  text-[10px]
                  font-bold
                  flex
                  items-center
                  justify-center
                "
              >
                {cartCount}
              </span>
            </Link>

          </div>
        </div>

        {/* ================= MOBILE SEARCH ================= */}
        <div className="sm:hidden pb-4">
          <div className="relative">

            <FaSearch
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-[#8A806B]
              "
            />

            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder={
                isBangla
                  ? "মেনুতে খাবার খুঁজুন..."
                  : "Search food..."
              }
              className="
                w-full
                h-11
                pl-11
                pr-4
                rounded-full
                border
                border-[#D8D5CC]
                bg-white
                text-sm
                text-[#252525]
                placeholder:text-[#9A968B]
                outline-none
                focus:border-[#A08E65]
                focus:ring-2
                focus:ring-[#A08E65]/20
                transition-all
              "
            />

          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;