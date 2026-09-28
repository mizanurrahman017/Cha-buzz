import React, { useMemo, useState } from "react";
import {
  FaSearch,
  FaPlus,
  FaMinus,
  FaTrash,
  FaClipboardList,
  FaSave,
} from "react-icons/fa";

import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

import foods from "../../Data/foods";
import { useWaiterOrder } from "../../Context/WaiterOrderContext";
import { db } from "../../Firebase/Firebase.config";

const Waiter = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [saving, setSaving] = useState(false);

  const {
    orderItems,
    totalPrice,
    totalItems,
    addToWaiterOrder,
    increaseWaiterQuantity,
    decreaseWaiterQuantity,
    removeFromWaiterOrder,
    clearWaiterOrder,
  } = useWaiterOrder();

  // =========================
  // CATEGORIES
  // =========================
  const categories = [
    "All",
    ...new Set(foods.map((food) => food.category)),
  ];

  // =========================
  // FILTER FOOD
  // =========================
  const filteredFoods = useMemo(() => {
    return foods.filter((food) => {
      const matchesSearch = food.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        activeCategory === "All" ||
        food.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  // =========================
  // SAVE ORDER
  // =========================
  const handleSaveOrder = async () => {
    if (orderItems.length === 0) {
      alert("Please add at least one food.");
      return;
    }

    try {
      setSaving(true);

      const orderData = {
        items: orderItems.map((item) => ({
          id: item.id,
          name: item.name,
          price: Number(item.price),
          quantity: Number(item.quantity),
          image: item.image || "",
          category: item.category || "",
        })),

        total: Number(totalPrice),

        orderSource: "waiter",

        paymentMethod: "cash",

        paymentStatus: "paid",

        orderStatus: "completed",

        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "orders"), orderData);

      alert("Order saved successfully!");

      clearWaiterOrder();
    } catch (error) {
      console.error("Error saving waiter order:", error);

      alert("Failed to save order. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // CURRENT ORDER CONTENT
  // =========================================================
  const CurrentOrderContent = () => {
    if (orderItems.length === 0) {
      return (
        <div className="py-10 text-center">
          <div
            className="
              w-14 h-14 mx-auto
              rounded-2xl
              bg-[#F7F5EF]
              flex items-center justify-center
              text-[#8A806B]
            "
          >
            <FaClipboardList size={22} />
          </div>

          <h3 className="font-bold text-[#252525] mt-4">
            No items added
          </h3>

          <p className="text-xs text-[#8A806B] mt-1">
            Add foods from the menu
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {orderItems.map((item) => (
          <div
            key={item.id}
            className="
              flex gap-3
              p-3
              rounded-xl
              bg-[#FAF9F5]
              border border-[#E8E4DA]
            "
          >
            {/* FOOD IMAGE */}
            <img
              src={item.image}
              alt={item.name}
              className="
                w-14 h-14
                rounded-lg
                object-cover
                shrink-0
              "
            />

            {/* FOOD INFO */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h4
                  className="
                    text-sm
                    font-bold
                    text-[#252525]
                    line-clamp-2
                  "
                >
                  {item.name}
                </h4>

                {/* DELETE */}
                <button
                  onClick={() =>
                    removeFromWaiterOrder(item.id)
                  }
                  className="
                    text-[#8A806B]
                    hover:text-red-500
                    transition
                    shrink-0
                  "
                >
                  <FaTrash size={11} />
                </button>
              </div>

              {/* PRICE */}
              <p className="text-xs text-[#8A806B] mt-1">
                ৳{item.price} × {item.quantity}
              </p>

              {/* QUANTITY */}
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  {/* MINUS */}
                  <button
                    onClick={() =>
                      decreaseWaiterQuantity(item.id)
                    }
                    className="
                      w-7 h-7
                      rounded-md
                      bg-white
                      border border-[#D8D5CC]
                      flex items-center justify-center
                      hover:bg-[#252525]
                      hover:text-white
                      transition-all
                      active:scale-90
                    "
                  >
                    <FaMinus size={9} />
                  </button>

                  {/* QUANTITY */}
                  <span className="text-sm font-bold w-5 text-center">
                    {item.quantity}
                  </span>

                  {/* PLUS */}
                  <button
                    onClick={() =>
                      increaseWaiterQuantity(item.id)
                    }
                    className="
                      w-7 h-7
                      rounded-md
                      bg-[#252525]
                      text-white
                      flex items-center justify-center
                      hover:bg-[#A08E65]
                      transition-all
                      active:scale-90
                    "
                  >
                    <FaPlus size={9} />
                  </button>
                </div>

                {/* ITEM TOTAL */}
                <p className="text-sm font-extrabold text-[#252525]">
                  ৳{item.price * item.quantity}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // =========================================================
  // CURRENT ORDER FOOTER
  // =========================================================
  const CurrentOrderFooter = () => {
    if (orderItems.length === 0) {
      return null;
    }

    return (
      <div className="border-t border-[#E4E0D7] p-4 sm:p-5">
        {/* TOTAL */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-[#8A806B]">
              {totalItems} Items
            </p>

            <span className="text-sm font-semibold text-[#8A806B]">
              Total
            </span>
          </div>

          <span className="text-2xl font-extrabold text-[#252525]">
            ৳{totalPrice}
          </span>
        </div>

        {/* SAVE ORDER */}
        <button
          onClick={handleSaveOrder}
          disabled={saving}
          className="
            w-full
            h-12
            rounded-xl
            bg-[#252525]
            text-white
            font-bold
            text-sm
            flex
            items-center
            justify-center
            gap-2
            hover:bg-[#A08E65]
            transition-all
            active:scale-[0.98]
            disabled:opacity-60
            disabled:cursor-not-allowed
          "
        >
          <FaSave />

          {saving ? "Saving Order..." : "Save Order"}
        </button>

        <p className="text-[10px] text-center text-[#8A806B] mt-3">
          Order will be recorded as a completed cash order
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F7F5EF] py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}
        <div className="mb-6">
          <div
            className="
              flex
              flex-col
              sm:flex-row
              sm:items-center
              sm:justify-between
              gap-4
            "
          >
            {/* TITLE */}
            <div>
              <p className="text-sm font-semibold text-[#A08E65]">
                Cha Buzz
              </p>

              <h1
                className="
                  text-2xl
                  sm:text-3xl
                  font-extrabold
                  text-[#252525]
                "
              >
                Waiter Panel
              </h1>

              <p className="text-sm text-[#8A806B] mt-1">
                Record today's restaurant orders digitally
              </p>
            </div>

            {/* DESKTOP SUMMARY */}
            <div
              className="
                hidden
                sm:block
                bg-white
                border border-[#E4E0D7]
                rounded-2xl
                px-5
                py-4
                shadow-sm
              "
            >
              <div className="flex items-center gap-3">
                <div
                  className="
                    w-10 h-10
                    rounded-xl
                    bg-[#252525]
                    text-white
                    flex items-center justify-center
                  "
                >
                  <FaClipboardList />
                </div>

                <div>
                  <p className="text-xs text-[#8A806B]">
                    Current Order
                  </p>

                  <p className="font-bold text-[#252525]">
                    {totalItems} Items · ৳{totalPrice}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================= */}
        {/* MOBILE CURRENT ORDER
            MOBILE-এ একদম সবার উপরে
        ================================================= */}
        <div className="lg:hidden mb-5">
          <div
            className="
              bg-white
              border border-[#E4E0D7]
              rounded-2xl
              shadow-sm
              overflow-hidden
            "
          >
            {/* ORDER HEADER */}
            <div className="p-4 border-b border-[#E4E0D7]">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className="
                      w-10 h-10
                      rounded-xl
                      bg-[#252525]
                      text-white
                      flex items-center justify-center
                      shrink-0
                    "
                  >
                    <FaClipboardList />
                  </div>

                  <div>
                    <h2 className="text-base font-bold text-[#252525]">
                      Current Order
                    </h2>

                    <p className="text-xs text-[#8A806B] mt-0.5">
                      Digital Khata
                    </p>
                  </div>
                </div>

                {/* CLEAR */}
                {orderItems.length > 0 && (
                  <button
                    onClick={clearWaiterOrder}
                    className="
                      text-xs
                      font-semibold
                      text-red-500
                      hover:text-red-700
                    "
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>

            {/* ORDER ITEMS */}
            <div className="p-4">
              <CurrentOrderContent />
            </div>

            {/* TOTAL + SAVE */}
            <CurrentOrderFooter />
          </div>
        </div>

        {/* ================================================= */}
        {/* SEARCH + CATEGORY */}
        {/* ================================================= */}
        <div
          className="
            bg-white
            border border-[#E4E0D7]
            rounded-2xl
            p-4
            mb-5
            shadow-sm
          "
        >
          {/* SEARCH */}
          <div className="relative">
            <FaSearch
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-[#8A806B]
              "
              size={14}
            />

            <input
              type="text"
              placeholder="Search food..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
                w-full
                h-11
                pl-11
                pr-4
                rounded-xl
                border border-[#D8D5CC]
                outline-none
                text-sm
                text-[#252525]
                focus:border-[#252525]
                bg-[#FAF9F5]
                transition
              "
            />
          </div>

          {/* CATEGORY */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() =>
                  setActiveCategory(category)
                }
                className={`
                  whitespace-nowrap
                  px-4
                  py-2
                  rounded-full
                  text-xs
                  sm:text-sm
                  font-semibold
                  transition-all
                  active:scale-95
                  ${
                    activeCategory === category
                      ? "bg-[#252525] text-white"
                      : "bg-[#F7F5EF] text-[#252525] hover:bg-[#E9E5DA]"
                  }
                `}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* ================================================= */}
        {/* MAIN CONTENT */}
        {/* ================================================= */}
        <div className="grid lg:grid-cols-[1fr_380px] gap-6">

          {/* ================================================= */}
          {/* FOOD MENU */}
          {/* ================================================= */}
          <div>
            {/* MENU HEADER */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2
                  className="
                    text-lg
                    sm:text-xl
                    font-bold
                    text-[#252525]
                  "
                >
                  Food Menu
                </h2>

                <p className="text-xs text-[#8A806B] mt-1">
                  Select food consumed by the customer
                </p>
              </div>

              <span className="text-xs font-semibold text-[#8A806B]">
                {filteredFoods.length} items
              </span>
            </div>

            {/* FOOD CARDS */}
            <div
              className="
                grid
                grid-cols-2
                sm:grid-cols-2
                xl:grid-cols-3
                gap-3
                sm:gap-5
              "
            >
              {filteredFoods.map((food) => {
                // ==========================================
                // CHECK FOOD ALREADY ADDED
                // ==========================================
                const isAdded = orderItems.some(
                  (item) => item.id === food.id
                );

                return (
                  <div
                    key={food.id}
                    className="
                      bg-white
                      rounded-2xl
                      overflow-hidden
                      border border-[#E4E0D7]
                      shadow-[0_3px_15px_rgba(37,37,37,0.06)]
                      transition-all
                      duration-200
                      hover:shadow-md
                    "
                  >
                    {/* FOOD IMAGE */}
                    <div
                      className="
                        relative
                        h-32
                        sm:h-40
                        overflow-hidden
                      "
                    >
                      <img
                        src={food.image}
                        alt={food.name}
                        className="
                          w-full
                          h-full
                          object-cover
                        "
                      />

                      {/* CATEGORY */}
                      <span
                        className="
                          absolute
                          top-2
                          left-2
                          px-2
                          py-1
                          rounded-full
                          bg-white/95
                          text-[9px]
                          sm:text-[10px]
                          font-bold
                          text-[#252525]
                        "
                      >
                        {food.category}
                      </span>

                      {/* ADDED BADGE */}
                      {isAdded && (
                        <span
                          className="
                            absolute
                            top-2
                            right-2
                            px-2
                            py-1
                            rounded-full
                            bg-green-600
                            text-white
                            text-[9px]
                            sm:text-[10px]
                            font-bold
                            shadow-sm
                          "
                        >
                          ✓ Added
                        </span>
                      )}
                    </div>

                    {/* FOOD INFO */}
                    <div className="p-3 sm:p-4">
                      <h3
                        className="
                          font-bold
                          text-sm
                          sm:text-base
                          text-[#252525]
                          line-clamp-2
                          min-h-[40px]
                        "
                      >
                        {food.name}
                      </h3>

                      <div
                        className="
                          flex
                          items-center
                          justify-between
                          gap-2
                          mt-3
                        "
                      >
                        {/* PRICE */}
                        <p
                          className="
                            font-extrabold
                            text-lg
                            text-[#252525]
                          "
                        >
                          ৳{food.price}
                        </p>

                        {/* INTERACTIVE ADD BUTTON */}
                        <button
                          onClick={() =>
                            addToWaiterOrder(food)
                          }
                          className={`
                            h-9
                            px-3
                            rounded-lg
                            text-xs
                            font-semibold
                            flex
                            items-center
                            justify-center
                            gap-1.5
                            transition-all
                            duration-200
                            active:scale-90
                            ${
                              isAdded
                                ? `
                                  bg-green-600
                                  text-white
                                  shadow-sm
                                `
                                : `
                                  bg-[#252525]
                                  text-white
                                  hover:bg-[#A08E65]
                                `
                            }
                          `}
                        >
                          {isAdded ? (
                            <>
                              <span className="text-sm">
                                ✓
                              </span>

                              Added
                            </>
                          ) : (
                            <>
                              <FaPlus size={10} />

                              Add
                            </>
                          )}
                        </button>
                      </div>

                      {/* QUANTITY INFO WHEN ADDED */}
                      {isAdded && (
                        <div
                          className="
                            mt-3
                            flex
                            items-center
                            justify-center
                            gap-2
                            text-xs
                            font-semibold
                            text-[#6B6255]
                            bg-[#F7F5EF]
                            rounded-lg
                            py-2
                          "
                        >
                          <span>
                            In order:
                          </span>

                          <span className="text-[#252525] font-extrabold">
                            {
                              orderItems.find(
                                (item) =>
                                  item.id === food.id
                              )?.quantity
                            }
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* NO FOOD */}
            {filteredFoods.length === 0 && (
              <div
                className="
                  bg-white
                  border border-[#E4E0D7]
                  rounded-2xl
                  p-10
                  text-center
                "
              >
                <p className="font-semibold text-[#252525]">
                  No food found
                </p>

                <p className="text-sm text-[#8A806B] mt-1">
                  Try another food name or category.
                </p>
              </div>
            )}
          </div>

          {/* ================================================= */}
          {/* DESKTOP CURRENT ORDER */}
          {/* ================================================= */}
          <div className="hidden lg:block lg:sticky lg:top-24 h-fit">
            <div
              className="
                bg-white
                border border-[#E4E0D7]
                rounded-2xl
                shadow-sm
                overflow-hidden
              "
            >
              {/* HEADER */}
              <div className="p-5 border-b border-[#E4E0D7]">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-[#252525]">
                      Current Order
                    </h2>

                    <p className="text-xs text-[#8A806B] mt-1">
                      Digital Khata
                    </p>
                  </div>

                  {orderItems.length > 0 && (
                    <button
                      onClick={clearWaiterOrder}
                      className="
                        text-xs
                        font-semibold
                        text-red-500
                        hover:text-red-700
                      "
                    >
                      Clear All
                    </button>
                  )}
                </div>
              </div>

              {/* ORDER ITEMS */}
              <div className="p-4">
                <CurrentOrderContent />
              </div>

              {/* TOTAL + SAVE */}
              <CurrentOrderFooter />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Waiter;