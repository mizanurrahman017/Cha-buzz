import React, { useEffect, useState } from "react";

import {
  FaCheckCircle,
  FaReceipt,
  FaHome,
  FaShoppingBag,
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

  // ==========================================
  // GET ORDER ID FROM URL
  // Example:
  // /payment-success?orderId=abc123
  // ==========================================

  const orderId = searchParams.get("orderId");

  useEffect(() => {
    const loadOrder = async () => {
      if (!orderId) {
        setError("Order ID was not found.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        // ==========================================
        // GET ORDER FROM FIRESTORE
        // ==========================================

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

        // ==========================================
        // CHECK PAYMENT STATUS
        // ==========================================

        if (orderData.paymentStatus !== "paid") {
          setError(
            "Your payment has not been confirmed yet. Please contact Cha Buzz if money was deducted."
          );

          setLoading(false);
          return;
        }

        // ==========================================
        // CHECK ORDER STATUS
        // ==========================================

        if (orderData.orderStatus !== "confirmed") {
          setError(
            "Your payment was received, but the order is not confirmed yet."
          );

          setLoading(false);
          return;
        }

        // ==========================================
        // PAYMENT + ORDER CONFIRMED
        // ==========================================

        setOrder(orderData);

        // Clear customer cart
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

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-[75vh] bg-[#F7F5EF] flex items-center justify-center px-4">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-[#252525]"></span>

          <p className="mt-4 text-sm text-[#8A806B]">
            Confirming your order...
          </p>

          <p className="mt-1 text-xs text-[#A08E65]">
            Please wait a moment.
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error || !order) {
    return (
      <div className="min-h-[75vh] bg-[#F7F5EF] flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md bg-white rounded-2xl border border-[#E4E0D7] shadow-sm p-8 text-center">
          {/* Error Icon */}

          <div className="w-16 h-16 mx-auto rounded-full bg-red-50 flex items-center justify-center">
            <span className="text-red-500 text-2xl font-bold">
              !
            </span>
          </div>

          {/* Title */}

          <h1 className="mt-5 text-2xl font-extrabold text-[#252525]">
            Order Confirmation Failed
          </h1>

          {/* Error */}

          <p className="mt-2 text-sm leading-6 text-[#8A806B]">
            {error || "We couldn't confirm your order."}
          </p>

          {/* Order ID */}

          {orderId && (
            <div className="mt-4 rounded-xl bg-[#F7F5EF] p-3">
              <p className="text-[10px] uppercase tracking-wider text-[#8A806B]">
                Order ID
              </p>

              <p className="mt-1 text-xs font-semibold text-[#252525] break-all">
                {orderId}
              </p>
            </div>
          )}

          {/* Home */}

          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 mt-6 px-6 py-3 rounded-xl bg-[#252525] text-white text-sm font-semibold hover:bg-[#A08E65] transition"
          >
            <FaHome size={13} />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // ==========================================
  // PAYMENT METHOD
  // ==========================================

  const paymentMethod =
    order.paymentMethod === "bkash"
      ? "bKash"
      : order.paymentMethod === "nagad"
      ? "Nagad"
      : "Online Payment";

  // ==========================================
  // MAIN SUCCESS PAGE
  // ==========================================

  return (
    <div className="min-h-screen bg-[#F7F5EF] py-10 sm:py-14">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">

        {/* ==========================================
            SUCCESS HEADER
        ========================================== */}

        <div className="text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-green-50 border border-green-100 flex items-center justify-center">
            <FaCheckCircle
              className="text-green-500"
              size={42}
            />
          </div>

          <h1 className="mt-6 text-3xl sm:text-4xl font-extrabold text-[#252525]">
            Order Confirmed!
          </h1>

          <p className="mt-3 text-sm sm:text-base text-[#8A806B] max-w-lg mx-auto leading-6">
            Thank you for your order. Your payment has been
            successfully verified and your order is now confirmed.
          </p>
        </div>

        {/* ==========================================
            ORDER CARD
        ========================================== */}

        <div className="mt-8 bg-white rounded-2xl border border-[#E4E0D7] shadow-sm overflow-hidden">

          {/* ==========================================
              ORDER HEADER
          ========================================== */}

          <div className="px-5 sm:px-6 py-5 border-b border-[#E4E0D7] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F7F5EF] flex items-center justify-center">
                <FaReceipt
                  className="text-[#252525]"
                  size={16}
                />
              </div>

              <div>
                <h2 className="font-bold text-[#252525]">
                  Order Details
                </h2>

                <p className="text-xs text-[#8A806B] mt-0.5">
                  Your order has been received
                </p>
              </div>
            </div>

            <div className="sm:text-right">
              <p className="text-[10px] uppercase tracking-wider text-[#8A806B]">
                Order ID
              </p>

              <p className="text-xs sm:text-sm font-bold text-[#252525] break-all">
                {order.id}
              </p>
            </div>
          </div>

          {/* ==========================================
              ORDER BODY
          ========================================== */}

          <div className="p-5 sm:p-6">

            {/* ==========================================
                PAYMENT INFORMATION
            ========================================== */}

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">

              {/* Payment */}

              <div className="rounded-xl bg-[#F7F5EF] p-4">
                <p className="text-[11px] text-[#8A806B]">
                  Payment
                </p>

                <p className="mt-1 font-bold text-[#252525]">
                  {paymentMethod}
                </p>
              </div>

              {/* Payment Status */}

              <div className="rounded-xl bg-[#F7F5EF] p-4">
                <p className="text-[11px] text-[#8A806B]">
                  Payment Status
                </p>

                <p className="mt-1 font-bold text-green-600">
                  Paid
                </p>
              </div>

              {/* Order Status */}

              <div className="rounded-xl bg-[#F7F5EF] p-4 col-span-2 sm:col-span-1">
                <p className="text-[11px] text-[#8A806B]">
                  Order Status
                </p>

                <p className="mt-1 font-bold text-green-600 capitalize">
                  {order.orderStatus || "confirmed"}
                </p>
              </div>
            </div>

            {/* ==========================================
                ORDERED ITEMS
            ========================================== */}

            <div className="mt-7">
              <h3 className="font-bold text-[#252525] mb-4">
                Ordered Items
              </h3>

              <div className="divide-y divide-[#E4E0D7] border border-[#E4E0D7] rounded-xl overflow-hidden">

                {order.items?.map((item, index) => (
                  <div
                    key={`${item.id}-${index}`}
                    className="p-4 flex items-center gap-3"
                  >
                    {/* Image */}

                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 rounded-lg object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-lg bg-[#F7F5EF] flex items-center justify-center shrink-0 text-xs text-[#8A806B]">
                        Food
                      </div>
                    )}

                    {/* Info */}

                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-[#252525] truncate">
                        {item.name}
                      </p>

                      <p className="text-xs text-[#8A806B] mt-1">
                        {item.quantity} × ৳{item.price}
                      </p>
                    </div>

                    {/* Item Total */}

                    <p className="font-bold text-sm text-[#252525]">
                      ৳
                      {Number(item.price) *
                        Number(item.quantity)}
                    </p>
                  </div>
                ))}

              </div>
            </div>

            {/* ==========================================
                PRICE SUMMARY
            ========================================== */}

            <div className="mt-6 pt-5 border-t border-[#E4E0D7] space-y-3">

              {/* Subtotal */}

              <div className="flex justify-between text-sm">
                <span className="text-[#8A806B]">
                  Subtotal
                </span>

                <span className="font-semibold text-[#252525]">
                  ৳{Number(order.subtotal || 0)}
                </span>
              </div>

              {/* Delivery */}

              <div className="flex justify-between text-sm">
                <span className="text-[#8A806B]">
                  Delivery Fee
                </span>

                <span className="font-semibold text-[#252525]">
                  ৳{Number(order.deliveryFee || 0)}
                </span>
              </div>

              {/* Total */}

              <div className="pt-4 mt-2 border-t border-[#E4E0D7] flex justify-between items-center">
                <span className="font-bold text-[#252525]">
                  Total Paid
                </span>

                <span className="text-2xl font-extrabold text-[#252525]">
                  ৳{Number(order.total || 0)}
                </span>
              </div>
            </div>

            {/* ==========================================
                CUSTOMER INFORMATION
            ========================================== */}

            {order.customer && (
              <div className="mt-6 pt-6 border-t border-[#E4E0D7]">

                <h3 className="font-bold text-[#252525] mb-4">
                  Delivery Information
                </h3>

                <div className="rounded-xl bg-[#F7F5EF] p-4 space-y-2 text-sm">

                  {/* Name */}

                  <p>
                    <span className="text-[#8A806B]">
                      Name:
                    </span>{" "}
                    <span className="font-semibold text-[#252525]">
                      {order.customer.name}
                    </span>
                  </p>

                  {/* Phone */}

                  <p>
                    <span className="text-[#8A806B]">
                      Phone:
                    </span>{" "}
                    <span className="font-semibold text-[#252525]">
                      {order.customer.phone}
                    </span>
                  </p>

                  {/* Email */}

                  {order.customer.email && (
                    <p>
                      <span className="text-[#8A806B]">
                        Email:
                      </span>{" "}
                      <span className="font-semibold text-[#252525]">
                        {order.customer.email}
                      </span>
                    </p>
                  )}

                  {/* Address */}

                  <p>
                    <span className="text-[#8A806B]">
                      Address:
                    </span>{" "}
                    <span className="font-semibold text-[#252525]">
                      {order.customer.address}
                    </span>
                  </p>

                  {/* Postcode */}

                  {order.customer.postcode && (
                    <p>
                      <span className="text-[#8A806B]">
                        Postcode:
                      </span>{" "}
                      <span className="font-semibold text-[#252525]">
                        {order.customer.postcode}
                      </span>
                    </p>
                  )}

                </div>
              </div>
            )}

          </div>
        </div>

        {/* ==========================================
            ACTION BUTTONS
        ========================================== */}

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">

          <Link
            to="/"
            className="h-12 rounded-xl bg-[#252525] text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#A08E65] transition"
          >
            <FaHome size={13} />
            Back to Home
          </Link>

          <Link
            to="/"
            className="h-12 rounded-xl border border-[#D8D5CC] bg-white text-[#252525] font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#F7F5EF] transition"
          >
            <FaShoppingBag size={13} />
            Order More Food
          </Link>

        </div>

        {/* ==========================================
            FOOTER MESSAGE
        ========================================== */}

        <p className="text-center text-xs text-[#8A806B] mt-6">
          We'll contact you once your order is ready.
        </p>

      </div>
    </div>
  );
};

export default PaymentSuccess;