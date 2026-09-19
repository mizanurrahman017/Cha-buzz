import React, { useMemo, useState } from "react";
import { useSearchParams } from "react-router";

import foods from "../../../Data/foods";
import CategorySidebar from "../../../Components/Home/CategorySidebar";
import FoodGrid from "../../../Components/Home/FoodGrid";
import { useLanguage } from "../../../Context/LanguageContext";

const Home = () => {
  const [searchParams] = useSearchParams();

  // Navbar search থেকে search value আসবে
  const navbarSearch = searchParams.get("search") || "";

  const [activeCategory, setActiveCategory] =
    useState("All Products");

  const [sortBy, setSortBy] = useState("default");

  const { t } = useLanguage();

  // =====================================================
  // Filter Foods
  // =====================================================
  const filteredFoods = useMemo(() => {
    let result = [...foods];

    // Category filter
    if (activeCategory !== "All Products") {
      result = result.filter(
        (food) => food.category === activeCategory
      );
    }

    // Navbar Search filter
    if (navbarSearch.trim() !== "") {
      const searchValue = navbarSearch
        .toLowerCase()
        .trim();

      result = result.filter((food) => {
        const foodName =
          food.name?.toLowerCase() || "";

        const foodCategory =
          food.category?.toLowerCase() || "";

        return (
          foodName.includes(searchValue) ||
          foodCategory.includes(searchValue)
        );
      });
    }

    // Price low → high
    if (sortBy === "price-low") {
      result.sort(
        (a, b) => Number(a.price) - Number(b.price)
      );
    }

    // Price high → low
    if (sortBy === "price-high") {
      result.sort(
        (a, b) => Number(b.price) - Number(a.price)
      );
    }

    // Rating
    if (sortBy === "rating") {
      result.sort(
        (a, b) => Number(b.rating) - Number(a.rating)
      );
    }

    return result;
  }, [
    activeCategory,
    navbarSearch,
    sortBy,
  ]);

  return (
    <main className="min-h-screen bg-[#F3F2F0]">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* =====================================================
            Header
        ===================================================== */}
        <div className="bg-white border border-[#E2DED5] rounded-xl p-4 mb-5">

          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">

            {/* Title */}
            <div className="w-full md:w-auto">

              <h1 className="text-xl sm:text-2xl font-bold text-[#252525]">
                {t("allProducts")}
              </h1>

              <p className="text-sm text-[#777267] mt-1">
                {t("exploreFoodDrinks")}
              </p>

            </div>

            {/* Sort */}
            <div className="w-full md:w-auto flex items-center gap-2">

              <label className="text-sm text-[#777267] whitespace-nowrap">
                {t("sortBy")}
              </label>

              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value)
                }
                className="h-11 px-4 rounded-lg border border-[#D8D5CC] bg-white text-sm text-[#252525] outline-none focus:border-[#A08E65] cursor-pointer"
              >
                <option value="default">
                  {t("default")}
                </option>

                <option value="price-low">
                  {t("priceLowHigh")}
                </option>

                <option value="price-high">
                  {t("priceHighLow")}
                </option>

                <option value="rating">
                  {t("highestRated")}
                </option>
              </select>

            </div>

          </div>
        </div>

        {/* =====================================================
            Main Content
        ===================================================== */}
        <div className="flex flex-col lg:flex-row gap-5">

          {/* Category */}
          <CategorySidebar
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
          />

          {/* Foods */}
          <section className="flex-1 min-w-0">

            <div className="flex items-center justify-between mb-4">

              <div>

                <h2 className="text-lg font-semibold text-[#252525]">

                  {activeCategory === "All Products"
                    ? t("allProducts")
                    : activeCategory}

                </h2>

                <p className="text-xs text-[#777267] mt-1">
                  {filteredFoods.length}{" "}
                  {t("itemsAvailable")}
                </p>

              </div>

            </div>

            {/* Food Grid */}
            {filteredFoods.length > 0 ? (
              <FoodGrid foods={filteredFoods} />
            ) : (
              <div className="bg-white rounded-xl border border-[#E2DED5] p-10 text-center">

                <div className="text-5xl mb-4">
                  🔍
                </div>

                <h3 className="text-xl font-bold text-[#252525]">
                  {t("noFoodFound") ||
                    "No food found"}
                </h3>

                <p className="text-sm text-[#777267] mt-2">
                  {t("tryAnotherSearch") ||
                    "Try searching for another food."}
                </p>

              </div>
            )}

          </section>

        </div>
      </div>
    </main>
  );
};

export default Home;