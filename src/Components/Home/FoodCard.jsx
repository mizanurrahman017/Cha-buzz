import React from "react";
import {
  FaShoppingCart,
  FaBolt,
} from "react-icons/fa";
import { useNavigate } from "react-router";
import { useCart } from "../../Contexts/CartContext";

const FoodCard = ({ food }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // =========================
  // Add To Cart
  // =========================
  const handleAddToCart = () => {
    addToCart(food);
    navigate("/cart");
  };

  // =========================
  // Buy Now
  // =========================
  const handleBuyNow = () => {
    addToCart(food);
    navigate("/cart");
  };

  return (
    <div
      className="
        group
        bg-white
        rounded-2xl
        overflow-hidden
        border
        border-[#E4E0D7]
        shadow-[0_3px_15px_rgba(37,37,37,0.06)]
        hover:shadow-[0_8px_25px_rgba(37,37,37,0.12)]
        hover:-translate-y-1
        transition-all
        duration-300
        h-full
      "
    >
      {/* ========================= */}
      {/* IMAGE */}
      {/* ========================= */}

      <div className="relative h-40 sm:h-48 lg:h-52 overflow-hidden">

        <img
          src={food.image}
          alt={food.name}
          className="
            w-full
            h-full
            object-cover
            group-hover:scale-105
            transition-transform
            duration-500
          "
        />

        {/* Image Overlay */}

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-t
            from-black/25
            via-transparent
            to-transparent
            pointer-events-none
          "
        />

        {/* Category Badge */}

        <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3">
          <span
            className="
              inline-flex
              items-center
              px-2
              py-1
              rounded-full
              bg-white/95
              backdrop-blur-sm
              text-[9px]
              sm:text-[10px]
              font-bold
              tracking-wide
              text-[#252525]
              shadow-sm
            "
          >
            {food.category}
          </span>
        </div>
      </div>

      {/* ========================= */}
      {/* CONTENT */}
      {/* ========================= */}

      <div className="p-3 sm:p-4">

        {/* Food Name */}

        <h3
          className="
            text-[14px]
            sm:text-[17px]
            font-bold
            leading-snug
            text-[#252525]
            min-h-[40px]
            sm:min-h-[48px]
            line-clamp-2
          "
        >
          {food.name}
        </h3>

        {/* ========================= */}
        {/* PRICE */}
        {/* ========================= */}

        <div className="mt-2 sm:mt-3 mb-4">

          <p className="text-[11px] sm:text-xs text-[#8A806B] mb-1">
            Price
          </p>

          <p
            className="
              text-2xl
              
              font-bold
              leading-none
              text-[#252525]
            "
          >
            Tk{food.price}
          </p>

        </div>

        {/* ========================= */}
        {/* BUTTONS */}
        {/* ========================= */}

        <div className="space-y-2.5">

          {/* ADD TO CART */}

          <button
            onClick={handleAddToCart}
            className="
              w-full
              h-10
              sm:h-11
              rounded-lg
              border
              border-[#252525]
              bg-white
              text-[#252525]
              font-semibold
              text-xs
              sm:text-sm
              flex
              items-center
              justify-center
              gap-2
              hover:bg-[#252525]
              hover:text-white
              active:scale-[0.98]
              transition-all
              duration-200
            "
          >
            <FaShoppingCart size={13} />

            Add to Cart
          </button>

          {/* BUY NOW */}

          <button
            onClick={handleBuyNow}
            className="
              w-full
              h-10
              sm:h-11
              rounded-lg
              bg-[#252525]
              text-white
              font-semibold
              text-xs
              sm:text-sm
              flex
              items-center
              justify-center
              gap-2
              hover:bg-[#A08E65]
              active:scale-[0.98]
              transition-all
              duration-200
              shadow-sm
            "
          >
            <FaBolt size={12} />

            Buy Now
          </button>

        </div>

      </div>
    </div>
  );
};

export default FoodCard;