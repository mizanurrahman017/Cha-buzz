import React, { useMemo, useState } from "react";
import foods from "../../../Data/foods";
import CategorySidebar from "../../../Components/Home/CategorySidebar";
import FoodGrid from "../../../Components/Home/FoodGrid";
import { useLanguage } from "../../../Context/LanguageContext";

const Home = () => {
  const [activeCategory, setActiveCategory] = useState("All Products");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("default");

  // =========================
  // GLOBAL LANGUAGE
  // =========================

  const { t } = useLanguage();

  const filteredFoods = useMemo(() => {
    let result = [...foods];

    // =========================
    // CATEGORY FILTER
    // =========================

    if (activeCategory !== "All Products") {
      result = result.filter(
        (food) => food.category === activeCategory
      );
    }

    // =========================
    // SEARCH FILTER
    // =========================

    if (search.trim() !== "") {
      result = result.filter((food) =>
        food.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // =========================
    // SORTING
    // =========================

    if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    }

    if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    }

    if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [activeCategory, search, sortBy]);

  return (
    <main className="min-h-screen bg-[#F3F2F0]">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* ================= TOP SEARCH AREA ================= */}

        <div className="bg-white border border-[#E2DED5] rounded-xl p-4 mb-5">

          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">

            {/* ================= PAGE TITLE ================= */}

            <div className="w-full md:w-auto">

              <h1 className="text-xl sm:text-2xl font-bold text-[#252525]">
                {t("allProducts")}
              </h1>

              <p className="text-sm text-[#777267] mt-1">
                {t("exploreFoodDrinks")}
              </p>

            </div>

            {/* ================= SEARCH ================= */}

            <div className="w-full md:w-80">

              <div className="relative">

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t("searchFood")}
                  className="w-full h-11 px-4 rounded-lg border border-[#D8D5CC] bg-[#FAFAF8] text-sm text-[#252525] outline-none focus:border-[#A08E65] focus:ring-2 focus:ring-[#A08E65]/20 transition"
                />

              </div>

            </div>

            {/* ================= SORT ================= */}

            <div className="w-full md:w-auto flex items-center gap-2">

              <label className="text-sm text-[#777267] whitespace-nowrap">
                {t("sortBy")}
              </label>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
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

        {/* ================= MAIN CONTENT ================= */}

        <div className="flex flex-col lg:flex-row gap-5">

          {/* ================= CATEGORY ================= */}

          <CategorySidebar
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
          />

          {/* ================= PRODUCTS ================= */}

          <section className="flex-1 min-w-0">

            {/* ================= RESULT INFO ================= */}

            <div className="flex items-center justify-between mb-4">

              <div>

                <h2 className="text-lg font-semibold text-[#252525]">

                  {activeCategory === "All Products"
                    ? t("allProducts")
                    : activeCategory}

                </h2>

                <p className="text-xs text-[#777267] mt-1">
                  {filteredFoods.length} {t("itemsAvailable")}
                </p>

              </div>

            </div>

            <FoodGrid foods={filteredFoods} />

          </section>

        </div>
      </div>
    </main>
  );
};

export default Home;