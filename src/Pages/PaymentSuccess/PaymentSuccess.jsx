import React, { useEffect, useRef, useState } from "react";
import {
  FaCheckCircle,
  FaReceipt,
  FaHome,
  FaShoppingBag,
  FaCreditCard,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaUser,
  FaClock,
} from "react-icons/fa";
import { Link, useSearchParams } from "react-router";

import { doc, getDoc } from "firebase/firestore";
import { db } from "../../Firebase/Firebase.config";

import { useCart } from "../../Contexts/CartContext";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Prevent cart clear / processing from happening multiple times
  const processedRef = useRef(false);

  const orderId = searchParams.get("orderId");

  useEffect(() => {
    if (processedRef.current) return;

    const loadOrder = async () => {
      if (!orderId) {
        setError("Order ID was not found.");
        setLoading(false);
        return;
      }

      try {
        processedRef.current = true;

        const orderRef = doc(db, "orders", orderId);
        const orderSnap = await getDoc(orderRef);

        if (!orderSnap.exists()) {
          setError("Order not found.");
          setLoading(false);
          return;
        }

        const orderData = {
          id: orderSnap.id,
          ...orderSnap.data(),
        };

        console.log("Payment success order:", orderData);
        console.log(
          "Payment Status:",
          orderData.paymentStatus
        );
        console.log(
          "Order Status:",
          orderData.orderStatus
        );

        // Payment must be successfully verified
        if (
          orderData.paymentStatus !== "paid" ||
          orderData.orderStatus !== "confirmed"
        ) {
          setError(
            "Your payment has not been confirmed yet. Please contact Cha Buzz if money was deducted."
          );

          setLoading(false);
          return;
        }

        // Payment successfully confirmed
        setOrder(orderData);

        // Clear customer cart only after verified payment
        clearCart();
      } catch (err) {
        console.error("Failed to load order:", err);

        setError(
          "Unable to load your order information. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [orderId, clearCart]);

  // ------------------------------------
  // Loading
  // ------------------------------------
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F5EF] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto rounded-full border-4 border-[#D8D5CC] border-t-[#252525] animate-spin"></div>

          <h2 className="mt-6 text-xl sm:text-2xl font-bold text-[#252525]">
            Confirming your order...
          </h2>

          <p className="mt-2 text-sm sm:text-base text-[#8A806B]">
            Please wait a moment.
          </p>
        </div>
      </div>
    );
  }

  // ------------------------------------
  // Error
  // ------------------------------------
  if (error) {
    return (
      <div className="min-h-screen bg-[#F7F5EF] flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-lg bg-white rounded-3xl border border-[#E4E0D7] shadow-xl p-6 sm:p-10 text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-red-50 flex items-center justify-center">
            <span className="text-4xl">!</span>
          </div>

          <h1 className="mt-6 text-2xl sm:text-3xl font-extrabold text-[#252525]">
            Payment Confirmation Issue
          </h1>

          <p className="mt-3 text-sm sm:text-base text-[#8A806B] leading-relaxed">
            {error}
          </p>

          {orderId && (
            <div className="mt-5 bg-[#F7F5EF] rounded-xl p-4">
              <p className="text-xs text-[#8A806B]">
                Order ID
              </p>

              <p className="mt-1 font-bold text-[#252525] break-all">
                {orderId}
              </p>
            </div>
          )}

          <div className="mt-7 flex flex-col sm:flex-row gap-3">
            <Link
              to="/"
              className="flex-1 h-12 rounded-xl bg-[#252525] text-white flex items-center justify-center gap-2 font-semibold hover:bg-[#A08E65] transition"
            >
              <FaHome />
              Back Home
            </Link>

            <Link
              to="/cart"
              className="flex-1 h-12 rounded-xl border border-[#252525] text-[#252525] flex items-center justify-center gap-2 font-semibold hover:bg-[#252525] hover:text-white transition"
            >
              <FaShoppingBag />
              View Cart
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ------------------------------------
  // Success
  // ------------------------------------
  if (!order) {
    return null;
  }

  const {
    customer = {},
    items = [],
    subtotal = 0,
    deliveryFee = 0,
    total = 0,
    paymentMethod = "online",
    paymentStatus,
    orderStatus,
    transactionId,
    currency = "BDT",
    createdAt,
  } = order;

  // Firestore Timestamp formatting
  const formattedDate = createdAt?.toDate
    ? createdAt.toDate().toLocaleString("en-BD", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "Just now";

  return (
    <div className="min-h-screen bg-[#F7F5EF] py-8 sm:py-12 px-4">
      <div className="max-w-4xl mx-auto">

        {/* =====================================
            SUCCESS HEADER
        ====================================== */}
        <div className="text-center">

          <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full bg-green-50 flex items-center justify-center">
            <FaCheckCircle
              className="text-green-500"
              size={58}
            />
          </div>

          <h1 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#252525]">
            Order Confirmed!
          </h1>

          <p className="mt-3 text-sm sm:text-base text-[#8A806B] max-w-xl mx-auto leading-relaxed">
            Thank you for ordering from Cha Buzz.
            Your payment has been successfully verified
            and your order is now confirmed.
          </p>
        </div>

        {/* =====================================
            ORDER SUMMARY CARD
        ====================================== */}
        <div className="mt-8 bg-white rounded-3xl border border-[#E4E0D7] shadow-[0_8px_35px_rgba(37,37,37,0.08)] overflow-hidden">

          {/* Top Order Header */}
          <div className="p-5 sm:p-7 border-b border-[#E4E0D7] bg-[#FCFBF8]">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#252525] text-white flex items-center justify-center">
                  <FaReceipt size={20} />
                </div>

                <div>
                  <p className="text-xs text-[#8A806B]">
                    Order ID
                  </p>

                  <p className="font-bold text-[#252525] break-all">
                    {order.id}
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <p className="text-xs text-[#8A806B]">
                  Order Status
                </p>

                <span className="inline-flex mt-1 px-3 py-1.5 rounded-full bg-green-50 text-green-700 text-xs font-bold capitalize">
                  {orderStatus}
                </span>
              </div>

            </div>
          </div>

          {/* =====================================
              PAYMENT INFORMATION
          ====================================== */}
          <div className="p-5 sm:p-7 border-b border-[#E4E0D7]">

            <h2 className="text-lg sm:text-xl font-bold text-[#252525]">
              Payment Information
            </h2>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* Payment Status */}
              <div className="flex items-center gap-3 bg-[#F7F5EF] rounded-xl p-4">
                <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                  <FaCheckCircle
                    className="text-green-600"
                    size={17}
                  />
                </div>

                <div>
                  <p className="text-xs text-[#8A806B]">
                    Payment Status
                  </p>

                  <p className="font-bold text-green-600 capitalize">
                    {paymentStatus}
                  </p>
                </div>
              </div>

              {/* Payment Method */}
              <div className="flex items-center gap-3 bg-[#F7F5EF] rounded-xl p-4">
                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                  <FaCreditCard
                    className="text-[#252525]"
                    size={17}
                  />
                </div>

                <div>
                  <p className="text-xs text-[#8A806B]">
                    Payment Method
                  </p>

                  <p className="font-bold text-[#252525] capitalize">
                    {paymentMethod}
                  </p>
                </div>
              </div>

              {/* Transaction ID */}
              {transactionId && (
                <div className="sm:col-span-2 bg-[#F7F5EF] rounded-xl p-4">
                  <p className="text-xs text-[#8A806B]">
                    Transaction ID
                  </p>

                  <p className="mt-1 font-bold text-[#252525] break-all text-sm">
                    {transactionId}
                  </p>
                </div>
              )}

            </div>
          </div>

          {/* =====================================
              CUSTOMER INFORMATION
          ====================================== */}
          <div className="p-5 sm:p-7 border-b border-[#E4E0D7]">

            <h2 className="text-lg sm:text-xl font-bold text-[#252525]">
              Customer Information
            </h2>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* Name */}
              {customer.name && (
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#F7F5EF] flex items-center justify-center shrink-0">
                    <FaUser
                      className="text-[#8A806B]"
                      size={14}
                    />
                  </div>

                  <div>
                    <p className="text-xs text-[#8A806B]">
                      Name
                    </p>

                    <p className="mt-1 font-semibold text-[#252525]">
                      {customer.name}
                    </p>
                  </div>
                </div>
              )}

              {/* Phone */}
              {customer.phone && (
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#F7F5EF] flex items-center justify-center shrink-0">
                    <FaPhoneAlt
                      className="text-[#8A806B]"
                      size={14}
                    />
                  </div>

                  <div>
                    <p className="text-xs text-[#8A806B]">
                      Phone
                    </p>

                    <p className="mt-1 font-semibold text-[#252525]">
                      {customer.phone}
                    </p>
                  </div>
                </div>
              )}

              {/* Address */}
              {customer.address && (
                <div className="flex items-start gap-3 sm:col-span-2">
                  <div className="w-9 h-9 rounded-lg bg-[#F7F5EF] flex items-center justify-center shrink-0">
                    <FaMapMarkerAlt
                      className="text-[#8A806B]"
                      size={14}
                    />
                  </div>

                  <div>
                    <p className="text-xs text-[#8A806B]">
                      Delivery Address
                    </p>

                    <p className="mt-1 font-semibold text-[#252525]">
                      {customer.address}
                    </p>
                  </div>
                </div>
              )}

              {/* Email */}
              {customer.email && (
                <div className="flex items-start gap-3 sm:col-span-2">
                  <div className="w-9 h-9 rounded-lg bg-[#F7F5EF] flex items-center justify-center shrink-0">
                    <span className="text-[#8A806B] text-sm">
                      @
                    </span>
                  </div>

                  <div>
                    <p className="text-xs text-[#8A806B]">
                      Email
                    </p>

                    <p className="mt-1 font-semibold text-[#252525] break-all">
                      {customer.email}
                    </p>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* =====================================
              ORDERED ITEMS
          ====================================== */}
          <div className="p-5 sm:p-7 border-b border-[#E4E0D7]">

            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg sm:text-xl font-bold text-[#252525]">
                Ordered Items
              </h2>

              <span className="text-xs sm:text-sm text-[#8A806B]">
                {items.length} item
                {items.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="mt-5 space-y-4">

              {items.map((item, index) => {
                const itemPrice = Number(item.price) || 0;
                const quantity = Number(item.quantity) || 0;
                const itemTotal = itemPrice * quantity;

                return (
                  <div
                    key={item.id || index}
                    className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-[#FCFBF8] rounded-2xl border border-[#E4E0D7]"
                  >

                    {/* Image */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-[#F7F5EF] shrink-0">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-[#8A806B]">
                          No Image
                        </div>
                      )}
                    </div>

                    {/* Name */}
                    <div className="flex-1 min-w-0">

                      <h3 className="font-bold text-sm sm:text-base text-[#252525] truncate">
                        {item.name}
                      </h3>

                      {item.category && (
                        <p className="mt-1 text-xs text-[#8A806B]">
                          {item.category}
                        </p>
                      )}

                      <p className="mt-1 text-xs sm:text-sm text-[#8A806B]">
                        ৳{itemPrice} × {quantity}
                      </p>

                    </div>

                    {/* Total */}
                    <div className="text-right shrink-0">
                      <p className="font-extrabold text-[#252525] text-sm sm:text-base">
                        ৳{itemTotal}
                      </p>
                    </div>

                  </div>
                );
              })}

            </div>
          </div>

          {/* =====================================
              PRICE SUMMARY
          ====================================== */}
          <div className="p-5 sm:p-7">

            <h2 className="text-lg sm:text-xl font-bold text-[#252525]">
              Price Summary
            </h2>

            <div className="mt-5 space-y-3">

              <div className="flex items-center justify-between text-sm">
                <span className="text-[#8A806B]">
                  Subtotal
                </span>

                <span className="font-semibold text-[#252525]">
                  ৳{Number(subtotal).toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-[#8A806B]">
                  Delivery Fee
                </span>

                <span className="font-semibold text-[#252525]">
                  ৳{Number(deliveryFee).toFixed(2)}
                </span>
              </div>

              <div className="border-t border-[#E4E0D7] pt-4 mt-4 flex items-center justify-between">
                <span className="text-lg font-bold text-[#252525]">
                  Total
                </span>

                <span className="text-2xl sm:text-3xl font-extrabold text-[#252525]">
                  ৳{Number(total).toFixed(2)}
                  <span className="text-xs sm:text-sm ml-1 font-semibold">
                    {currency}
                  </span>
                </span>
              </div>

            </div>
          </div>

        </div>

        {/* =====================================
            ORDER TIME
        ====================================== */}
        <div className="mt-5 bg-white rounded-2xl border border-[#E4E0D7] p-5 flex items-center gap-4">

          <div className="w-11 h-11 rounded-xl bg-[#F7F5EF] flex items-center justify-center shrink-0">
            <FaClock
              className="text-[#8A806B]"
              size={18}
            />
          </div>

          <div>
            <p className="text-xs text-[#8A806B]">
              Order placed
            </p>

            <p className="mt-1 font-semibold text-[#252525]">
              {formattedDate}
            </p>
          </div>

        </div>

        {/* =====================================
            MESSAGE
        ====================================== */}
        <div className="mt-5 bg-[#252525] text-white rounded-2xl p-5 sm:p-6 text-center">

          <p className="text-sm sm:text-base leading-relaxed">
            Your order has been received by Cha Buzz.
            We will prepare your food and contact you
            if any additional information is needed.
          </p>

        </div>

        {/* =====================================
            ACTION BUTTONS
        ====================================== */}
        <div className="mt-7 flex flex-col sm:flex-row gap-3">

          <Link
            to="/"
            className="flex-1 h-12 sm:h-14 rounded-xl bg-[#252525] text-white flex items-center justify-center gap-2 font-bold hover:bg-[#A08E65] transition-all duration-200"
          >
            <FaHome />
            Back to Home
          </Link>

          <Link
            to="/"
            className="flex-1 h-12 sm:h-14 rounded-xl border border-[#252525] bg-white text-[#252525] flex items-center justify-center gap-2 font-bold hover:bg-[#252525] hover:text-white transition-all duration-200"
          >
            <FaShoppingBag />
            Order More
          </Link>

        </div>

      </div>
    </div>
  );
};

export default PaymentSuccess;