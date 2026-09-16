import React, { useState } from "react";
import {
  FaSearch,
  FaShoppingCart,
} from "react-icons/fa";
import { Link } from "react-router";
import { useCart } from "../../../Contexts/CartContext";

const NavBar = () => {
  const [search, setSearch] = useState("");
  const [language, setLanguage] = useState("EN");

  const { cartCount } = useCart();

  const isBangla = language === "BN";

  const handleSearch = (e) => {
    setSearch(e.target.value);

    // পরে Home-এর food search-এর সাথে connect করতে পারবে
    console.log("Search:", e.target.value);
  };

  const toggleLanguage = () => {
    setLanguage(isBangla ? "EN" : "BN");
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#F7F3EC] border-b border-[#E2D8CA] shadow-[0_2px_12px_rgba(90,60,30,0.08)]">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ================= MAIN NAVBAR ================= */}
        <div className="min-h-20 flex items-center justify-between gap-4">

          {/* ================= LOGO ================= */}
          <Link
            to="/"
            className="flex items-center gap-3 shrink-0 group"
          >
            {/* Logo */}
            <div className="w-14 h-14 flex items-center rounded-full justify-center overflow-hidden">
              <img
                src="/cha buzz logo.jpg"
                alt="Chaa Buzz Logo"
                className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            {/* Brand Name */}
            <div className="hidden xs:block sm:block">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-wide text-[#5A2E16]">
                CHAA BUZZ
              </h1>

              <p className="text-[10px] sm:text-xs tracking-[0.25em] text-[#9A6A43] font-medium">
                TEA & FOOD
              </p>
            </div>
          </Link>

          {/* ================= DESKTOP SEARCH ================= */}
          <div className="hidden sm:flex flex-1 max-w-lg relative">

            <FaSearch
              className="
                absolute
                left-5
                top-1/2
                -translate-y-1/2
                text-[#9A6A43]
                text-sm
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
                h-12
                pl-12
                pr-5
                rounded-full
                border
                border-[#DCCDBB]
                bg-white/80
                text-sm
                text-[#3E2415]
                placeholder:text-[#A89787]
                outline-none
                transition-all
                duration-300
                focus:border-[#A96F3D]
                focus:ring-4
                focus:ring-[#A96F3D]/10
                focus:bg-white
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
                border-[#DCCDBB]
                bg-white/70
                flex
                items-center
                justify-center
                text-[#6B3D1F]
                hover:bg-[#6B3D1F]
                hover:text-white
                transition-all
              "
              title={isBangla ? "খুঁজুন" : "Search"}
            >
              <FaSearch className="text-sm" />
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
                border-[#DCCDBB]
                bg-white/70
                text-xs
                sm:text-sm
                font-semibold
                text-[#5A2E16]
                hover:border-[#A96F3D]
                hover:bg-white
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
              <span
                className={
                  !isBangla
                    ? "text-[#8B4F26] font-bold"
                    : "text-[#A89787]"
                }
              >
                EN
              </span>

              <span className="text-[#D1C1AF]">
                |
              </span>

              <span
                className={
                  isBangla
                    ? "text-[#8B4F26] font-bold"
                    : "text-[#A89787]"
                }
              >
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
                bg-[#8B4F26]
                text-[#FFF9F2]
                flex
                items-center
                justify-center
                shadow-md
                hover:bg-[#6B3D1F]
                hover:scale-105
                transition-all
                duration-300
              "
              title={isBangla ? "কার্ট" : "Cart"}
            >
              <FaShoppingCart className="text-sm sm:text-base" />

              {/* Cart Count */}
              {cartCount > 0 && (
                <span
                  className="
                    absolute
                    -top-1
                    -right-1
                    min-w-5
                    h-5
                    px-1
                    rounded-full
                    bg-[#C58A52]
                    text-white
                    text-[10px]
                    font-bold
                    border-2
                    border-[#F7F3EC]
                    flex
                    items-center
                    justify-center
                  "
                >
                  {cartCount}
                </span>
              )}
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
                text-[#9A6A43]
                text-sm
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
                border-[#DCCDBB]
                bg-white
                text-sm
                text-[#3E2415]
                placeholder:text-[#A89787]
                outline-none
                transition-all
                focus:border-[#A96F3D]
                focus:ring-4
                focus:ring-[#A96F3D]/10
              "
            />

          </div>
        </div>

      </div>
    </nav>
  );
};

export default NavBar;