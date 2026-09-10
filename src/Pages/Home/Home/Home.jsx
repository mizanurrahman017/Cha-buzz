import React, { useMemo, useState } from "react";
import foods from "../../../data/foods";
import CategorySidebar from "../../../Components/Home/CategorySidebar";
import FoodGrid from "../../../Components/Home/FoodGrid";

const Home = () => {
  const [activeCategory, setActiveCategory] = useState("All Products");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("default");

  const filteredFoods = useMemo(() => {
    let result = [...foods];

    // Category filter
    if (activeCategory !== "All Products") {
      result = result.filter(
        (food) => food.category === activeCategory
      );
    }

    // Search filter
    if (search.trim() !== "") {
      result = result.filter((food) =>
        food.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Sorting
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

            {/* Page Title */}
            <div className="w-full md:w-auto">
              <h1 className="text-xl sm:text-2xl font-bold text-[#252525]">
                All Products
              </h1>

              <p className="text-sm text-[#777267] mt-1">
                Explore our delicious food & drinks
              </p>
            </div>

            {/* Search */}
            <div className="w-full md:w-80">

              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search food..."
                  className="w-full h-11 px-4 rounded-lg border border-[#D8D5CC] bg-[#FAFAF8] text-sm text-[#252525] outline-none focus:border-[#A08E65] focus:ring-2 focus:ring-[#A08E65]/20 transition"
                />
              </div>

            </div>

            {/* Sort */}
            <div className="w-full md:w-auto flex items-center gap-2">

              <label className="text-sm text-[#777267] whitespace-nowrap">
                Sort by:
              </label>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-11 px-4 rounded-lg border border-[#D8D5CC] bg-white text-sm text-[#252525] outline-none focus:border-[#A08E65] cursor-pointer"
              >
                <option value="default">Default</option>
                <option value="price-low">
                  Price: Low to High
                </option>
                <option value="price-high">
                  Price: High to Low
                </option>
                <option value="rating">
                  Highest Rated
                </option>
              </select>

            </div>

          </div>
        </div>

        {/* ================= MAIN CONTENT ================= */}
        <div className="flex flex-col lg:flex-row gap-5">

          {/* Category */}
          <CategorySidebar
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
          />

          {/* Products */}
          <section className="flex-1 min-w-0">

            {/* Result Info */}
            <div className="flex items-center justify-between mb-4">

              <div>
                <h2 className="text-lg font-semibold text-[#252525]">
                  {activeCategory}
                </h2>

                <p className="text-xs text-[#777267] mt-1">
                  {filteredFoods.length} items available
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