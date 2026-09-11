import React, { useEffect, useState } from "react";
import {
  FaClock,
  FaCheck,
  FaUtensils,
  FaBoxOpen,
  FaTruck,
  FaTimes,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaCreditCard,
  FaUser,
  FaSyncAlt,
} from "react-icons/fa";

import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  updateDoc,
} from "firebase/firestore";

import { db } from "../../../Firebase/Firebase.config";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // =====================================
  // REAL-TIME ORDERS
  // =====================================
  useEffect(() => {
    const ordersQuery = query(
      collection(db, "orders"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      ordersQuery,
      (snapshot) => {
        const orderList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setOrders(orderList);
        setLoading(false);
      },
      (error) => {
        console.error("Orders fetch error:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // =====================================
  // UPDATE ORDER STATUS
  // =====================================
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await updateDoc(doc(db, "orders", orderId), {
        orderStatus: newStatus,
      });

      console.log("Order status updated:", newStatus);
    } catch (error) {
      console.error("Status update failed:", error);
      alert("Failed to update order status.");
    }
  };

  // =====================================
  // UPDATE PAYMENT STATUS
  // =====================================
  const updatePaymentStatus = async (orderId, newStatus) => {
    try {
      await updateDoc(doc(db, "orders", orderId), {
        paymentStatus: newStatus,
      });

      console.log("Payment status updated:", newStatus);
    } catch (error) {
      console.error("Payment status update failed:", error);
      alert("Failed to update payment status.");
    }
  };

  // =====================================
  // FORMAT DATE
  // =====================================
  const formatDate = (timestamp) => {
    if (!timestamp) return "Just now";

    try {
      return timestamp.toDate().toLocaleString("en-BD", {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch {
      return "Unknown time";
    }
  };

  // =====================================
  // STATUS CONFIG
  // =====================================
  const statusConfig = {
    pending: {
      label: "Pending",
      icon: <FaClock />,
      className: "bg-yellow-50 text-yellow-700 border-yellow-200",
    },

    confirmed: {
      label: "Confirmed",
      icon: <FaCheck />,
      className: "bg-blue-50 text-blue-700 border-blue-200",
    },

    preparing: {
      label: "Preparing",
      icon: <FaUtensils />,
      className: "bg-orange-50 text-orange-700 border-orange-200",
    },

    ready: {
      label: "Ready",
      icon: <FaBoxOpen />,
      className: "bg-purple-50 text-purple-700 border-purple-200",
    },

    delivered: {
      label: "Delivered",
      icon: <FaTruck />,
      className: "bg-green-50 text-green-700 border-green-200",
    },

    cancelled: {
      label: "Cancelled",
      icon: <FaTimes />,
      className: "bg-red-50 text-red-700 border-red-200",
    },
  };

  // =====================================
  // COUNT ORDERS
  // =====================================
  const pendingCount = orders.filter(
    (order) => order.orderStatus === "pending"
  ).length;

  const confirmedCount = orders.filter(
    (order) => order.orderStatus === "confirmed"
  ).length;

  const preparingCount = orders.filter(
    (order) => order.orderStatus === "preparing"
  ).length;

  const readyCount = orders.filter(
    (order) => order.orderStatus === "ready"
  ).length;

  return (
    <section className="min-h-screen bg-[#F7F5EF] px-3 sm:px-5 lg:px-8 py-6 sm:py-8">

      <div className="max-w-7xl mx-auto">

        {/* =====================================
            HEADER
        ===================================== */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-7">

          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-[#A08E65]">
              Cha Buzz Admin
            </p>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#252525] mt-1">
              Order Management
            </h1>

            <p className="text-sm text-[#8A806B] mt-2">
              Manage customer orders in real-time.
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm font-semibold text-green-700 bg-green-50 border border-green-200 px-4 py-2.5 rounded-xl">
            <FaSyncAlt className="animate-spin" size={13} />
            Live Orders
          </div>

        </div>


        {/* =====================================
            STATS
        ===================================== */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-7">

          {/* PENDING */}
          <div className="bg-white border border-[#E4E0D7] rounded-2xl p-4 sm:p-5">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs sm:text-sm text-[#8A806B]">
                  Pending
                </p>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#252525] mt-1">
                  {pendingCount}
                </h2>
              </div>

              <div className="w-10 h-10 rounded-xl bg-yellow-50 text-yellow-700 flex items-center justify-center">
                <FaClock />
              </div>

            </div>

          </div>


          {/* CONFIRMED */}
          <div className="bg-white border border-[#E4E0D7] rounded-2xl p-4 sm:p-5">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs sm:text-sm text-[#8A806B]">
                  Confirmed
                </p>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#252525] mt-1">
                  {confirmedCount}
                </h2>
              </div>

              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                <FaCheck />
              </div>

            </div>

          </div>


          {/* PREPARING */}
          <div className="bg-white border border-[#E4E0D7] rounded-2xl p-4 sm:p-5">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs sm:text-sm text-[#8A806B]">
                  Preparing
                </p>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#252525] mt-1">
                  {preparingCount}
                </h2>
              </div>

              <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-700 flex items-center justify-center">
                <FaUtensils />
              </div>

            </div>

          </div>


          {/* READY */}
          <div className="bg-white border border-[#E4E0D7] rounded-2xl p-4 sm:p-5">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs sm:text-sm text-[#8A806B]">
                  Ready
                </p>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#252525] mt-1">
                  {readyCount}
                </h2>
              </div>

              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                <FaBoxOpen />
              </div>

            </div>

          </div>

        </div>


        {/* =====================================
            ORDERS
        ===================================== */}
        <div>

          {loading ? (

            <div className="bg-white border border-[#E4E0D7] rounded-2xl py-20 flex flex-col items-center justify-center">

              <span className="loading loading-spinner loading-lg text-[#252525]"></span>

              <p className="mt-4 text-sm text-[#8A806B]">
                Loading orders...
              </p>

            </div>

          ) : orders.length === 0 ? (

            <div className="bg-white border border-[#E4E0D7] rounded-2xl py-20 text-center">

              <div className="w-16 h-16 mx-auto rounded-full bg-[#F7F5EF] flex items-center justify-center">
                <FaBoxOpen
                  size={26}
                  className="text-[#A08E65]"
                />
              </div>

              <h2 className="text-xl font-bold text-[#252525] mt-5">
                No Orders Yet
              </h2>

              <p className="text-sm text-[#8A806B] mt-2">
                New customer orders will appear here automatically.
              </p>

            </div>

          ) : (

            <div className="space-y-5">

              {orders.map((order) => {

                const currentStatus =
                  statusConfig[order.orderStatus] ||
                  statusConfig.pending;

                return (

                  <div
                    key={order.id}
                    className="
                      bg-white
                      border
                      border-[#E4E0D7]
                      rounded-2xl
                      overflow-hidden
                      shadow-[0_3px_15px_rgba(37,37,37,0.05)]
                    "
                  >

                    {/* =================================
                        ORDER HEADER
                    ================================= */}
                    <div className="p-4 sm:p-5 border-b border-[#EEEAE1]">

                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                        <div>

                          <div className="flex flex-wrap items-center gap-2">

                            <h2 className="text-base sm:text-lg font-extrabold text-[#252525]">
                              Order #{order.id.slice(0, 8)}
                            </h2>

                            <span
                              className={`
                                inline-flex
                                items-center
                                gap-1.5
                                px-2.5
                                py-1
                                rounded-full
                                border
                                text-[11px]
                                font-bold
                                ${currentStatus.className}
                              `}
                            >
                              {currentStatus.icon}
                              {currentStatus.label}
                            </span>

                            {/* ORDER SOURCE */}
                            <span className="px-2.5 py-1 rounded-full bg-[#F7F5EF] border border-[#E4E0D7] text-[11px] font-bold text-[#8A806B]">
                              {order.orderSource === "waiter"
                                ? "Waiter Order"
                                : "Online Order"}
                            </span>

                          </div>

                          <p className="text-xs text-[#8A806B] mt-2">
                            {formatDate(order.createdAt)}
                          </p>

                        </div>


                        {/* TOTAL */}
                        <div className="lg:text-right">

                          <p className="text-xs text-[#8A806B]">
                            Order Total
                          </p>

                          <p className="text-2xl font-extrabold text-[#252525]">
                            ৳{order.total}
                          </p>

                        </div>

                      </div>

                    </div>


                    {/* =================================
                        ORDER BODY
                    ================================= */}
                    <div className="p-4 sm:p-5">

                      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">

                        {/* ===========================
                            CUSTOMER + ITEMS
                        =========================== */}
                        <div>

                          {/* CUSTOMER */}
                          <div className="mb-6">

                            <h3 className="text-sm font-bold text-[#252525] mb-3">
                              Customer Information
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                              <div className="flex items-start gap-3 p-3 rounded-xl bg-[#FDFCF9] border border-[#EEEAE1]">

                                <FaUser
                                  className="text-[#A08E65] mt-1"
                                  size={13}
                                />

                                <div>
                                  <p className="text-[11px] text-[#8A806B]">
                                    Name
                                  </p>

                                  <p className="text-sm font-semibold text-[#252525]">
                                    {order.customer?.name || "N/A"}
                                  </p>
                                </div>

                              </div>


                              <div className="flex items-start gap-3 p-3 rounded-xl bg-[#FDFCF9] border border-[#EEEAE1]">

                                <FaPhoneAlt
                                  className="text-[#A08E65] mt-1"
                                  size={13}
                                />

                                <div>
                                  <p className="text-[11px] text-[#8A806B]">
                                    Phone
                                  </p>

                                  <a
                                    href={`tel:${order.customer?.phone}`}
                                    className="text-sm font-semibold text-[#252525] hover:text-[#A08E65]"
                                  >
                                    {order.customer?.phone || "N/A"}
                                  </a>
                                </div>

                              </div>


                              <div className="flex items-start gap-3 p-3 rounded-xl bg-[#FDFCF9] border border-[#EEEAE1] sm:col-span-2">

                                <FaMapMarkerAlt
                                  className="text-[#A08E65] mt-1"
                                  size={13}
                                />

                                <div>
                                  <p className="text-[11px] text-[#8A806B]">
                                    Delivery Address
                                  </p>

                                  <p className="text-sm font-semibold text-[#252525]">
                                    {order.customer?.address || "N/A"}
                                  </p>
                                </div>

                              </div>

                            </div>

                          </div>


                          {/* ITEMS */}
                          <div>

                            <h3 className="text-sm font-bold text-[#252525] mb-3">
                              Ordered Items
                            </h3>

                            <div className="space-y-3">

                              {order.items?.map((item, index) => (

                                <div
                                  key={`${item.id}-${index}`}
                                  className="
                                    flex
                                    items-center
                                    gap-3
                                    p-3
                                    rounded-xl
                                    bg-[#FDFCF9]
                                    border
                                    border-[#EEEAE1]
                                  "
                                >

                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="
                                      w-14
                                      h-14
                                      rounded-lg
                                      object-cover
                                      flex-shrink-0
                                    "
                                  />

                                  <div className="flex-1 min-w-0">

                                    <h4 className="text-sm font-bold text-[#252525] line-clamp-1">
                                      {item.name}
                                    </h4>

                                    <p className="text-xs text-[#8A806B] mt-1">
                                      ৳{item.price} × {item.quantity}
                                    </p>

                                  </div>

                                  <p className="text-sm font-extrabold text-[#252525]">
                                    ৳{item.price * item.quantity}
                                  </p>

                                </div>

                              ))}

                            </div>

                          </div>

                        </div>


                        {/* ===========================
                            RIGHT CONTROL PANEL
                        =========================== */}
                        <div>

                          <div className="rounded-2xl bg-[#F7F5EF] border border-[#E4E0D7] p-4">

                            {/* PAYMENT */}
                            <div>

                              <h3 className="text-sm font-bold text-[#252525]">
                                Payment
                              </h3>

                              <div className="flex items-center gap-2 mt-3">

                                {order.paymentMethod === "online" ? (
                                  <FaCreditCard className="text-[#A08E65]" />
                                ) : (
                                  <FaMoneyBillWave className="text-[#A08E65]" />
                                )}

                                <span className="text-sm font-semibold text-[#252525]">
                                  {order.paymentMethod === "online"
                                    ? "Online Payment"
                                    : "Cash on Delivery"}
                                </span>

                              </div>


                              {/* PAYMENT STATUS */}
                              <select
                                value={order.paymentStatus || "pending"}
                                onChange={(e) =>
                                  updatePaymentStatus(
                                    order.id,
                                    e.target.value
                                  )
                                }
                                className="
                                  w-full
                                  h-10
                                  mt-3
                                  px-3
                                  rounded-lg
                                  border
                                  border-[#D8D5CC]
                                  bg-white
                                  text-sm
                                  font-semibold
                                  text-[#252525]
                                  outline-none
                                  focus:border-[#A08E65]
                                "
                              >
                                <option value="pending">
                                  Payment Pending
                                </option>

                                <option value="paid">
                                  Paid
                                </option>

                                <option value="failed">
                                  Failed
                                </option>

                                <option value="refunded">
                                  Refunded
                                </option>

                              </select>

                            </div>


                            {/* DIVIDER */}
                            <div className="border-t border-[#DDD8CE] my-5"></div>


                            {/* ORDER STATUS */}
                            <div>

                              <h3 className="text-sm font-bold text-[#252525]">
                                Order Status
                              </h3>

                              <select
                                value={order.orderStatus || "pending"}
                                onChange={(e) =>
                                  updateOrderStatus(
                                    order.id,
                                    e.target.value
                                  )
                                }
                                className="
                                  w-full
                                  h-11
                                  mt-3
                                  px-3
                                  rounded-lg
                                  border
                                  border-[#D8D5CC]
                                  bg-white
                                  text-sm
                                  font-semibold
                                  text-[#252525]
                                  outline-none
                                  focus:border-[#A08E65]
                                "
                              >

                                <option value="pending">
                                  Pending
                                </option>

                                <option value="confirmed">
                                  Confirmed
                                </option>

                                <option value="preparing">
                                  Preparing
                                </option>

                                <option value="ready">
                                  Ready
                                </option>

                                <option value="delivered">
                                  Delivered
                                </option>

                                <option value="cancelled">
                                  Cancelled
                                </option>

                              </select>

                            </div>


                            {/* PRICE */}
                            <div className="border-t border-[#DDD8CE] mt-5 pt-5 space-y-2">

                              <div className="flex justify-between text-xs">

                                <span className="text-[#8A806B]">
                                  Subtotal
                                </span>

                                <span className="font-semibold text-[#252525]">
                                  ৳{order.subtotal}
                                </span>

                              </div>


                              <div className="flex justify-between text-xs">

                                <span className="text-[#8A806B]">
                                  Delivery
                                </span>

                                <span className="font-semibold text-[#252525]">
                                  ৳{order.deliveryFee}
                                </span>

                              </div>


                              <div className="flex justify-between pt-2">

                                <span className="font-bold text-[#252525]">
                                  Total
                                </span>

                                <span className="text-xl font-extrabold text-[#252525]">
                                  ৳{order.total}
                                </span>

                              </div>

                            </div>

                          </div>

                        </div>

                      </div>


                      {/* =================================
                          ORDER NOTE
                      ================================= */}
                      {order.customer?.note && (
                        <div className="mt-5 p-4 rounded-xl bg-[#F7F5EF] border border-[#E4E0D7]">

                          <p className="text-xs font-bold text-[#252525]">
                            Customer Note
                          </p>

                          <p className="text-sm text-[#8A806B] mt-1">
                            {order.customer.note}
                          </p>

                        </div>
                      )}

                    </div>

                  </div>

                );
              })}

            </div>

          )}

        </div>

      </div>

    </section>
  );
};

export default Orders;