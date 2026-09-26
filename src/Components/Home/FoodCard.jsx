import React from "react";
import {
  FaStar,
  FaShoppingCart,
  FaBolt,
} from "react-icons/fa";
import { useNavigate } from "react-router";

import { useCart } from "../../Contexts/CartContext";
import { useLanguage } from "../../Context/LanguageContext";

const FoodCard = ({ food }) => {
  const navigate = useNavigate();

  const { addToCart } = useCart();
  const { t } = useLanguage();

  // =====================================================
  // ADD TO CART
  // =====================================================
  const handleAddToCart = () => {
    addToCart(food);
  };

  // =====================================================
  // BUY NOW
  // =====================================================
  const handleBuyNow = () => {
    addToCart(food);
    navigate("/cart");
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E2DED5] overflow-hidden shadow-[0_4px_15px_rgba(60,45,30,0.08)] hover:shadow-[0_8px_25px_rgba(60,45,30,0.14)] transition-all duration-300 group">

      {/* =====================================================
          FOOD IMAGE
      ===================================================== */}
      <div
        onClick={handleAddToCart}
        className="relative h-52 sm:h-56 overflow-hidden cursor-pointer"
        title="Click to add to cart"
      >

        <img
          src={food.image}
          alt={food.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* CATEGORY BADGE */}
        <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-[#3E2415] text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
          {food.category}
        </span>

        {/* IMAGE HOVER OVERLAY */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">

          <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/95 text-[#5A2E16] px-4 py-2 rounded-full text-xs sm:text-sm font-semibold shadow-lg">
            <FaShoppingCart className="inline mr-2" />
            {t("addToCart")}
          </div>

        </div>

      </div>

      {/* =====================================================
          FOOD INFORMATION
      ===================================================== */}
      <div className="p-4">

        {/* FOOD NAME */}
        <h3 className="text-base sm:text-lg font-bold text-[#252525] truncate">
          {food.name}
        </h3>

        {/* RATING */}
        {food.rating && (
          <div className="flex items-center gap-1 mt-2">

            <FaStar className="text-[#D4A94A] text-xs" />

            <span className="text-xs font-medium text-[#777267]">
              {food.rating}
            </span>

          </div>
        )}

        {/* PRICE */}
        <div className="mt-4">

          <p className="text-xs text-[#9A6A43]">
            {t("price")}
          </p>

          <p className="text-2xl font-extrabold text-[#252525]">
            Tk{food.price}
          </p>

        </div>

        {/* =====================================================
            ADD TO CART BUTTON
        ===================================================== */}
        <button
          type="button"
          onClick={handleAddToCart}
          className="w-full h-11 mt-4 rounded-lg border border-[#252525] bg-white text-[#252525] flex items-center justify-center gap-2 text-sm font-semibold hover:bg-[#252525] hover:text-white transition-all duration-300"
        >

          <FaShoppingCart />

          {t("addToCart")}

        </button>

        {/* =====================================================
            BUY NOW BUTTON
        ===================================================== */}
        <button
          type="button"
          onClick={handleBuyNow}
          className="w-full h-11 mt-2.5 rounded-lg bg-[#252525] text-white flex items-center justify-center gap-2 text-sm font-semibold hover:bg-[#3A3A3A] transition-all duration-300"
        >

          <FaBolt />

          {t("buyNow")}

        </button>

      </div>
    </div>
  );
};

export default FoodCard;