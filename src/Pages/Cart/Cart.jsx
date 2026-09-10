import React, { useState } from "react";
import {
  FaMinus,
  FaPlus,
  FaTrash,
  FaArrowLeft,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaUser,
  FaMoneyBillWave,
  FaCreditCard,
  FaCheckCircle,
} from "react-icons/fa";
import { Link } from "react-router";
import { useCart } from "../../Contexts/CartContext";

import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../../Firebase/Firebase.config";

const Cart = () => {
  const {
    cartItems,
    totalPrice,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const [paymentMethod, setPaymentMethod] = useState("cash");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    note: "",
  });

  const [loading, setLoading] = useState(false);

  // -----------------------------
  // Handle Input Change
  // -----------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // -----------------------------
  // Delivery Fee
  // -----------------------------
  const deliveryFee = cartItems.length > 0 ? 50 : 0;

  const grandTotal = totalPrice + deliveryFee;

  // -----------------------------
  // Place Order
  // -----------------------------
  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    // Empty cart check
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    // Required fields check
    if (
      !formData.name.trim() ||
      !formData.phone.trim() ||
      !formData.address.trim()
    ) {
      alert("Please fill in Name, Phone and Address.");
      return;
    }

    try {
      setLoading(true);

      // -----------------------------
      // Order Data
      // -----------------------------
      const orderData = {
        customer: {
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          address: formData.address.trim(),
          note: formData.note.trim(),
        },

        // Save cart items
        items: cartItems.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          category: item.category,
        })),

        // Price information
        subtotal: totalPrice,
        deliveryFee: deliveryFee,
        total: grandTotal,

        // Payment
        paymentMethod: paymentMethod,

        // এখনো payment gateway connect হয়নি
        paymentStatus: "pending",

        // নতুন order প্রথমে pending
        orderStatus: "pending",

        // Customer order
        orderSource: "customer",

        // Firebase server time
        createdAt: serverTimestamp(),
      };

      // -----------------------------
      // Save Order To Firestore
      // -----------------------------
      const orderRef = await addDoc(
        collection(db, "orders"),
        orderData
      );

      console.log("Order successfully created:", orderRef.id);

      // Clear cart
      clearCart();

      // Reset form
      setFormData({
        name: "",
        phone: "",
        email: "",
        address: "",
        note: "",
      });

      // Success message
      alert(
        `Order placed successfully!\n\nOrder ID: ${orderRef.id}`
      );

    } catch (error) {
      console.error("Order failed:", error);

      alert(
        "Sorry! Order could not be placed.\nPlease try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Empty Cart
  // -----------------------------
  if (cartItems.length === 0) {
    return (
      <section className="min-h-[70vh] bg-[#F7F5EF] flex items-center justify-center px-4 py-16">
        <div className="text-center max-w-md">

          <div className="w-24 h-24 mx-auto rounded-full bg-white flex items-center justify-center shadow-sm border border-[#E4E0D7]">
            <FaShoppingCartIcon />
          </div>

          <h1 className="mt-6 text-2xl sm:text-3xl font-extrabold text-[#252525]">
            Your Cart is Empty
          </h1>

          <p className="mt-3 text-sm sm:text-base text-[#8A806B]">
            Looks like you haven't added any food to your cart yet.
          </p>

          <Link
            to="/"
            className="
              inline-flex
              items-center
              gap-2
              mt-7
              px-6
              py-3
              rounded-xl
              bg-[#252525]
              text-white
              font-semibold
              text-sm
              hover:bg-[#A08E65]
              transition
            "
          >
            <FaArrowLeft size={13} />
            Continue Shopping
          </Link>

        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#F7F5EF] px-3 sm:px-5 lg:px-8 py-8 sm:py-12">

      <div className="max-w-7xl mx-auto">

        {/* ======================================
            HEADER
        ====================================== */}
        <div className="mb-8">

          <Link
            to="/"
            className="
              inline-flex
              items-center
              gap-2
              text-sm
              font-semibold
              text-[#8A806B]
              hover:text-[#252525]
              transition
            "
          >
            <FaArrowLeft size={12} />
            Continue Shopping
          </Link>

          <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold text-[#252525]">
            Checkout
          </h1>

          <p className="mt-2 text-sm text-[#8A806B]">
            Complete your information and place your order.
          </p>

        </div>


        {/* ======================================
            MAIN GRID
        ====================================== */}
        <form
          onSubmit={handlePlaceOrder}
          className="grid grid-cols-1 lg:grid-cols-[1fr_390px] gap-6 lg:gap-8"
        >

          {/* ====================================
              LEFT SIDE
          ==================================== */}
          <div className="space-y-6">

            {/* --------------------------------
                CUSTOMER INFORMATION
            -------------------------------- */}
            <div className="bg-white rounded-2xl border border-[#E4E0D7] p-4 sm:p-6 shadow-[0_3px_15px_rgba(37,37,37,0.05)]">

              <div className="mb-5">
                <h2 className="text-xl font-bold text-[#252525]">
                  Customer Information
                </h2>

                <p className="text-sm text-[#8A806B] mt-1">
                  Please enter your delivery information.
                </p>
              </div>


              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* NAME */}
                <div>
                  <label className="block text-sm font-semibold text-[#252525] mb-2">
                    Full Name *
                  </label>

                  <div className="relative">

                    <FaUser
                      className="
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-[#A08E65]
                      "
                      size={14}
                    />

                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      required
                      className="
                        w-full
                        h-12
                        pl-11
                        pr-4
                        rounded-xl
                        border
                        border-[#D8D5CC]
                        bg-[#FDFCF9]
                        text-sm
                        text-[#252525]
                        outline-none
                        focus:border-[#A08E65]
                        focus:ring-2
                        focus:ring-[#A08E65]/10
                      "
                    />

                  </div>
                </div>


                {/* PHONE */}
                <div>
                  <label className="block text-sm font-semibold text-[#252525] mb-2">
                    Phone Number *
                  </label>

                  <div className="relative">

                    <FaPhoneAlt
                      className="
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-[#A08E65]
                      "
                      size={14}
                    />

                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="01XXXXXXXXX"
                      required
                      className="
                        w-full
                        h-12
                        pl-11
                        pr-4
                        rounded-xl
                        border
                        border-[#D8D5CC]
                        bg-[#FDFCF9]
                        text-sm
                        text-[#252525]
                        outline-none
                        focus:border-[#A08E65]
                        focus:ring-2
                        focus:ring-[#A08E65]/10
                      "
                    />

                  </div>
                </div>


                {/* EMAIL */}
                <div className="sm:col-span-2">

                  <label className="block text-sm font-semibold text-[#252525] mb-2">
                    Email Address
                    <span className="text-[#A08E65] font-normal ml-1">
                      (Optional)
                    </span>
                  </label>

                  <div className="relative">

                    <FaEnvelope
                      className="
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-[#A08E65]
                      "
                      size={14}
                    />

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="
                        w-full
                        h-12
                        pl-11
                        pr-4
                        rounded-xl
                        border
                        border-[#D8D5CC]
                        bg-[#FDFCF9]
                        text-sm
                        text-[#252525]
                        outline-none
                        focus:border-[#A08E65]
                        focus:ring-2
                        focus:ring-[#A08E65]/10
                      "
                    />

                  </div>

                </div>


                {/* ADDRESS */}
                <div className="sm:col-span-2">

                  <label className="block text-sm font-semibold text-[#252525] mb-2">
                    Delivery Address *
                  </label>

                  <div className="relative">

                    <FaMapMarkerAlt
                      className="
                        absolute
                        left-4
                        top-4
                        text-[#A08E65]
                      "
                      size={14}
                    />

                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter your complete delivery address"
                      required
                      rows="3"
                      className="
                        w-full
                        pl-11
                        pr-4
                        py-3
                        rounded-xl
                        border
                        border-[#D8D5CC]
                        bg-[#FDFCF9]
                        text-sm
                        text-[#252525]
                        outline-none
                        resize-none
                        focus:border-[#A08E65]
                        focus:ring-2
                        focus:ring-[#A08E65]/10
                      "
                    />

                  </div>

                </div>


                {/* NOTE */}
                <div className="sm:col-span-2">

                  <label className="block text-sm font-semibold text-[#252525] mb-2">
                    Order Note
                    <span className="text-[#A08E65] font-normal ml-1">
                      (Optional)
                    </span>
                  </label>

                  <textarea
                    name="note"
                    value={formData.note}
                    onChange={handleChange}
                    placeholder="Any special instructions?"
                    rows="3"
                    className="
                      w-full
                      px-4
                      py-3
                      rounded-xl
                      border
                      border-[#D8D5CC]
                      bg-[#FDFCF9]
                      text-sm
                      text-[#252525]
                      outline-none
                      resize-none
                      focus:border-[#A08E65]
                      focus:ring-2
                      focus:ring-[#A08E65]/10
                    "
                  />

                </div>

              </div>
            </div>


            {/* --------------------------------
                PAYMENT METHOD
            -------------------------------- */}
            <div className="bg-white rounded-2xl border border-[#E4E0D7] p-4 sm:p-6 shadow-[0_3px_15px_rgba(37,37,37,0.05)]">

              <div className="mb-5">

                <h2 className="text-xl font-bold text-[#252525]">
                  Payment Method
                </h2>

                <p className="text-sm text-[#8A806B] mt-1">
                  Choose how you want to pay.
                </p>

              </div>


              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* CASH */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("cash")}
                  className={`
                    text-left
                    rounded-xl
                    border
                    p-4
                    transition-all
                    ${
                      paymentMethod === "cash"
                        ? "border-[#252525] bg-[#F7F5EF]"
                        : "border-[#E4E0D7] bg-white hover:border-[#A08E65]"
                    }
                  `}
                >

                  <div className="flex items-center gap-3">

                    <div
                      className={`
                        w-11
                        h-11
                        rounded-xl
                        flex
                        items-center
                        justify-center
                        ${
                          paymentMethod === "cash"
                            ? "bg-[#252525] text-white"
                            : "bg-[#F7F5EF] text-[#252525]"
                        }
                      `}
                    >
                      <FaMoneyBillWave />
                    </div>

                    <div>
                      <h3 className="font-bold text-[#252525]">
                        Cash on Delivery
                      </h3>

                      <p className="text-xs text-[#8A806B] mt-1">
                        Pay when your order arrives
                      </p>
                    </div>

                  </div>

                  {paymentMethod === "cash" && (
                    <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-[#252525]">
                      <FaCheckCircle />
                      Selected
                    </div>
                  )}

                </button>


                {/* ONLINE PAYMENT */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("online")}
                  className={`
                    text-left
                    rounded-xl
                    border
                    p-4
                    transition-all
                    ${
                      paymentMethod === "online"
                        ? "border-[#252525] bg-[#F7F5EF]"
                        : "border-[#E4E0D7] bg-white hover:border-[#A08E65]"
                    }
                  `}
                >

                  <div className="flex items-center gap-3">

                    <div
                      className={`
                        w-11
                        h-11
                        rounded-xl
                        flex
                        items-center
                        justify-center
                        ${
                          paymentMethod === "online"
                            ? "bg-[#252525] text-white"
                            : "bg-[#F7F5EF] text-[#252525]"
                        }
                      `}
                    >
                      <FaCreditCard />
                    </div>

                    <div>
                      <h3 className="font-bold text-[#252525]">
                        Online Payment
                      </h3>

                      <p className="text-xs text-[#8A806B] mt-1">
                        Pay securely online
                      </p>
                    </div>

                  </div>

                  {paymentMethod === "online" && (
                    <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-[#252525]">
                      <FaCheckCircle />
                      Selected
                    </div>
                  )}

                </button>

              </div>


              {/* PAYMENT INFO */}
              {paymentMethod === "online" && (
                <div className="mt-4 p-4 rounded-xl bg-[#F7F5EF] border border-[#E4E0D7]">

                  <p className="text-sm text-[#252525] font-semibold">
                    Online payment
                  </p>

                  <p className="text-xs text-[#8A806B] mt-1 leading-relaxed">
                    Online payment gateway will be connected soon.
                    Your order will currently be saved as pending payment.
                  </p>

                </div>
              )}

            </div>

          </div>


          {/* ====================================
              RIGHT SIDE - ORDER SUMMARY
          ==================================== */}
          <div className="lg:sticky lg:top-24 h-fit">

            <div className="bg-white rounded-2xl border border-[#E4E0D7] p-4 sm:p-6 shadow-[0_3px_15px_rgba(37,37,37,0.05)]">

              <div className="flex items-center justify-between mb-5">

                <div>
                  <h2 className="text-xl font-bold text-[#252525]">
                    Order Summary
                  </h2>

                  <p className="text-xs text-[#8A806B] mt-1">
                    {cartItems.length} item
                    {cartItems.length !== 1 ? "s" : ""}
                  </p>
                </div>

              </div>


              {/* =================================
                  CART ITEMS
              ================================= */}
              <div className="space-y-4 max-h-[430px] overflow-y-auto pr-1">

                {cartItems.map((item) => (

                  <div
                    key={item.id}
                    className="
                      flex
                      gap-3
                      pb-4
                      border-b
                      border-[#EEEAE1]
                    "
                  >

                    {/* IMAGE */}
                    <img
                      src={item.image}
                      alt={item.name}
                      className="
                        w-20
                        h-20
                        sm:w-24
                        sm:h-24
                        rounded-xl
                        object-cover
                        flex-shrink-0
                      "
                    />


                    {/* DETAILS */}
                    <div className="flex-1 min-w-0">

                      <div className="flex items-start justify-between gap-2">

                        <h3
                          className="
                            text-sm
                            font-bold
                            text-[#252525]
                            leading-snug
                            line-clamp-2
                          "
                        >
                          {item.name}
                        </h3>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="
                            text-[#A08E65]
                            hover:text-red-500
                            transition
                            flex-shrink-0
                          "
                          title="Remove item"
                        >
                          <FaTrash size={13} />
                        </button>

                      </div>


                      {/* PRICE */}
                      <p className="text-sm font-bold text-[#252525] mt-2">
                        ৳{item.price}
                      </p>


                      {/* QUANTITY */}
                      <div className="flex items-center justify-between mt-3">

                        <div
                          className="
                            inline-flex
                            items-center
                            border
                            border-[#D8D5CC]
                            rounded-lg
                            overflow-hidden
                          "
                        >

                          <button
                            type="button"
                            onClick={() => decreaseQuantity(item.id)}
                            className="
                              w-8
                              h-8
                              flex
                              items-center
                              justify-center
                              text-[#252525]
                              hover:bg-[#F7F5EF]
                              transition
                            "
                          >
                            <FaMinus size={10} />
                          </button>

                          <span
                            className="
                              w-8
                              h-8
                              flex
                              items-center
                              justify-center
                              text-sm
                              font-bold
                              text-[#252525]
                              border-x
                              border-[#D8D5CC]
                            "
                          >
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() => increaseQuantity(item.id)}
                            className="
                              w-8
                              h-8
                              flex
                              items-center
                              justify-center
                              text-[#252525]
                              hover:bg-[#F7F5EF]
                              transition
                            "
                          >
                            <FaPlus size={10} />
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


              {/* =================================
                  PRICE SUMMARY
              ================================= */}
              <div className="mt-6 space-y-3">

                <div className="flex items-center justify-between text-sm">

                  <span className="text-[#8A806B]">
                    Subtotal
                  </span>

                  <span className="font-semibold text-[#252525]">
                    ৳{totalPrice}
                  </span>

                </div>


                <div className="flex items-center justify-between text-sm">

                  <span className="text-[#8A806B]">
                    Delivery Fee
                  </span>

                  <span className="font-semibold text-[#252525]">
                    ৳{deliveryFee}
                  </span>

                </div>


                <div className="border-t border-[#E4E0D7] pt-4 flex items-center justify-between">

                  <span className="text-base font-bold text-[#252525]">
                    Total
                  </span>

                  <span className="text-2xl font-extrabold text-[#252525]">
                    ৳{grandTotal}
                  </span>

                </div>

              </div>


              {/* =================================
                  DESKTOP PLACE ORDER
              ================================= */}
              <button
                type="submit"
                disabled={loading}
                className="
                  hidden
                  lg:flex
                  w-full
                  h-12
                  mt-6
                  rounded-xl
                  bg-[#252525]
                  text-white
                  font-bold
                  items-center
                  justify-center
                  gap-2
                  hover:bg-[#A08E65]
                  disabled:opacity-60
                  disabled:cursor-not-allowed
                  transition-all
                "
              >

                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Processing...
                  </>
                ) : (
                  <>
                    Place Order
                  </>
                )}

              </button>


              <p className="hidden lg:block text-[11px] text-center text-[#8A806B] mt-3">
                We'll contact you once the order is confirmed.
              </p>

            </div>

          </div>

        </form>


        {/* ======================================
            MOBILE PLACE ORDER
        ====================================== */}
        <div className="lg:hidden mt-6">

          <button
            type="submit"
            form=""
            onClick={handlePlaceOrder}
            disabled={loading}
            className="
              w-full
              h-13
              rounded-xl
              bg-[#252525]
              text-white
              font-bold
              flex
              items-center
              justify-center
              gap-2
              hover:bg-[#A08E65]
              disabled:opacity-60
              disabled:cursor-not-allowed
              transition-all
            "
          >

            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Processing...
              </>
            ) : (
              <>
                Place Order · ৳{grandTotal}
              </>
            )}

          </button>

          <p className="text-[11px] text-center text-[#8A806B] mt-3">
            We'll contact you once the order is confirmed.
          </p>

        </div>

      </div>

    </section>
  );
};


// ======================================
// Empty Cart Icon
// ======================================
const FaShoppingCartIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="w-10 h-10 text-[#252525]"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 3h1.386c.51 0 .955.343 1.087.835L5.5 7.5m0 0h14.25l-1.5 7.5H7.25L5.5 7.5Zm1.75 7.5L6 17.25h12.75M9 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm9.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
      />
    </svg>
  );
};

export default Cart;