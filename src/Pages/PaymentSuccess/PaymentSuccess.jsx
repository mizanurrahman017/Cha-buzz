import React, { useEffect, useState } from "react";
import { FaCheckCircle, FaReceipt, FaHome, FaShoppingBag } from "react-icons/fa";
import { Link, useSearchParams } from "react-router";

import { doc, getDoc } from "firebase/firestore";
import { db } from "../../Firebase/Firebase.config";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const orderId = searchParams.get("orderId");

  useEffect(() => {
    const loadOrder = async () => {
      if (!orderId) {
        setError("Order ID was not found.");
        setLoading(false);
        return;
      }

      try {
        const orderRef = doc(db, "orders", orderId);
        const orderSnap = await getDoc(orderRef);

        if (!orderSnap.exists()) {
          setError("Order not found.");
          return;
        }

        const orderData = {
          id: orderSnap.id,
          ...orderSnap.data(),
        };

        setOrder(orderData);
      } catch (err) {
        console.error("Failed to load order:", err);
        setError("Unable to load your order information.");
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [orderId]);

  // ===============================
  // Loading
  // ===============================

  if (loading) {
    return (
      <div className="min-h-[75vh] bg-[#F7F5EF] flex items-center justify-center px-4">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-[#252525]"></span>

          <p className="mt-4 text-sm text-[#8A806B]">
            Confirming your order...
          </p>
        </div>
      </div>
    );
  }

  // ===============================
  // Error
  // ===============================

  if (error || !order) {
    return (
      <div className="min-h-[75vh] bg-[#F7F5EF] flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-2xl border border-[#E4E0D7] shadow-sm p-8 text-center">

          <div className="w-16 h-16 mx-auto rounded-full bg-red-50 flex items-center justify-center">
            <span className="text-red-500 text-2xl">!</span>
          </div>

          <h1 className="mt-5 text-2xl font-extrabold text-[#252525]">
            Order Information Not Found
          </h1>

          <p className="mt-2 text-sm text-[#8A806B]">
            {error || "We couldn't find your order."}
          </p>

          <Link
            to="/"
            className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-xl bg-[#252525] text-white text-sm font-semibold hover:bg-[#A08E65] transition"
          >
            <FaHome size={13} />
            Back to Home
          </Link>

        </div>
      </div>
    );
  }

  // ===============================
  // Order Values
  // ===============================

  const paymentMethod =
    order.paymentMethod === "bkash"
      ? "bKash"
      : order.paymentMethod === "nagad"
      ? "Nagad"
      : order.paymentMethod || "Online Payment";

  const paymentStatus =
    order.paymentStatus === "paid";

  // ===============================
  // Main
  // ===============================

  return (
    <div className="min-h-screen bg-[#F7F5EF] py-10 sm:py-14">

      <div className="max-w-3xl mx-auto px-4 sm:px-6">

        {/* ===============================
            Success Header
        =============================== */}

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

          <p className="mt-3 text-sm sm:text-base text-[#8A806B] max-w-lg mx-auto">
            Thank you for your order. Your payment has been successfully
            verified and your order is now confirmed.
          </p>

        </div>

        {/* ===============================
            Order Card
        =============================== */}

        <div className="mt-8 bg-white rounded-2xl border border-[#E4E0D7] shadow-sm overflow-hidden">

          {/* Header */}

          <div className="px-5 sm:px-6 py-5 border-b border-[#E4E0D7] flex items-center justify-between gap-4">

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

            <div className="text-right">

              <p className="text-[10px] uppercase tracking-wider text-[#8A806B]">
                Order ID
              </p>

              <p className="text-xs sm:text-sm font-bold text-[#252525] break-all">
                {order.id}
              </p>

            </div>

          </div>

          {/* Payment Information */}

          <div className="p-5 sm:p-6">

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">

              <div className="rounded-xl bg-[#F7F5EF] p-4">

                <p className="text-[11px] text-[#8A806B]">
                  Payment
                </p>

                <p className="mt-1 font-bold text-[#252525]">
                  {paymentMethod}
                </p>

              </div>

              <div className="rounded-xl bg-[#F7F5EF] p-4">

                <p className="text-[11px] text-[#8A806B]">
                  Payment Status
                </p>

                <p
                  className={`mt-1 font-bold ${
                    paymentStatus
                      ? "text-green-600"
                      : "text-orange-500"
                  }`}
                >
                  {paymentStatus ? "Paid" : "Pending"}
                </p>

              </div>

              <div className="rounded-xl bg-[#F7F5EF] p-4 col-span-2 sm:col-span-1">

                <p className="text-[11px] text-[#8A806B]">
                  Order Status
                </p>

                <p className="mt-1 font-bold text-green-600 capitalize">
                  {order.orderStatus || "Confirmed"}
                </p>

              </div>

            </div>

            {/* ===============================
                Items
            =============================== */}

            <div className="mt-7">

              <h3 className="font-bold text-[#252525] mb-4">
                Ordered Items
              </h3>

              <div className="divide-y divide-[#E4E0D7] border border-[#E4E0D7] rounded-xl overflow-hidden">

                {order.items?.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 flex items-center gap-3"
                  >

                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 rounded-lg object-cover shrink-0"
                    />

                    <div className="flex-1 min-w-0">

                      <p className="font-semibold text-sm text-[#252525] truncate">
                        {item.name}
                      </p>

                      <p className="text-xs text-[#8A806B] mt-1">
                        {item.quantity} × ৳{item.price}
                      </p>

                    </div>

                    <p className="font-bold text-sm text-[#252525]">
                      ৳
                      {Number(item.price) *
                        Number(item.quantity)}
                    </p>

                  </div>
                ))}

              </div>

            </div>

            {/* ===============================
                Price Summary
            =============================== */}

            <div className="mt-6 pt-5 border-t border-[#E4E0D7] space-y-3">

              <div className="flex justify-between text-sm">

                <span className="text-[#8A806B]">
                  Subtotal
                </span>

                <span className="font-semibold text-[#252525]">
                  ৳{order.subtotal}
                </span>

              </div>

              <div className="flex justify-between text-sm">

                <span className="text-[#8A806B]">
                  Delivery Fee
                </span>

                <span className="font-semibold text-[#252525]">
                  ৳{order.deliveryFee}
                </span>

              </div>

              <div className="pt-4 mt-2 border-t border-[#E4E0D7] flex justify-between items-center">

                <span className="font-bold text-[#252525]">
                  Total Paid
                </span>

                <span className="text-2xl font-extrabold text-[#252525]">
                  ৳{order.total}
                </span>

              </div>

            </div>

            {/* ===============================
                Customer Information
            =============================== */}

            {order.customer && (
              <div className="mt-6 pt-6 border-t border-[#E4E0D7]">

                <h3 className="font-bold text-[#252525] mb-4">
                  Delivery Information
                </h3>

                <div className="rounded-xl bg-[#F7F5EF] p-4 space-y-2 text-sm">

                  <p>
                    <span className="text-[#8A806B]">
                      Name:
                    </span>{" "}
                    <span className="font-semibold text-[#252525]">
                      {order.customer.name}
                    </span>
                  </p>

                  <p>
                    <span className="text-[#8A806B]">
                      Phone:
                    </span>{" "}
                    <span className="font-semibold text-[#252525]">
                      {order.customer.phone}
                    </span>
                  </p>

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

                  <p>
                    <span className="text-[#8A806B]">
                      Address:
                    </span>{" "}
                    <span className="font-semibold text-[#252525]">
                      {order.customer.address}
                    </span>
                  </p>

                </div>

              </div>
            )}

          </div>

        </div>

        {/* ===============================
            Buttons
        =============================== */}

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

        {/* ===============================
            Footer Message
        =============================== */}

        <p className="text-center text-xs text-[#8A806B] mt-6">
          We'll contact you once your order is ready.
        </p>

      </div>

    </div>
  );
};

export default PaymentSuccess;