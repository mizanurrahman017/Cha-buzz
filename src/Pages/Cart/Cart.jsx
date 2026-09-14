import React, { useState } from "react";
import {
  FaMinus,
  FaPlus,
  FaTrash,
  FaArrowLeft,
  FaLock,
  FaMobileAlt,
  FaCheckCircle,
} from "react-icons/fa";

import { Link } from "react-router";

import {
  useCart,
} from "../../Contexts/CartContext";

import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

import {
  db,
} from "../../Firebase/Firebase.config";

const Cart = () => {
  const {
    cartItems,
    totalPrice,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  // ===============================
  // Form Data
  // ===============================

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    postcode: "",
    note: "",
  });

  // ===============================
  // Payment Method
  // ===============================

  const [paymentMethod, setPaymentMethod] =
    useState("");

  // ===============================
  // Loading
  // ===============================

  const [loading, setLoading] =
    useState(false);

  // ===============================
  // Payment Information Visible
  // ===============================

  const [showPaymentInfo, setShowPaymentInfo] =
    useState(false);

  // ===============================
  // Delivery
  // ===============================

  const deliveryFee =
    cartItems.length > 0 ? 50 : 0;

  const grandTotal =
    Number(totalPrice) +
    deliveryFee;

  // ===============================
  // Form Change
  // ===============================

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ===============================
  // Select Payment Method
  // ===============================

  const handlePaymentSelect = (
    method
  ) => {
    setPaymentMethod(method);

    setShowPaymentInfo(true);
  };

  // ===============================
  // Place Order
  // ===============================

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    // ===============================
    // Cart Check
    // ===============================

    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    // ===============================
    // Payment Check
    // ===============================

    if (!paymentMethod) {
      alert(
        "Please select bKash or Nagad payment."
      );
      return;
    }

    // ===============================
    // Required Fields
    // ===============================

    if (
      !formData.name.trim() ||
      !formData.phone.trim() ||
      !formData.address.trim() ||
      !formData.postcode.trim()
    ) {
      alert(
        "Please fill in all required fields."
      );
      return;
    }

    try {
      setLoading(true);

      // ===============================
      // Step 1
      // Create Pending Firestore Order
      // ===============================

      const orderData = {
        items: cartItems.map((item) => ({
          id: item.id,

          name: item.name,

          price: Number(item.price),

          quantity:
            Number(item.quantity),

          image:
            item.image || "",

          category:
            item.category || "",
        })),

        customer: {
          name:
            formData.name.trim(),

          phone:
            formData.phone.trim(),

          email:
            formData.email.trim(),

          address:
            formData.address.trim(),

          postcode:
            formData.postcode.trim(),

          note:
            formData.note.trim(),
        },

        subtotal:
          Number(totalPrice),

        deliveryFee:
          Number(deliveryFee),

        total:
          Number(grandTotal),

        orderSource:
          "online",

        paymentMethod:
          paymentMethod,

        paymentStatus:
          "pending",

        orderStatus:
          "pending",

        createdAt:
          serverTimestamp(),
      };

      const orderRef =
        await addDoc(
          collection(db, "orders"),
          orderData
        );

      console.log(
        "Pending order created:",
        orderRef.id
      );

      // ===============================
      // Step 2
      // Create SSLCommerz Session
      // ===============================

      const paymentResponse =
        await fetch(
          "http://localhost:5000/api/payment/create",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              orderId:
                orderRef.id,

              customer: {
                name:
                  formData.name.trim(),

                phone:
                  formData.phone.trim(),

                email:
                  formData.email.trim(),

                address:
                  formData.address.trim(),

                postcode:
                  formData.postcode.trim(),

                note:
                  formData.note.trim(),
              },

              items:
                cartItems.map(
                  (item) => ({
                    id: item.id,

                    name:
                      item.name,

                    price:
                      Number(
                        item.price
                      ),

                    quantity:
                      Number(
                        item.quantity
                      ),

                    category:
                      item.category ||
                      "",
                  })
                ),

              subtotal:
                Number(totalPrice),

              deliveryFee:
                Number(deliveryFee),

              total:
                Number(grandTotal),
            }),
          }
        );

      const paymentData =
        await paymentResponse.json();

      console.log(
        "Payment API response:",
        paymentData
      );

      // ===============================
      // Check Payment Response
      // ===============================

      if (
        !paymentResponse.ok ||
        !paymentData.success
      ) {
        throw new Error(
          paymentData.message ||
            "Failed to create payment session."
        );
      }

      // ===============================
      // Get Selected Gateway
      // ===============================

      const selectedPaymentURL =
        paymentData
          ?.paymentOptions?.[
          paymentMethod
        ];

      console.log(
        "Selected payment method:",
        paymentMethod
      );

      console.log(
        "Selected payment URL:",
        selectedPaymentURL
      );

      // ===============================
      // Redirect
      // ===============================

      if (selectedPaymentURL) {
        window.location.href =
          selectedPaymentURL;

        return;
      }

      // ===============================
      // Gateway Not Found
      // ===============================

      throw new Error(
        `${
          paymentMethod === "bkash"
            ? "bKash"
            : "Nagad"
        } payment gateway is not available right now.`
      );
    } catch (error) {
      console.error(
        "Online payment error:",
        error
      );

      alert(
        error.message ||
          "Something went wrong while processing your order."
      );
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // Empty Cart
  // ===============================

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] bg-[#F7F5EF] flex items-center justify-center px-4">
        <div className="text-center max-w-md">

          <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-white border border-[#E4E0D7] flex items-center justify-center shadow-sm">
            <FaMobileAlt className="text-2xl text-[#8A806B]" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#252525]">
            Your Cart is Empty
          </h1>

          <p className="mt-3 text-sm text-[#8A806B]">
            Add some delicious food from our menu before checking out.
          </p>

          <Link
            to="/"
            className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-xl bg-[#252525] text-white text-sm font-semibold hover:bg-[#A08E65] transition"
          >
            <FaArrowLeft size={12} />
            Continue Shopping
          </Link>

        </div>
      </div>
    );
  }

  // ===============================
  // Main
  // ===============================

  return (
    <div className="min-h-screen bg-[#F7F5EF] py-8 sm:py-10 lg:py-12">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ===============================
            Header
        =============================== */}

        <div className="mb-8">

          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#8A806B] hover:text-[#252525] transition"
          >
            <FaArrowLeft size={12} />
            Continue Shopping
          </Link>

          <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold text-[#252525]">
            Checkout
          </h1>

          <p className="mt-2 text-sm text-[#8A806B]">
            Review your order and complete your advance payment.
          </p>

        </div>

        {/* ===============================
            Grid
        =============================== */}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

          {/* ===============================
              LEFT SIDE
          =============================== */}

          <div className="lg:col-span-7 space-y-6">

            {/* ===============================
                Cart Items
            =============================== */}

            <div className="bg-white rounded-2xl border border-[#E4E0D7] shadow-sm overflow-hidden">

              <div className="px-5 py-4 border-b border-[#E4E0D7] flex items-center justify-between">

                <div>

                  <h2 className="text-lg font-bold text-[#252525]">
                    Your Order
                  </h2>

                  <p className="text-xs text-[#8A806B] mt-1">
                    {cartItems.reduce(
                      (total, item) =>
                        total +
                        item.quantity,
                      0
                    )}{" "}
                    items
                  </p>

                </div>

                <button
                  type="button"
                  onClick={clearCart}
                  className="text-xs font-semibold text-red-500 hover:text-red-600 transition"
                >
                  Clear Cart
                </button>

              </div>

              <div className="divide-y divide-[#E4E0D7]">

                {cartItems.map(
                  (item) => (
                    <div
                      key={item.id}
                      className="p-4 sm:p-5 flex gap-4"
                    >

                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover shrink-0"
                      />

                      <div className="flex-1 min-w-0">

                        <div className="flex justify-between gap-3">

                          <div>

                            <h3 className="font-bold text-[#252525] text-sm sm:text-base line-clamp-2">
                              {item.name}
                            </h3>

                            <p className="text-xs text-[#8A806B] mt-1">
                              ৳{item.price} each
                            </p>

                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              removeFromCart(
                                item.id
                              )
                            }
                            className="text-[#8A806B] hover:text-red-500 transition"
                          >
                            <FaTrash size={13} />
                          </button>

                        </div>

                        <div className="mt-3 flex items-center justify-between">

                          <div className="flex items-center border border-[#D8D5CC] rounded-lg overflow-hidden">

                            <button
                              type="button"
                              onClick={() =>
                                decreaseQuantity(
                                  item.id
                                )
                              }
                              className="w-8 h-8 flex items-center justify-center text-[#252525] hover:bg-[#F7F5EF] transition"
                            >
                              <FaMinus size={10} />
                            </button>

                            <span className="w-9 text-center text-sm font-bold text-[#252525]">
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                increaseQuantity(
                                  item.id
                                )
                              }
                              className="w-8 h-8 flex items-center justify-center text-[#252525] hover:bg-[#F7F5EF] transition"
                            >
                              <FaPlus size={10} />
                            </button>

                          </div>

                          <p className="font-extrabold text-[#252525]">
                            ৳
                            {Number(
                              item.price
                            ) *
                              Number(
                                item.quantity
                              )}
                          </p>

                        </div>

                      </div>

                    </div>
                  )
                )}

              </div>

            </div>

            {/* ===============================
                Customer Information
            =============================== */}

            <form
              onSubmit={
                handlePlaceOrder
              }
              id="checkout-form"
              className="bg-white rounded-2xl border border-[#E4E0D7] shadow-sm overflow-hidden"
            >

              <div className="px-5 py-4 border-b border-[#E4E0D7]">

                <h2 className="text-lg font-bold text-[#252525]">
                  Delivery Information
                </h2>

                <p className="text-xs text-[#8A806B] mt-1">
                  We need these details to deliver your order.
                </p>

              </div>

              <div className="p-5 space-y-5">

                {/* Name */}

                <div>

                  <label className="block text-sm font-semibold text-[#252525] mb-2">
                    Name{" "}
                    <span className="text-red-500">
                      *
                    </span>
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={
                      formData.name
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter your full name"
                    required
                    className="w-full h-12 px-4 rounded-xl border border-[#D8D5CC] bg-[#FCFBF8] outline-none text-sm text-[#252525] placeholder:text-[#A8A092] focus:border-[#252525] transition"
                  />

                </div>

                {/* Phone */}

                <div>

                  <label className="block text-sm font-semibold text-[#252525] mb-2">
                    Phone Number{" "}
                    <span className="text-red-500">
                      *
                    </span>
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={
                      formData.phone
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="01XXXXXXXXX"
                    required
                    className="w-full h-12 px-4 rounded-xl border border-[#D8D5CC] bg-[#FCFBF8] outline-none text-sm text-[#252525] placeholder:text-[#A8A092] focus:border-[#252525] transition"
                  />

                </div>

                {/* Email */}

                <div>

                  <label className="block text-sm font-semibold text-[#252525] mb-2">
                    Email Address{" "}
                    <span className="text-xs font-normal text-[#8A806B]">
                      (Optional)
                    </span>
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={
                      formData.email
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="example@gmail.com"
                    className="w-full h-12 px-4 rounded-xl border border-[#D8D5CC] bg-[#FCFBF8] outline-none text-sm text-[#252525] placeholder:text-[#A8A092] focus:border-[#252525] transition"
                  />

                </div>

                {/* Address */}

                <div>

                  <label className="block text-sm font-semibold text-[#252525] mb-2">
                    Delivery Address{" "}
                    <span className="text-red-500">
                      *
                    </span>
                  </label>

                  <textarea
                    name="address"
                    value={
                      formData.address
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="House/Road, Area, City"
                    required
                    rows="3"
                    className="w-full px-4 py-3 rounded-xl border border-[#D8D5CC] bg-[#FCFBF8] outline-none resize-none text-sm text-[#252525] placeholder:text-[#A8A092] focus:border-[#252525] transition"
                  />

                </div>

                {/* Postcode */}

                <div>

                  <label className="block text-sm font-semibold text-[#252525] mb-2">
                    Postcode{" "}
                    <span className="text-red-500">
                      *
                    </span>
                  </label>

                  <input
                    type="text"
                    name="postcode"
                    value={
                      formData.postcode
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="e.g. 3100"
                    required
                    inputMode="numeric"
                    maxLength={10}
                    className="w-full h-12 px-4 rounded-xl border border-[#D8D5CC] bg-[#FCFBF8] outline-none text-sm text-[#252525] placeholder:text-[#A8A092] focus:border-[#252525] transition"
                  />

                  <p className="mt-1.5 text-[11px] text-[#8A806B]">
                    Enter the postcode of your delivery area.
                  </p>

                </div>

                {/* Note */}

                <div>

                  <label className="block text-sm font-semibold text-[#252525] mb-2">
                    Note{" "}
                    <span className="text-xs font-normal text-[#8A806B]">
                      (Optional)
                    </span>
                  </label>

                  <textarea
                    name="note"
                    value={
                      formData.note
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Any special instruction?"
                    rows="3"
                    className="w-full px-4 py-3 rounded-xl border border-[#D8D5CC] bg-[#FCFBF8] outline-none resize-none text-sm text-[#252525] placeholder:text-[#A8A092] focus:border-[#252525] transition"
                  />

                </div>

                {/* ===============================
                    Payment Method
                =============================== */}

                <div>

                  <div className="flex items-center justify-between mb-3">

                    <div>

                      <label className="block text-sm font-semibold text-[#252525]">
                        Payment Method
                      </label>

                      <p className="text-xs text-[#8A806B] mt-1">
                        Select how you want to pay in advance.
                      </p>

                    </div>

                    <FaLock
                      className="text-[#8A806B]"
                      size={14}
                    />

                  </div>

                  {/* Payment Options */}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                    {/* bKash */}

                    <button
                      type="button"
                      onClick={() =>
                        handlePaymentSelect(
                          "bkash"
                        )
                      }
                      className={`
                        relative p-4 rounded-xl border-2 text-left transition-all
                        ${
                          paymentMethod ===
                          "bkash"
                            ? "border-[#252525] bg-[#FCFBF8]"
                            : "border-[#E4E0D7] bg-white hover:border-[#A8A092]"
                        }
                      `}
                    >

                      {paymentMethod ===
                        "bkash" && (
                        <FaCheckCircle
                          className="absolute top-3 right-3 text-[#252525]"
                          size={16}
                        />
                      )}

                      <div className="flex items-center gap-3">

                        <div className="w-12 h-12 rounded-xl bg-[#E2136E] flex items-center justify-center text-white font-extrabold text-lg">
                          bK
                        </div>

                        <div>

                          <p className="font-bold text-[#252525]">
                            bKash
                          </p>

                          <p className="text-xs text-[#8A806B] mt-0.5">
                            Pay with bKash
                          </p>

                        </div>

                      </div>

                    </button>

                    {/* Nagad */}

                    <button
                      type="button"
                      onClick={() =>
                        handlePaymentSelect(
                          "nagad"
                        )
                      }
                      className={`
                        relative p-4 rounded-xl border-2 text-left transition-all
                        ${
                          paymentMethod ===
                          "nagad"
                            ? "border-[#252525] bg-[#FCFBF8]"
                            : "border-[#E4E0D7] bg-white hover:border-[#A8A092]"
                        }
                      `}
                    >

                      {paymentMethod ===
                        "nagad" && (
                        <FaCheckCircle
                          className="absolute top-3 right-3 text-[#252525]"
                          size={16}
                        />
                      )}

                      <div className="flex items-center gap-3">

                        <div className="w-12 h-12 rounded-xl bg-[#F58220] flex items-center justify-center text-white font-extrabold text-lg">
                          N
                        </div>

                        <div>

                          <p className="font-bold text-[#252525]">
                            Nagad
                          </p>

                          <p className="text-xs text-[#8A806B] mt-0.5">
                            Pay with Nagad
                          </p>

                        </div>

                      </div>

                    </button>

                  </div>

                  {/* ===============================
                      Payment Instructions
                  =============================== */}

                  {showPaymentInfo &&
                    paymentMethod && (
                      <div className="mt-4 rounded-xl border border-[#D8D5CC] bg-[#F7F5EF] p-4">

                        <div className="flex items-start gap-3">

                          <div
                            className={`
                              w-10 h-10 rounded-lg flex items-center justify-center text-white shrink-0
                              ${
                                paymentMethod ===
                                "bkash"
                                  ? "bg-[#E2136E]"
                                  : "bg-[#F58220]"
                              }
                            `}
                          >

                            <FaMobileAlt
                              size={16}
                            />

                          </div>

                          <div>

                            <h3 className="font-bold text-[#252525] text-sm">

                              {paymentMethod ===
                              "bkash"
                                ? "How to pay with bKash"
                                : "How to pay with Nagad"}

                            </h3>

                            <div className="mt-2 space-y-1.5 text-xs text-[#6F6758]">

                              <p>
                                <strong>
                                  1.
                                </strong>{" "}
                                Click the payment button below.
                              </p>

                              <p>
                                <strong>
                                  2.
                                </strong>{" "}
                                You will be taken to the secure{" "}
                                {paymentMethod ===
                                "bkash"
                                  ? "bKash"
                                  : "Nagad"}{" "}
                                payment page.
                              </p>

                              <p>
                                <strong>
                                  3.
                                </strong>{" "}
                                Follow the instructions there and complete your payment.
                              </p>

                              <p>
                                <strong>
                                  4.
                                </strong>{" "}
                                Your order will be confirmed after successful payment verification.
                              </p>

                            </div>

                          </div>

                        </div>

                      </div>
                    )}

                </div>

                {/* ===============================
                    Mobile Button
                =============================== */}

                <button
                  type="submit"
                  disabled={loading}
                  className="lg:hidden w-full h-12 rounded-xl bg-[#252525] text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#A08E65] disabled:opacity-60 disabled:cursor-not-allowed transition"
                >

                  {loading ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>

                      Redirecting...
                    </>
                  ) : (
                    <>
                      <FaLock size={12} />

                      {paymentMethod
                        ? `Pay ৳${grandTotal} with ${
                            paymentMethod ===
                            "bkash"
                              ? "bKash"
                              : "Nagad"
                          }`
                        : "Select Payment Method"}
                    </>
                  )}

                </button>

                <p className="text-center text-xs text-[#8A806B]">
                  We'll contact you once the order is confirmed.
                </p>

              </div>

            </form>

          </div>

          {/* ===============================
              RIGHT SIDE
          =============================== */}

          <div className="lg:col-span-5">

            <div className="lg:sticky lg:top-6">

              <div className="bg-white rounded-2xl border border-[#E4E0D7] shadow-sm overflow-hidden">

                <div className="px-5 py-4 border-b border-[#E4E0D7]">

                  <h2 className="text-lg font-bold text-[#252525]">
                    Order Summary
                  </h2>

                </div>

                <div className="p-5">

                  {/* Items */}

                  <div className="space-y-3">

                    {cartItems.map(
                      (item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between gap-4 text-sm"
                        >

                          <div className="flex-1 min-w-0">

                            <p className="font-medium text-[#252525] truncate">
                              {item.name}
                            </p>

                            <p className="text-xs text-[#8A806B] mt-0.5">
                              {item.quantity} × ৳
                              {item.price}
                            </p>

                          </div>

                          <p className="font-semibold text-[#252525]">
                            ৳
                            {Number(
                              item.price
                            ) *
                              Number(
                                item.quantity
                              )}
                          </p>

                        </div>
                      )
                    )}

                  </div>

                  {/* Divider */}

                  <div className="my-5 border-t border-dashed border-[#D8D5CC]" />

                  {/* Subtotal */}

                  <div className="flex justify-between text-sm">

                    <span className="text-[#8A806B]">
                      Subtotal
                    </span>

                    <span className="font-semibold text-[#252525]">
                      ৳{totalPrice}
                    </span>

                  </div>

                  {/* Delivery */}

                  <div className="flex justify-between text-sm mt-3">

                    <span className="text-[#8A806B]">
                      Delivery Fee
                    </span>

                    <span className="font-semibold text-[#252525]">
                      ৳{deliveryFee}
                    </span>

                  </div>

                  {/* Total */}

                  <div className="mt-5 pt-5 border-t border-[#E4E0D7] flex justify-between items-center">

                    <span className="font-bold text-[#252525]">
                      Total
                    </span>

                    <span className="text-2xl font-extrabold text-[#252525]">
                      ৳{grandTotal}
                    </span>

                  </div>

                  {/* Selected Payment */}

                  {paymentMethod && (
                    <div className="mt-4 p-3 rounded-xl bg-[#F7F5EF] border border-[#E4E0D7]">

                      <div className="flex justify-between items-center">

                        <span className="text-xs text-[#8A806B]">
                          Payment
                        </span>

                        <span className="text-sm font-bold text-[#252525]">

                          {paymentMethod ===
                          "bkash"
                            ? "bKash"
                            : "Nagad"}

                        </span>

                      </div>

                    </div>
                  )}

                  {/* Desktop Button */}

                  <button
                    type="submit"
                    form="checkout-form"
                    disabled={loading}
                    className="hidden lg:flex mt-6 w-full h-12 rounded-xl bg-[#252525] text-white font-bold text-sm items-center justify-center gap-2 hover:bg-[#A08E65] disabled:opacity-60 disabled:cursor-not-allowed transition"
                  >

                    {loading ? (
                      <>
                        <span className="loading loading-spinner loading-sm"></span>

                        Redirecting...
                      </>
                    ) : (
                      <>
                        <FaLock size={12} />

                        {paymentMethod
                          ? `Pay ৳${grandTotal} with ${
                              paymentMethod ===
                              "bkash"
                                ? "bKash"
                                : "Nagad"
                            }`
                          : "Select Payment Method"}
                      </>
                    )}

                  </button>

                  {/* Security */}

                  <div className="mt-5 flex items-start gap-3 p-3 rounded-xl bg-[#F7F5EF]">

                    <FaLock
                      className="text-[#8A806B] mt-0.5 shrink-0"
                      size={13}
                    />

                    <p className="text-[11px] leading-relaxed text-[#8A806B]">
                      Your payment is processed securely through SSLCOMMERZ. Your order will only be confirmed after successful payment verification.
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Cart;