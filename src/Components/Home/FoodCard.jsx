import React from "react";
import { FaShoppingCart, FaBolt, FaStar } from "react-icons/fa";

const FoodCard = ({ food }) => {
  const { name, price, rating, image } = food;

  const handleAddToCart = () => {
    console.log("Added to cart:", food);
  };

  const handleBuyNow = () => {
    console.log("Buy now:", food);
  };

  return (
    <div className="group bg-white border border-[#E5E1D8] rounded-xl p-3 shadow-sm hover:shadow-lg transition-all duration-300">

      {/* Image */}
      <div className="relative overflow-hidden rounded-lg bg-[#F1EFE9]">
        <img
          src={image}
          alt={name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Rating */}
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/95 px-2.5 py-1 rounded-full shadow-sm">
          <FaStar className="text-[#C19A55] text-xs" />
          <span className="text-xs font-semibold text-[#252525]">
            {rating}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="pt-4 px-1">

        {/* Price */}
        <p className="text-lg font-bold text-[#252525]">
          Tk {price}
        </p>

        {/* Name */}
        <h3 className="mt-1 text-sm sm:text-base font-medium text-[#252525] min-h-[48px]">
          {name}
        </h3>

        {/* Buttons */}
        <div className="mt-3 space-y-2">

          <button
            onClick={handleAddToCart}
            className="w-full h-10 rounded-lg border border-[#252525] text-[#252525] text-sm font-medium flex items-center justify-center gap-2 hover:bg-[#252525] hover:text-white transition-all"
          >
            <FaShoppingCart className="text-xs" />
            Add to cart
          </button>

          <button
            onClick={handleBuyNow}
            className="w-full h-10 rounded-lg bg-[#252525] text-white text-sm font-medium flex items-center justify-center gap-2 hover:bg-[#A08E65] transition-all"
          >
            <FaBolt className="text-xs" />
            Buy now
          </button>

        </div>
      </div>
    </div>
  );
};

export default FoodCard;