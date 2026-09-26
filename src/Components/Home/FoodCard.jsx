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
  // ADD TO CART + FLY ANIMATION
  // =====================================================
  const handleAddToCart = (event) => {
    // First add food to cart
    addToCart(food);

    // Get clicked image/card element
    const imageContainer =
      event.currentTarget.closest("[data-food-image]");

    // Get navbar cart
    const cartElement =
      document.getElementById("navbar-cart");

    if (!imageContainer || !cartElement) return;

    // Get positions
    const imageRect =
      imageContainer.getBoundingClientRect();

    const cartRect =
      cartElement.getBoundingClientRect();

    // Create flying image
    const flyingImage =
      document.createElement("img");

    flyingImage.src = food.image;
    flyingImage.alt = food.name;

    // Starting position
    flyingImage.style.position = "fixed";
    flyingImage.style.left = `${imageRect.left}px`;
    flyingImage.style.top = `${imageRect.top}px`;

    flyingImage.style.width = `${imageRect.width}px`;
    flyingImage.style.height = `${imageRect.height}px`;

    flyingImage.style.objectFit = "cover";
    flyingImage.style.borderRadius = "16px";

    flyingImage.style.zIndex = "9999";
    flyingImage.style.pointerEvents = "none";

    flyingImage.style.boxShadow =
      "0 10px 30px rgba(0,0,0,0.25)";

    flyingImage.style.transition =
      "all 700ms cubic-bezier(0.4, 0, 0.2, 1)";

    document.body.appendChild(flyingImage);

    // Force browser to render starting position
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        flyingImage.style.left = `${
          cartRect.left + cartRect.width / 2 - 20
        }px`;

        flyingImage.style.top = `${
          cartRect.top + cartRect.height / 2 - 20
        }px`;

        flyingImage.style.width = "40px";
        flyingImage.style.height = "40px";

        flyingImage.style.borderRadius = "50%";

        flyingImage.style.opacity = "0.3";

        flyingImage.style.transform =
          "scale(0.5) rotate(10deg)";
      });
    });

    // Remove animation image after animation
    setTimeout(() => {
      flyingImage.remove();

      // Small cart bounce
      cartElement.classList.add(
        "scale-125"
      );

      setTimeout(() => {
        cartElement.classList.remove(
          "scale-125"
        );
      }, 180);
    }, 750);
  };

  // =====================================================
  // BUY NOW
  // =====================================================
  const handleBuyNow = (event) => {
    addToCart(food);

    navigate("/cart");
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E2DED5] overflow-hidden shadow-[0_4px_15px_rgba(60,45,30,0.08)] hover:shadow-[0_8px_25px_rgba(60,45,30,0.14)] transition-all duration-300 group">

      {/* =====================================================
          FOOD IMAGE
      ===================================================== */}
      <div
        data-food-image
        onClick={handleAddToCart}
        className="relative h-52 sm:h-56 overflow-hidden cursor-pointer"
        title="Click to add to cart"
      >

        <img
          src={food.image}
          alt={food.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* CATEGORY */}
        <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-[#3E2415] text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
          {food.category}
        </span>

        {/* HOVER */}
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
            BUY NOW
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