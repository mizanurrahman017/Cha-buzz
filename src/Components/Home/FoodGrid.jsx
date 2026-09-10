import React from "react";
import FoodCard from "./FoodCard";

const FoodGrid = ({ foods }) => {
  if (foods.length === 0) {
    return (
      <div className="bg-white border border-[#E2DED5] rounded-xl p-12 text-center">
        <h2 className="text-xl font-semibold text-[#252525]">
          No food found
        </h2>

        <p className="mt-2 text-sm text-[#777267]">
          Try another search or category.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
      {foods.map((food) => (
        <FoodCard key={food.id} food={food} />
      ))}
    </div>
  );
};

export default FoodGrid;