import React, { useEffect, useMemo, useState } from "react";
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
  FaReceipt,
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
  // CHECK TODAY
  // =====================================
  const isToday = (timestamp) => {
    if (!timestamp) return false;

    try {
      const date = timestamp.toDate();
      const today = new Date();

      return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      );
    } catch {
      return false;
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

    completed: {
      label: "Completed",
      icon: <FaCheck />,
      className: "bg-green-50 text-green-700 border-green-200",
    },

    cancelled: {
      label: "Cancelled",
      icon: <FaTimes />,
      className: "bg-red-50 text-red-700 border-red-200",
    },
  };

  // =====================================
  // BASIC COUNTS
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

  // =====================================
  // WAITER ORDERS
  // =====================================
  const waiterOrders = useMemo(() => {
    return orders.filter(
      (order) => order.orderSource === "waiter"
    );
  }, [orders]);

  // =====================================
  // ONLINE ORDERS
  // =====================================
  const onlineOrders = useMemo(() => {
    return orders.filter(
      (order) => order.orderSource !== "waiter"
    );
  }, [orders]);

  // =====================================
  // TODAY'S WAITER ORDERS
  // =====================================
  const todayWaiterOrders = useMemo(() => {
    return waiterOrders.filter((order) =>
      isToday(order.createdAt)
    );
  }, [waiterOrders]);

  // =====================================
  // TODAY'S WAITER SALES
  // =====================================
  const todayWaiterSales = useMemo(() => {
    return todayWaiterOrders.reduce(
      (total, order) => total + Number(order.total || 0),
      0
    );
  }, [todayWaiterOrders]);

  // =====================================
  // TODAY'S TOTAL SALES
  // =====================================
  const todayTotalSales = useMemo(() => {
    return orders
      .filter((order) => isToday(order.createdAt))
      .filter((order) => order.paymentStatus === "paid")
      .filter((order) => order.orderStatus !== "cancelled")
      .reduce(
        (total, order) => total + Number(order.total || 0),
        0
      );
  }, [orders]);

  // =====================================
  // TODAY'S ONLINE ORDERS
  // =====================================
  const todayOnlineOrders = useMemo(() => {
    return onlineOrders.filter((order) =>
      isToday(order.createdAt)
    );
  }, [onlineOrders]);

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
              Manage customer and restaurant orders in real-time.
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm font-semibold text-green-700 bg-green-50 border border-green-200 px-4 py-2.5 rounded-xl">
            <FaSyncAlt
              className="animate-spin"
              size={13}
            />
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
            BUSINESS STATS
        ===================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-7">

          {/* TODAY WAITER ORDERS */}
          <div className="bg-white border border-[#E4E0D7] rounded-2xl p-4 sm:p-5">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs sm:text-sm text-[#8A806B]">
                  Today's Waiter Orders
                </p>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#252525] mt-1">
                  {todayWaiterOrders.length}
                </h2>
              </div>

              <div className="w-10 h-10 rounded-xl bg-[#F7F5EF] text-[#A08E65] flex items-center justify-center">
                <FaReceipt />
              </div>

            </div>

            <p className="text-[11px] text-[#8A806B] mt-3">
              Offline restaurant orders
            </p>

          </div>

          {/* TODAY WAITER SALES */}
          <div className="bg-white border border-[#E4E0D7] rounded-2xl p-4 sm:p-5">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs sm:text-sm text-[#8A806B]">
                  Today's Waiter Sales
                </p>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#252525] mt-1">
                  ৳{todayWaiterSales}
                </h2>
              </div>

              <div className="w-10 h-10 rounded-xl bg-green-50 text-green-700 flex items-center justify-center">
                <FaMoneyBillWave />
              </div>

            </div>

            <p className="text-[11px] text-[#8A806B] mt-3">
              Cash sales recorded by waiter
            </p>

          </div>

          {/* TODAY ONLINE ORDERS */}
          <div className="bg-white border border-[#E4E0D7] rounded-2xl p-4 sm:p-5">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs sm:text-sm text-[#8A806B]">
                  Today's Online Orders
                </p>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#252525] mt-1">
                  {todayOnlineOrders.length}
                </h2>
              </div>

              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                <FaCreditCard />
              </div>

            </div>

            <p className="text-[11px] text-[#8A806B] mt-3">
              Orders placed online
            </p>

          </div>

          {/* TODAY TOTAL SALES */}
          <div className="bg-[#252525] border border-[#252525] rounded-2xl p-4 sm:p-5">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs sm:text-sm text-white/60">
                  Today's Total Sales
                </p>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                  ৳{todayTotalSales}
                </h2>
              </div>

              <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center">
                <FaMoneyBillWave />
              </div>

            </div>

            <p className="text-[11px] text-white/50 mt-3">
              Paid orders excluding cancelled
            </p>

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
                New customer and waiter orders will appear here automatically.
              </p>

            </div>

          ) : (

            <div className="space-y-5">

              {orders.map((order) => {

                const currentStatus =
                  statusConfig[order.orderStatus] ||
                  statusConfig.pending;

                const isWaiterOrder =
                  order.orderSource === "waiter";

                const orderSubtotal = isWaiterOrder
                  ? Number(order.total || 0)
                  : Number(order.subtotal || order.total || 0);

                const deliveryFee = isWaiterOrder
                  ? 0
                  : Number(order.deliveryFee || 0);

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
                            <span
                              className={`
                                px-2.5
                                py-1
                                rounded-full
                                border
                                text-[11px]
                                font-bold
                                ${
                                  isWaiterOrder
                                    ? "bg-[#252525] text-white border-[#252525]"
                                    : "bg-[#F7F5EF] text-[#8A806B] border-[#E4E0D7]"
                                }
                              `}
                            >
                              {isWaiterOrder
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
                            ৳{Number(order.total || 0)}
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
                            LEFT CONTENT
                        =========================== */}
                        <div>

                          {/* CUSTOMER INFORMATION */}
                          {!isWaiterOrder && (
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
                                      href={`tel:${order.customer?.phone || ""}`}
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
                          )}

                          {/* WAITER ORDER INFO */}
                          {isWaiterOrder && (
                            <div className="mb-6">

                              <div className="p-4 rounded-xl bg-[#F7F5EF] border border-[#E4E0D7]">

                                <div className="flex items-center gap-3">

                                  <div className="w-10 h-10 rounded-xl bg-[#252525] text-white flex items-center justify-center">
                                    <FaReceipt />
                                  </div>

                                  <div>
                                    <p className="text-sm font-bold text-[#252525]">
                                      Restaurant / Waiter Order
                                    </p>

                                    <p className="text-xs text-[#8A806B] mt-1">
                                      Offline customer order recorded through the digital khata.
                                    </p>
                                  </div>

                                </div>

                              </div>

                            </div>
                          )}

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
                                    ৳{Number(item.price || 0) * Number(item.quantity || 0)}
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

                                  {isWaiterOrder
                                    ? "Cash"
                                    : order.paymentMethod === "online"
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

                                <option value="completed">
                                  Completed
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
                                  {isWaiterOrder
                                    ? "Food Total"
                                    : "Subtotal"}
                                </span>

                                <span className="font-semibold text-[#252525]">
                                  ৳{orderSubtotal}
                                </span>

                              </div>

                              {!isWaiterOrder && (
                                <div className="flex justify-between text-xs">

                                  <span className="text-[#8A806B]">
                                    Delivery
                                  </span>

                                  <span className="font-semibold text-[#252525]">
                                    ৳{deliveryFee}
                                  </span>

                                </div>
                              )}

                              <div className="flex justify-between pt-2">

                                <span className="font-bold text-[#252525]">
                                  Total
                                </span>

                                <span className="text-xl font-extrabold text-[#252525]">
                                  ৳{Number(order.total || 0)}
                                </span>

                              </div>

                            </div>

                          </div>

                        </div>

                      </div>

                      {/* =================================
                          ORDER NOTE
                      ================================= */}
                      {!isWaiterOrder && order.customer?.note && (
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