
import React from "react";
import {
  FaStar,
  FaShoppingCart,
  FaBolt,
} from "react-icons/fa";
import { useNavigate } from "react-router";

import { useCart } from "../../Contexts/CartContext";
import { useLanguage } from "../../Context/LanguageContext";
import { getProductPricing } from "../../Utils/productPricing";

const FoodCard = ({ food }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { t } = useLanguage();

  const pricing = getProductPricing(food);

  const handleAddToCart = (event) => {
    // Add the product to cart.
    addToCart(food);

    const imageContainer =
      event.currentTarget.closest("[data-food-image]");

    const cartElement =
      document.getElementById("navbar-cart");

    if (!imageContainer || !cartElement) return;

    const imageRect = imageContainer.getBoundingClientRect();
    const cartRect = cartElement.getBoundingClientRect();

    const flyingImage = document.createElement("img");
    flyingImage.src = food.image;
    flyingImage.alt = food.name;

    Object.assign(flyingImage.style, {
      position: "fixed",
      left: `${imageRect.left}px`,
      top: `${imageRect.top}px`,
      width: `${imageRect.width}px`,
      height: `${imageRect.height}px`,
      objectFit: "cover",
      borderRadius: "16px",
      zIndex: "9999",
      pointerEvents: "none",
      boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
      transition: "all 700ms cubic-bezier(0.4, 0, 0.2, 1)",
    });

    document.body.appendChild(flyingImage);

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
        flyingImage.style.transform = "scale(0.5) rotate(10deg)";
      });
    });

    setTimeout(() => {
      flyingImage.remove();
      cartElement.classList.add("scale-125");

      setTimeout(() => {
        cartElement.classList.remove("scale-125");
      }, 180);
    }, 750);
  };

  const handleBuyNow = () => {
    addToCart(food);
    navigate("/cart");
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E2DED5] overflow-hidden shadow-[0_4px_15px_rgba(60,45,30,0.08)] hover:shadow-[0_8px_25px_rgba(60,45,30,0.14)] transition-all duration-300 group">
      {/* FOOD IMAGE */}
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

        <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-[#3E2415] text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
          {food.category}
        </span>

        {pricing.hasDiscount && (
          <span className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
            {food.discountType === "percentage"
              ? `${Number(food.discountValue)}% OFF`
              : `৳${pricing.discountPerItem} OFF`}
          </span>
        )}

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/95 text-[#5A2E16] px-4 py-2 rounded-full text-xs sm:text-sm font-semibold shadow-lg">
            <FaShoppingCart className="inline mr-2" />
            {t("addToCart")}
          </div>
        </div>
      </div>

      {/* FOOD INFORMATION */}
      <div className="p-4">
        <h3 className="text-base sm:text-lg font-bold text-[#252525] truncate">
          {food.name}
        </h3>

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

          {pricing.hasDiscount ? (
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-lg text-gray-400 line-through">
                ৳{pricing.regularPrice}
              </span>

              <span className="text-2xl font-extrabold text-green-700">
                ৳{pricing.discountedPrice}
              </span>
            </div>
          ) : (
            <p className="text-2xl font-extrabold text-[#252525]">
              ৳{pricing.regularPrice}
            </p>
          )}
        </div>

        {/* ADD TO CART */}
        <button
          type="button"
          onClick={handleAddToCart}
          className="w-full h-11 mt-4 rounded-lg border border-[#252525] bg-white text-[#252525] flex items-center justify-center gap-2 text-sm font-semibold hover:bg-[#252525] hover:text-white transition-all duration-300"
        >
          <FaShoppingCart />
          {t("addToCart")}
        </button>

        {/* BUY NOW */}
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