import React, { useMemo, useState } from "react";
import {
  FaSearch,
  FaPlus,
  FaMinus,
  FaTrash,
  FaClipboardList,
} from "react-icons/fa";

import foods from "../../data/foods";
import { useCart } from "../../Contexts/CartContext";

const Waiter = () => {
  const [search, setSearch] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  const {
    cartItems,
    totalPrice,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();

  // Search food
  const filteredFoods = useMemo(() => {
    return foods.filter((food) =>
      food.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const handlePlaceOrder = () => {
    if (!customerName.trim()) {
      alert("Please enter customer name.");
      return;
    }

    if (!customerPhone.trim()) {
      alert("Please enter customer phone number.");
      return;
    }

    if (cartItems.length === 0) {
      alert("Please add at least one food.");
      return;
    }

    // এখন শুধু test
    console.log("Waiter Order:", {
      customerName,
      customerPhone,
      items: cartItems,
      total: totalPrice,
    });

    alert("Order ready! Firestore connection will be added next.");

    setCustomerName("");
    setCustomerPhone("");
  };

  return (
    <div className="min-h-screen bg-[#F7F5EF] px-4 sm:px-6 lg:px-8 py-8">

      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">

            <div className="w-12 h-12 rounded-2xl bg-[#252525] text-white flex items-center justify-center">
              <FaClipboardList size={20} />
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#252525]">
                Waiter Panel
              </h1>

              <p className="text-sm text-[#8A806B] mt-1">
                Create restaurant customer orders
              </p>
            </div>

          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">

          {/* LEFT SIDE */}
          <div>

            {/* Customer Information */}
            <div className="bg-white rounded-2xl border border-[#E4E0D7] p-5 sm:p-6 mb-6">

              <h2 className="text-lg font-bold text-[#252525] mb-4">
                Customer Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-[#252525] mb-2">
                    Customer Name
                  </label>

                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter customer name"
                    className="w-full h-11 rounded-xl border border-[#D8D5CC] bg-[#FAF9F5] px-4 text-sm outline-none focus:border-[#252525] focus:ring-2 focus:ring-[#252525]/10"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-[#252525] mb-2">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Enter phone number"
                    className="w-full h-11 rounded-xl border border-[#D8D5CC] bg-[#FAF9F5] px-4 text-sm outline-none focus:border-[#252525] focus:ring-2 focus:ring-[#252525]/10"
                  />
                </div>

              </div>
            </div>

            {/* Food Section */}
            <div className="bg-white rounded-2xl border border-[#E4E0D7] p-5 sm:p-6">

              {/* Food Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

                <div>
                  <h2 className="text-xl font-bold text-[#252525]">
                    Select Food
                  </h2>

                  <p className="text-sm text-[#8A806B] mt-1">
                    Add food items to customer's order
                  </p>
                </div>

                {/* Search */}
                <div className="relative w-full sm:w-64">

                  <FaSearch
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A806B]"
                    size={13}
                  />

                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search food..."
                    className="w-full h-11 rounded-xl border border-[#D8D5CC] bg-[#FAF9F5] pl-10 pr-4 text-sm outline-none focus:border-[#252525]"
                  />

                </div>

              </div>

              {/* Food Grid */}
              {filteredFoods.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">

                  {filteredFoods.map((food) => (
                    <div
                      key={food.id}
                      className="group border border-[#E4E0D7] rounded-2xl overflow-hidden bg-white hover:shadow-md transition-all duration-200"
                    >

                      {/* Image */}
                      <div className="h-28 sm:h-32 overflow-hidden">
                        <img
                          src={food.image}
                          alt={food.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      {/* Info */}
                      <div className="p-3">

                        <h3 className="font-bold text-sm text-[#252525] line-clamp-2 min-h-[40px]">
                          {food.name}
                        </h3>

                        <div className="flex items-center justify-between gap-2 mt-3">

                          <span className="font-extrabold text-[#252525]">
                            ৳{food.price}
                          </span>

                          <button
                            onClick={() => addToCart(food)}
                            className="w-9 h-9 rounded-lg bg-[#252525] text-white flex items-center justify-center hover:bg-[#A08E65] transition"
                            title="Add food"
                          >
                            <FaPlus size={12} />
                          </button>

                        </div>

                      </div>
                    </div>
                  ))}

                </div>
              ) : (
                <div className="py-12 text-center">
                  <p className="text-[#8A806B]">
                    No food found.
                  </p>
                </div>
              )}

            </div>
          </div>

          {/* RIGHT SIDE - ORDER */}
          <div className="lg:sticky lg:top-24 h-fit">

            <div className="bg-white rounded-2xl border border-[#E4E0D7] shadow-sm overflow-hidden">

              {/* Order Header */}
              <div className="p-5 border-b border-[#E4E0D7]">

                <div className="flex items-center justify-between">

                  <div>
                    <h2 className="text-xl font-bold text-[#252525]">
                      Current Order
                    </h2>

                    <p className="text-xs text-[#8A806B] mt-1">
                      {cartItems.length} different item
                      {cartItems.length !== 1 ? "s" : ""}
                    </p>
                  </div>

                  <div className="w-10 h-10 rounded-xl bg-[#F7F5EF] flex items-center justify-center">
                    <FaClipboardList
                      className="text-[#252525]"
                      size={16}
                    />
                  </div>

                </div>

              </div>

              {/* Items */}
              <div className="p-5">

                {cartItems.length === 0 ? (
                  <div className="py-10 text-center">

                    <div className="w-14 h-14 mx-auto rounded-full bg-[#F7F5EF] flex items-center justify-center">
                      <FaClipboardList
                        className="text-[#8A806B]"
                        size={20}
                      />
                    </div>

                    <p className="mt-4 font-semibold text-[#252525]">
                      No items added
                    </p>

                    <p className="mt-1 text-xs text-[#8A806B]">
                      Select food from the menu
                    </p>

                  </div>
                ) : (
                  <div className="space-y-4 max-h-[430px] overflow-y-auto pr-1">

                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-3 pb-4 border-b border-[#E4E0D7] last:border-0"
                      >

                        {/* Image */}
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                        />

                        {/* Details */}
                        <div className="flex-1 min-w-0">

                          <div className="flex items-start justify-between gap-2">

                            <h3 className="font-semibold text-sm text-[#252525] line-clamp-2">
                              {item.name}
                            </h3>

                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-400 hover:text-red-600 transition"
                              title="Remove"
                            >
                              <FaTrash size={12} />
                            </button>

                          </div>

                          <p className="text-xs text-[#8A806B] mt-1">
                            ৳{item.price} each
                          </p>

                          {/* Quantity */}
                          <div className="flex items-center justify-between mt-3">

                            <div className="flex items-center border border-[#D8D5CC] rounded-lg overflow-hidden">

                              <button
                                onClick={() =>
                                  decreaseQuantity(item.id)
                                }
                                className="w-8 h-8 flex items-center justify-center hover:bg-[#F7F5EF]"
                              >
                                <FaMinus size={9} />
                              </button>

                              <span className="w-8 text-center text-sm font-bold">
                                {item.quantity}
                              </span>

                              <button
                                onClick={() =>
                                  increaseQuantity(item.id)
                                }
                                className="w-8 h-8 flex items-center justify-center hover:bg-[#F7F5EF]"
                              >
                                <FaPlus size={9} />
                              </button>

                            </div>

                            <span className="font-bold text-sm text-[#252525]">
                              ৳{item.price * item.quantity}
                            </span>

                          </div>

                        </div>
                      </div>
                    ))}

                  </div>
                )}

              </div>

              {/* Summary */}
              {cartItems.length > 0 && (
                <div className="border-t border-[#E4E0D7] p-5">

                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-[#8A806B]">
                      Subtotal
                    </span>

                    <span className="font-semibold text-[#252525]">
                      ৳{totalPrice}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-dashed border-[#D8D5CC]">

                    <span className="font-bold text-[#252525]">
                      Total
                    </span>

                    <span className="text-2xl font-extrabold text-[#252525]">
                      ৳{totalPrice}
                    </span>

                  </div>

                  <button
                    onClick={handlePlaceOrder}
                    className="w-full h-12 mt-5 rounded-xl bg-[#252525] text-white font-bold hover:bg-[#A08E65] active:scale-[0.98] transition-all"
                  >
                    Place Order
                  </button>

                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Waiter;