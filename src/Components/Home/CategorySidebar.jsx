import React from "react";
import { useLanguage } from "../../Context/LanguageContext";

const categories = [
  "All Products",
  "Tea",
  "Coffee",
  "Cold Drinks",
  "Burger",
  "Pizza",
  "Chicken",
  "Pasta",
  "Sandwich",
  "Fries",
  "Desserts",
];

const categoryTranslationKeys = {
  "All Products": "allProducts",
  Tea: "tea",
  Coffee: "coffee",
  "Cold Drinks": "coldDrinks",
  Burger: "burger",
  Pizza: "pizza",
  Chicken: "chicken",
  Pasta: "pasta",
  Sandwich: "sandwich",
  Fries: "fries",
  Desserts: "desserts",
};

const CategorySidebar = ({
  activeCategory,
  setActiveCategory,
}) => {
  const { t } = useLanguage();

  return (
    <aside className="w-full lg:w-60 shrink-0">
      <div className="bg-white border border-[#E2DED5] rounded-xl overflow-hidden">

        {/* Heading */}
        <div className="px-5 py-4 border-b border-[#E2DED5]">
          <h2 className="text-sm font-semibold text-[#252525]">
            {t("categories")}
          </h2>
        </div>

        {/* Category Title */}
        <div className="px-5 py-3 bg-[#F0EEE8]">
          <h3 className="text-sm font-bold text-[#252525]">
            {t("categoryList")}
          </h3>
        </div>

        {/* Categories */}
        <div>
          {categories.map((category) => {
            const active = activeCategory === category;

            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`w-full text-left px-5 py-3 text-sm border-b border-[#E8E4DC] transition-all ${
                  active
                    ? "bg-[#E4E1DA] text-[#252525] font-semibold"
                    : "text-[#555147] hover:bg-[#F7F5EF] hover:text-[#A08E65]"
                }`}
              >
                {t(categoryTranslationKeys[category])}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};

export default CategorySidebar;