import React, { useEffect, useRef, useState } from "react";
import { FaSearch, FaShoppingCart } from "react-icons/fa";
import { Link, useNavigate } from "react-router";

import { useCart } from "../../../Contexts/CartContext";
import { useLanguage } from "../../../Context/LanguageContext";

import foods from "../../../Data/foods";

const NavBar = () => {
  const [search, setSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const searchRef = useRef(null);

  const { cartCount } = useCart();
  const { language, isBangla, toggleLanguage, t } = useLanguage();

  const navigate = useNavigate();

  // =====================================================
  // Live Search Suggestions
  // =====================================================
  const suggestions = search.trim()
    ? foods
        .filter((food) => {
          const searchValue = search.toLowerCase().trim();

          const foodName =
            food.name?.toLowerCase() || "";

          const foodCategory =
            food.category?.toLowerCase() || "";

          return (
            foodName.includes(searchValue) ||
            foodCategory.includes(searchValue)
          );
        })
        .slice(0, 6)
    : [];

  // =====================================================
  // Search Input
  // =====================================================
  const handleSearch = (e) => {
    const value = e.target.value;

    setSearch(value);

    if (value.trim()) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  // =====================================================
  // Search Submit
  // =====================================================
  const handleSearchSubmit = (e) => {
    e.preventDefault();

    const searchValue = search.trim();

    if (!searchValue) {
      navigate("/");
      setShowSuggestions(false);
      return;
    }

    navigate(
      `/?search=${encodeURIComponent(searchValue)}`
    );

    setShowSuggestions(false);
  };

  // =====================================================
  // Suggestion Click
  // =====================================================
  const handleSuggestionClick = (food) => {
    setSearch(food.name);

    navigate(
      `/?search=${encodeURIComponent(food.name)}`
    );

    setShowSuggestions(false);
  };

  // =====================================================
  // Close suggestion when clicking outside
  // =====================================================
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-[#F7F3EC] border-b border-[#E2D8CA] shadow-[0_2px_12px_rgba(90,60,30,0.08)]">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* =====================================================
            Main Navbar
        ===================================================== */}
        <div className="min-h-20 flex items-center justify-between gap-4">

          {/* =====================================================
              Logo
          ===================================================== */}
          <Link
            to="/"
            className="flex items-center gap-3 shrink-0 group"
          >
            <div className="w-14 h-14 flex items-center justify-center rounded-full overflow-hidden">

              <img
                src="/cha buzz logo.jpg"
                alt="Cha Buzz Logo"
                className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
              />

            </div>

            <div className="hidden xs:block sm:block">

              <h1 className="text-xl sm:text-2xl font-extrabold tracking-wide text-[#5A2E16]">
                CHAA BUZZ
              </h1>

              <p className="text-[10px] sm:text-xs tracking-[0.25em] text-[#9A6A43] font-medium">
                {t("teaAndFood")}
              </p>

            </div>
          </Link>

          {/* =====================================================
              Desktop Search
          ===================================================== */}
          <div
            ref={searchRef}
            className="hidden sm:block flex-1 max-w-lg relative"
          >

            <form onSubmit={handleSearchSubmit}>

              <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-[#9A6A43] text-sm z-10" />

              <input
                type="text"
                value={search}
                onChange={handleSearch}
                onFocus={() => {
                  if (search.trim()) {
                    setShowSuggestions(true);
                  }
                }}
                placeholder={t("searchFood")}
                autoComplete="off"
                className="w-full h-12 pl-12 pr-5 rounded-full border border-[#DCCDBB] bg-white/90 text-sm text-[#3E2415] placeholder:text-[#A89787] outline-none transition-all duration-300 focus:border-[#A96F3D] focus:ring-4 focus:ring-[#A96F3D]/10 focus:bg-white"
              />

            </form>

            {/* =====================================================
                Desktop Suggestions
            ===================================================== */}
            {showSuggestions && search.trim() && (
              <div className="absolute top-[58px] left-0 right-0 bg-white rounded-2xl border border-[#E2D8CA] shadow-xl overflow-hidden z-[100]">

                {suggestions.length > 0 ? (
                  <div className="py-2">

                    {suggestions.map((food) => (
                      <button
                        key={food.id}
                        type="button"
                        onClick={() =>
                          handleSuggestionClick(food)
                        }
                        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[#F7F3EC] transition-colors"
                      >

                        {/* Food Image */}
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#F3F2F0] shrink-0">

                          <img
                            src={food.image}
                            alt={food.name}
                            className="w-full h-full object-cover"
                          />

                        </div>

                        {/* Food Info */}
                        <div className="flex-1 min-w-0">

                          <p className="font-semibold text-sm text-[#3E2415] truncate">
                            {food.name}
                          </p>

                          <p className="text-xs text-[#9A6A43] mt-1">
                            {food.category}
                          </p>

                        </div>

                        {/* Price */}
                        <div className="font-bold text-sm text-[#8B4F26] shrink-0">
                          ৳{food.price}
                        </div>

                      </button>
                    ))}

                  </div>
                ) : (
                  <div className="px-5 py-6 text-center">

                    <div className="text-3xl mb-2">
                      🔍
                    </div>

                    <p className="text-sm font-medium text-[#5A2E16]">
                      No food found
                    </p>

                    <p className="text-xs text-[#9A6A43] mt-1">
                      Try another food name
                    </p>

                  </div>
                )}

              </div>
            )}

          </div>

          {/* =====================================================
              Right Side
          ===================================================== */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Mobile Search Icon */}
            <button
              type="button"
              onClick={() => {
                const input =
                  document.getElementById(
                    "mobile-food-search"
                  );

                input?.focus();
              }}
              className="sm:hidden w-10 h-10 rounded-full border border-[#DCCDBB] bg-white/70 flex items-center justify-center text-[#6B3D1F] hover:bg-[#6B3D1F] hover:text-white transition-all"
              title={t("searchFood")}
            >
              <FaSearch className="text-sm" />
            </button>

            {/* Language */}
            <button
              onClick={toggleLanguage}
              className="h-10 px-3 sm:px-4 rounded-full border border-[#DCCDBB] bg-white/70 text-xs sm:text-sm font-semibold text-[#5A2E16] hover:border-[#A96F3D] hover:bg-white transition-all flex items-center gap-2"
            >

              <span
                className={
                  language === "en"
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
                  language === "bn"
                    ? "text-[#8B4F26] font-bold"
                    : "text-[#A89787]"
                }
              >
                বাংলা
              </span>

            </button>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#8B4F26] text-[#FFF9F2] flex items-center justify-center shadow-md hover:bg-[#6B3D1F] hover:scale-105 transition-all duration-300"
              title={t("cart")}
            >

              <FaShoppingCart className="text-sm sm:text-base" />

              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-[#C58A52] text-white text-[10px] font-bold border-2 border-[#F7F3EC] flex items-center justify-center">
                  {cartCount}
                </span>
              )}

            </Link>

          </div>
        </div>

        {/* =====================================================
            Mobile Search
        ===================================================== */}
        <div
          ref={searchRef}
          className="sm:hidden pb-4 relative"
        >

          <form onSubmit={handleSearchSubmit}>

            <div className="relative">

              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9A6A43] text-sm z-10" />

              <input
                id="mobile-food-search"
                type="text"
                value={search}
                onChange={handleSearch}
                onFocus={() => {
                  if (search.trim()) {
                    setShowSuggestions(true);
                  }
                }}
                placeholder={t("searchFood")}
                autoComplete="off"
                className="w-full h-11 pl-11 pr-4 rounded-full border border-[#DCCDBB] bg-white text-sm text-[#3E2415] placeholder:text-[#A89787] outline-none transition-all focus:border-[#A96F3D] focus:ring-4 focus:ring-[#A96F3D]/10"
              />

            </div>

          </form>

          {/* Mobile Suggestions */}
          {showSuggestions && search.trim() && (
            <div className="absolute top-[52px] left-0 right-0 bg-white rounded-2xl border border-[#E2D8CA] shadow-xl overflow-hidden z-[100]">

              {suggestions.length > 0 ? (
                <div className="py-2">

                  {suggestions.map((food) => (
                    <button
                      key={food.id}
                      type="button"
                      onClick={() =>
                        handleSuggestionClick(food)
                      }
                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[#F7F3EC] transition-colors"
                    >

                      <div className="w-11 h-11 rounded-xl overflow-hidden bg-[#F3F2F0] shrink-0">

                        <img
                          src={food.image}
                          alt={food.name}
                          className="w-full h-full object-cover"
                        />

                      </div>

                      <div className="flex-1 min-w-0">

                        <p className="font-semibold text-sm text-[#3E2415] truncate">
                          {food.name}
                        </p>

                        <p className="text-xs text-[#9A6A43]">
                          {food.category}
                        </p>

                      </div>

                      <span className="font-bold text-sm text-[#8B4F26]">
                        ৳{food.price}
                      </span>

                    </button>
                  ))}

                </div>
              ) : (
                <div className="px-5 py-5 text-center">

                  <p className="text-sm font-medium text-[#5A2E16]">
                    No food found
                  </p>

                </div>
              )}

            </div>
          )}

        </div>

      </div>
    </nav>
  );
};

export default NavBar;