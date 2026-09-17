import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import {
  FaClock,
  FaCheckCircle,
  FaUtensils,
  FaTruck,
  FaTimesCircle,
  FaUserTie,
  FaMobileAlt,
  FaMoneyBillWave,
  FaShieldAlt,
  FaExclamationTriangle,
} from "react-icons/fa";

import { db } from "../../../Firebase/Firebase.config";

import { useAuth } from "../../../Context/AuthContext";


// =====================================================
// Status configuration
// =====================================================
const statusConfig = {

  pending: {
    label: "Pending",
    icon: <FaClock />,
    className:
      "bg-yellow-100 text-yellow-700 border-yellow-200",
  },

  pending_payment_verification: {
    label: "Payment Verification",
    icon: <FaExclamationTriangle />,
    className:
      "bg-amber-100 text-amber-700 border-amber-200",
  },

  confirmed: {
    label: "Confirmed",
    icon: <FaCheckCircle />,
    className:
      "bg-blue-100 text-blue-700 border-blue-200",
  },

  preparing: {
    label: "Preparing",
    icon: <FaUtensils />,
    className:
      "bg-purple-100 text-purple-700 border-purple-200",
  },

  ready: {
    label: "Ready",
    icon: <FaCheckCircle />,
    className:
      "bg-green-100 text-green-700 border-green-200",
  },

  delivered: {
    label: "Delivered",
    icon: <FaTruck />,
    className:
      "bg-indigo-100 text-indigo-700 border-indigo-200",
  },

  completed: {
    label: "Completed",
    icon: <FaCheckCircle />,
    className:
      "bg-green-100 text-green-700 border-green-200",
  },

  cancelled: {
    label: "Cancelled",
    icon: <FaTimesCircle />,
    className:
      "bg-red-100 text-red-700 border-red-200",
  },
};


// =====================================================
// Format Date
// =====================================================
const formatDate = (timestamp) => {

  if (!timestamp) {
    return "Just now";
  }

  try {

    return timestamp
      .toDate()
      .toLocaleString("en-BD", {
        dateStyle: "medium",
        timeStyle: "short",
      });

  } catch (error) {
    return "Unknown date";
  }
};


// =====================================================
// Check Today
// =====================================================
const isToday = (timestamp) => {

  if (!timestamp) {
    return false;
  }

  try {

    const date = timestamp.toDate();

    const today = new Date();

    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );

  } catch (error) {
    return false;
  }
};


// =====================================================
// Order Card
// =====================================================
const OrderCard = ({
  order,
  onUpdateOrderStatus,
  onUpdatePaymentStatus,
  onVerifyPayment,
  onRejectPayment,
}) => {

  const isWaiterOrder =
    order.orderSource === "waiter";

  const isOnlineOrder =
    order.orderSource !== "waiter";


  const subtotal =
    Number(order.subtotal) ||
    Number(order.total) ||
    0;


  const deliveryFee =
    Number(order.deliveryFee) || 0;


  const total =
    Number(order.total) ||
    subtotal;


  const status =
    statusConfig[order.orderStatus] ||
    statusConfig.pending;


  return (

    <div className="bg-white rounded-2xl border border-[#E4E0D7] shadow-sm overflow-hidden">


      {/* =====================================================
          HEADER
      ===================================================== */}
      <div className="p-5 border-b border-[#E4E0D7]">

        <div className="flex flex-wrap items-start justify-between gap-3">

          <div>

            <div className="flex flex-wrap items-center gap-2">

              <span className="text-sm font-bold text-[#252525]">
                Order #{order.id.slice(0, 8)}
              </span>


              {/* Source */}
              {isWaiterOrder ? (

                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F7F5EF] border border-[#D8D5CC] text-xs font-semibold text-[#77705F]">

                  <FaUserTie size={10} />

                  Waiter Order

                </span>

              ) : (

                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-pink-50 border border-pink-100 text-xs font-semibold text-pink-600">

                  <FaMobileAlt size={10} />

                  Online Order

                </span>

              )}

            </div>


            <p className="mt-1 text-xs text-[#8A806B]">
              {formatDate(order.createdAt)}
            </p>

          </div>


          {/* Order status */}
          <span
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold ${status.className}`}
          >
            {status.icon}
            {status.label}
          </span>

        </div>

      </div>


      {/* =====================================================
          CUSTOMER / WAITER INFO
      ===================================================== */}
      <div className="p-5 border-b border-[#E4E0D7]">


        {isWaiterOrder ? (

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-xl bg-[#F7F5EF] flex items-center justify-center">
              <FaUserTie
                className="text-[#A08E65]"
                size={18}
              />
            </div>

            <div>

              <p className="font-bold text-[#252525]">
                Waiter Order
              </p>

              <p className="text-xs text-[#8A806B]">
                Recorded from waiter panel
              </p>

            </div>

          </div>

        ) : (

          <div>

            <h3 className="text-sm font-bold text-[#252525] mb-3">
              Customer Information
            </h3>


            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

              <div>
                <p className="text-xs text-[#8A806B]">
                  Name
                </p>

                <p className="text-sm font-semibold text-[#252525]">
                  {order.customer?.name || "N/A"}
                </p>
              </div>


              <div>
                <p className="text-xs text-[#8A806B]">
                  Phone
                </p>

                <p className="text-sm font-semibold text-[#252525]">
                  {order.customer?.phone || "N/A"}
                </p>
              </div>


              {order.customer?.email && (

                <div>
                  <p className="text-xs text-[#8A806B]">
                    Email
                  </p>

                  <p className="text-sm font-semibold text-[#252525] break-all">
                    {order.customer.email}
                  </p>
                </div>

              )}


              <div className="sm:col-span-2">

                <p className="text-xs text-[#8A806B]">
                  Address
                </p>

                <p className="text-sm font-semibold text-[#252525]">
                  {order.customer?.address || "N/A"}
                </p>

              </div>

            </div>

          </div>

        )}

      </div>


      {/* =====================================================
          ONLINE BKASH PAYMENT VERIFICATION
      ===================================================== */}
      {isOnlineOrder && (

        <div className="p-5 border-b border-[#E4E0D7]">

          <div className="flex items-center gap-2 mb-4">

            <FaMobileAlt
              className="text-pink-500"
              size={16}
            />

            <h3 className="font-bold text-[#252525]">
              bKash Payment
            </h3>

          </div>


          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">


            {/* Payment Status */}
            <div className="bg-[#F7F5EF] rounded-xl p-4">

              <p className="text-xs text-[#8A806B]">
                Payment Status
              </p>

              <p className="mt-1 font-bold text-[#252525] capitalize">
                {order.paymentStatus || "pending"}
              </p>

            </div>


            {/* Payment Amount */}
            <div className="bg-[#F7F5EF] rounded-xl p-4">

              <p className="text-xs text-[#8A806B]">
                Customer Paid
              </p>

              <p className="mt-1 text-xl font-extrabold text-[#252525]">
                ৳{Number(order.paymentAmount || order.total)}
              </p>

            </div>


            {/* Transaction ID */}
            <div className="sm:col-span-2 bg-pink-50 border border-pink-100 rounded-xl p-4">

              <p className="text-xs text-pink-600 font-semibold">
                bKash Transaction ID
              </p>

              <p className="mt-1 text-lg font-extrabold text-[#252525] tracking-wide break-all">
                {order.transactionId || "Not provided"}
              </p>

            </div>

          </div>


          {/* =====================================================
              Verification Notice
          ===================================================== */}
          {order.paymentStatus === "submitted" && (

            <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4">

              <div className="flex gap-3">

                <FaShieldAlt
                  className="text-amber-600 mt-0.5 shrink-0"
                  size={16}
                />

                <div>

                  <p className="text-sm font-bold text-amber-800">
                    Manual verification required
                  </p>

                  <p className="mt-1 text-xs sm:text-sm text-amber-700 leading-relaxed">
                    Check your actual bKash transaction
                    history/statement and verify that the
                    Transaction ID and amount match before
                    confirming this order.
                  </p>

                </div>

              </div>

            </div>

          )}


          {/* =====================================================
              Verify / Reject Buttons
          ===================================================== */}
          {order.paymentStatus === "submitted" && (

            <div className="mt-4 flex flex-col sm:flex-row gap-3">

              <button
                type="button"
                onClick={() =>
                  onVerifyPayment(order)
                }
                className="flex-1 h-11 rounded-xl bg-green-600 text-white font-bold flex items-center justify-center gap-2 hover:bg-green-700 transition"
              >

                <FaCheckCircle />

                Verify bKash Payment

              </button>


              <button
                type="button"
                onClick={() =>
                  onRejectPayment(order)
                }
                className="sm:w-32 h-11 rounded-xl border border-red-200 text-red-600 font-bold flex items-center justify-center gap-2 hover:bg-red-50 transition"
              >

                <FaTimesCircle />

                Reject

              </button>

            </div>

          )}


          {/* Already verified */}
          {order.paymentStatus === "paid" && (

            <div className="mt-4 flex items-center gap-2 px-4 py-3 rounded-xl bg-green-50 border border-green-200 text-green-700">

              <FaCheckCircle />

              <span className="text-sm font-bold">
                bKash payment verified
              </span>

            </div>

          )}


          {/* Rejected */}
          {order.paymentStatus === "failed" && (

            <div className="mt-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700">

              <div className="flex items-center gap-2">

                <FaTimesCircle />

                <span className="text-sm font-bold">
                  Payment rejected
                </span>

              </div>


              {order.paymentRejectionReason && (

                <p className="mt-2 text-xs">
                  Reason:{" "}
                  {order.paymentRejectionReason}
                </p>

              )}

            </div>

          )}

        </div>

      )}


      {/* =====================================================
          ORDER ITEMS
      ===================================================== */}
      <div className="p-5 border-b border-[#E4E0D7]">

        <h3 className="text-sm font-bold text-[#252525] mb-4">
          Ordered Items
        </h3>


        <div className="space-y-3">

          {order.items?.map((item, index) => (

            <div
              key={`${item.id}-${index}`}
              className="flex items-center gap-3"
            >

              <img
                src={item.image}
                alt={item.name}
                className="w-14 h-14 rounded-lg object-cover"
              />


              <div className="flex-1 min-w-0">

                <p className="font-semibold text-sm text-[#252525] truncate">
                  {item.name}
                </p>

                <p className="text-xs text-[#8A806B]">
                  ৳{item.price} × {item.quantity}
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


      {/* =====================================================
          CONTROL PANEL
      ===================================================== */}
      <div className="p-5 border-b border-[#E4E0D7]">

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">


          {/* Payment status for waiter */}
          {isWaiterOrder && (

            <div>

              <label className="block text-xs font-bold text-[#77705F] mb-2">
                Payment Status
              </label>

              <select
                value={order.paymentStatus || "paid"}
                onChange={(e) =>
                  onUpdatePaymentStatus(
                    order.id,
                    e.target.value
                  )
                }
                className="w-full h-10 px-3 rounded-xl border border-[#D8D5CC] bg-white text-sm font-semibold outline-none"
              >

                <option value="pending">
                  Pending
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

          )}


          {/* Order Status */}
          <div>

            <label className="block text-xs font-bold text-[#77705F] mb-2">
              Order Status
            </label>

            <select
              value={order.orderStatus || "pending"}
              onChange={(e) =>
                onUpdateOrderStatus(
                  order,
                  e.target.value
                )
              }
              className="w-full h-10 px-3 rounded-xl border border-[#D8D5CC] bg-white text-sm font-semibold outline-none"
            >

              {isOnlineOrder &&
                order.paymentStatus !== "paid" ? (

                <>
                  <option value="pending_payment_verification">
                    Payment Verification
                  </option>

                  <option value="cancelled">
                    Cancelled
                  </option>
                </>

              ) : (

                <>
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
                </>

              )}

            </select>

          </div>

        </div>

      </div>


      {/* =====================================================
          Price Summary
      ===================================================== */}
      <div className="p-5">

        <div className="space-y-2">

          <div className="flex justify-between text-sm">

            <span className="text-[#8A806B]">
              Subtotal
            </span>

            <span className="font-semibold">
              ৳{subtotal}
            </span>

          </div>


          {deliveryFee > 0 && (

            <div className="flex justify-between text-sm">

              <span className="text-[#8A806B]">
                Delivery Fee
              </span>

              <span className="font-semibold">
                ৳{deliveryFee}
              </span>

            </div>

          )}


          <div className="border-t border-[#E4E0D7] pt-3 flex justify-between">

            <span className="font-bold text-[#252525]">
              Total
            </span>

            <span className="text-xl font-extrabold text-[#252525]">
              ৳{total}
            </span>

          </div>

        </div>


        {/* Note */}
        {order.note && (

          <div className="mt-4 bg-[#F7F5EF] rounded-xl p-4">

            <p className="text-xs font-bold text-[#77705F]">
              Customer Note
            </p>

            <p className="mt-1 text-sm text-[#252525]">
              {order.note}
            </p>

          </div>

        )}

      </div>

    </div>
  );
};


// =====================================================
// Main Orders Page
// =====================================================
const Orders = () => {

  const { user } = useAuth();

  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);


  // =====================================================
  // Real-time Orders
  // =====================================================
  useEffect(() => {

    const ordersQuery = query(
      collection(db, "orders"),
      orderBy("createdAt", "desc")
    );


    const unsubscribe = onSnapshot(
      ordersQuery,

      (snapshot) => {

        const orderList = snapshot.docs.map(
          (docSnapshot) => ({
            id: docSnapshot.id,
            ...docSnapshot.data(),
          })
        );

        setOrders(orderList);

        setLoading(false);
      },

      (error) => {

        console.error(
          "Error loading orders:",
          error
        );

        setLoading(false);
      }
    );


    return () => unsubscribe();

  }, []);


  // =====================================================
  // Update Order Status
  // =====================================================
  const updateOrderStatus = async (
    order,
    newStatus
  ) => {

    // Online order cannot be confirmed before payment
    if (
      order.orderSource !== "waiter" &&
      order.paymentStatus !== "paid" &&
      [
        "confirmed",
        "preparing",
        "ready",
        "delivered",
        "completed",
      ].includes(newStatus)
    ) {

      alert(
        "Please verify the bKash payment first."
      );

      return;
    }


    try {

      await updateDoc(
        doc(db, "orders", order.id),
        {
          orderStatus: newStatus,
          updatedAt: serverTimestamp(),
        }
      );

    } catch (error) {

      console.error(
        "Error updating order:",
        error
      );

      alert(
        "Failed to update order status."
      );
    }
  };


  // =====================================================
  // Update Waiter Payment Status
  // =====================================================
  const updatePaymentStatus = async (
    orderId,
    newStatus
  ) => {

    try {

      await updateDoc(
        doc(db, "orders", orderId),
        {
          paymentStatus: newStatus,
          updatedAt: serverTimestamp(),
        }
      );

    } catch (error) {

      console.error(
        "Error updating payment:",
        error
      );

      alert(
        "Failed to update payment status."
      );
    }
  };


  // =====================================================
  // VERIFY bKASH PAYMENT
  // =====================================================
  const verifyBkashPayment = async (order) => {

    const confirmed = window.confirm(
      `Have you checked your actual bKash transaction history and confirmed that:\n\nTransaction ID: ${order.transactionId}\nAmount: ৳${order.paymentAmount || order.total}\n\nmatches your bKash transaction?`
    );


    if (!confirmed) {
      return;
    }


    try {

      await updateDoc(
        doc(db, "orders", order.id),
        {

          paymentStatus: "paid",

          orderStatus: "confirmed",

          paymentVerifiedAt:
            serverTimestamp(),

          paymentVerifiedBy:
            user?.uid || "",

          updatedAt:
            serverTimestamp(),
        }
      );


      alert(
        "bKash payment verified successfully. Order confirmed."
      );

    } catch (error) {

      console.error(
        "Error verifying payment:",
        error
      );

      alert(
        "Failed to verify payment."
      );
    }
  };


  // =====================================================
  // REJECT bKASH PAYMENT
  // =====================================================
  const rejectBkashPayment = async (order) => {

    const reason =
      window.prompt(
        "Why are you rejecting this payment?\n\nExample: Transaction ID or amount did not match.",
        "Transaction ID or amount did not match."
      );


    if (reason === null) {
      return;
    }


    try {

      await updateDoc(
        doc(db, "orders", order.id),
        {

          paymentStatus: "failed",

          orderStatus: "cancelled",

          paymentRejectedAt:
            serverTimestamp(),

          paymentRejectedBy:
            user?.uid || "",

          paymentRejectionReason:
            reason.trim(),

          updatedAt:
            serverTimestamp(),
        }
      );


      alert(
        "Payment rejected and order cancelled."
      );

    } catch (error) {

      console.error(
        "Error rejecting payment:",
        error
      );

      alert(
        "Failed to reject payment."
      );
    }
  };


  // =====================================================
  // Statistics
  // =====================================================

  const pendingCount = useMemo(() => {

    return orders.filter(
      (order) =>
        order.orderStatus === "pending" ||
        order.orderStatus ===
          "pending_payment_verification"
    ).length;

  }, [orders]);


  const confirmedCount = useMemo(() => {

    return orders.filter(
      (order) =>
        order.orderStatus === "confirmed"
    ).length;

  }, [orders]);


  const preparingCount = useMemo(() => {

    return orders.filter(
      (order) =>
        order.orderStatus === "preparing"
    ).length;

  }, [orders]);


  const readyCount = useMemo(() => {

    return orders.filter(
      (order) =>
        order.orderStatus === "ready"
    ).length;

  }, [orders]);


  const paymentVerificationCount =
    useMemo(() => {

      return orders.filter(
        (order) =>
          order.paymentStatus === "submitted"
      ).length;

    }, [orders]);


  const waiterOrders = useMemo(() => {

    return orders.filter(
      (order) =>
        order.orderSource === "waiter"
    );

  }, [orders]);


  const onlineOrders = useMemo(() => {

    return orders.filter(
      (order) =>
        order.orderSource !== "waiter"
    );

  }, [orders]);


  const todayWaiterOrders =
    useMemo(() => {

      return waiterOrders.filter(
        (order) =>
          isToday(order.createdAt)
      );

    }, [waiterOrders]);


  const todayOnlineOrders =
    useMemo(() => {

      return onlineOrders.filter(
        (order) =>
          isToday(order.createdAt)
      );

    }, [onlineOrders]);


  const todayWaiterSales =
    useMemo(() => {

      return todayWaiterOrders.reduce(
        (total, order) =>
          total + Number(order.total || 0),
        0
      );

    }, [todayWaiterOrders]);


  const todayTotalSales =
    useMemo(() => {

      return orders
        .filter(
          (order) =>
            isToday(order.createdAt) &&
            order.paymentStatus === "paid" &&
            order.orderStatus !== "cancelled"
        )
        .reduce(
          (total, order) =>
            total + Number(order.total || 0),
          0
        );

    }, [orders]);


  // =====================================================
  // Loading
  // =====================================================
  if (loading) {

    return (

      <div className="min-h-screen bg-[#F7F5EF] flex items-center justify-center">

        <div className="text-center">

          <span className="loading loading-spinner loading-lg text-[#252525]"></span>

          <p className="mt-3 text-sm text-[#8A806B]">
            Loading orders...
          </p>

        </div>

      </div>

    );
  }


  return (

    <div className="min-h-screen bg-[#F7F5EF] py-8 sm:py-10">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">


        {/* =====================================================
            HEADER
        ===================================================== */}
        <div className="mb-8">

          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#252525]">
            Order Management
          </h1>

          <p className="mt-2 text-[#8A806B]">
            Manage online bKash orders and waiter orders
            from one place.
          </p>

        </div>


        {/* =====================================================
            MAIN STATS
        ===================================================== */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">


          <div className="bg-white rounded-2xl border border-[#E4E0D7] p-5">

            <p className="text-xs text-[#8A806B]">
              Pending
            </p>

            <p className="mt-1 text-2xl font-extrabold text-[#252525]">
              {pendingCount}
            </p>

          </div>


          <div className="bg-white rounded-2xl border border-[#E4E0D7] p-5">

            <p className="text-xs text-[#8A806B]">
              Payment Verification
            </p>

            <p className="mt-1 text-2xl font-extrabold text-amber-600">
              {paymentVerificationCount}
            </p>

          </div>


          <div className="bg-white rounded-2xl border border-[#E4E0D7] p-5">

            <p className="text-xs text-[#8A806B]">
              Confirmed
            </p>

            <p className="mt-1 text-2xl font-extrabold text-blue-600">
              {confirmedCount}
            </p>

          </div>


          <div className="bg-white rounded-2xl border border-[#E4E0D7] p-5">

            <p className="text-xs text-[#8A806B]">
              Preparing
            </p>

            <p className="mt-1 text-2xl font-extrabold text-purple-600">
              {preparingCount}
            </p>

          </div>


          <div className="bg-white rounded-2xl border border-[#E4E0D7] p-5">

            <p className="text-xs text-[#8A806B]">
              Ready
            </p>

            <p className="mt-1 text-2xl font-extrabold text-green-600">
              {readyCount}
            </p>

          </div>

        </div>


        {/* =====================================================
            BUSINESS STATS
        ===================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">


          <div className="bg-white rounded-2xl border border-[#E4E0D7] p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs text-[#8A806B]">
                  Today's Total Sales
                </p>

                <p className="mt-1 text-2xl font-extrabold text-[#252525]">
                  ৳{todayTotalSales}
                </p>

              </div>

              <FaMoneyBillWave
                className="text-[#A08E65]"
                size={24}
              />

            </div>

          </div>


          <div className="bg-white rounded-2xl border border-[#E4E0D7] p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs text-[#8A806B]">
                  Today's Waiter Sales
                </p>

                <p className="mt-1 text-2xl font-extrabold text-[#252525]">
                  ৳{todayWaiterSales}
                </p>

              </div>

              <FaUserTie
                className="text-[#A08E65]"
                size={24}
              />

            </div>

          </div>


          <div className="bg-white rounded-2xl border border-[#E4E0D7] p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs text-[#8A806B]">
                  Today's Online Orders
                </p>

                <p className="mt-1 text-2xl font-extrabold text-[#252525]">
                  {todayOnlineOrders.length}
                </p>

              </div>

              <FaMobileAlt
                className="text-pink-500"
                size={24}
              />

            </div>

          </div>

        </div>


        {/* =====================================================
            ORDERS
        ===================================================== */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">


          {/* =====================================================
              WAITER ORDERS
          ===================================================== */}
          <div>

            <div className="flex items-center justify-between mb-4">

              <div>

                <h2 className="text-xl font-extrabold text-[#252525]">
                  Waiter Orders
                </h2>

                <p className="text-sm text-[#8A806B] mt-1">
                  Orders recorded by waiter
                </p>

              </div>

              <span className="px-3 py-1 rounded-full bg-white border border-[#E4E0D7] text-sm font-bold">
                {waiterOrders.length}
              </span>

            </div>


            {waiterOrders.length === 0 ? (

              <div className="bg-white rounded-2xl border border-[#E4E0D7] p-10 text-center">

                <FaUserTie
                  className="mx-auto text-[#C8C2B5]"
                  size={32}
                />

                <p className="mt-3 font-semibold text-[#252525]">
                  No waiter orders yet.
                </p>

              </div>

            ) : (

              <div className="space-y-5">

                {waiterOrders.map((order) => (

                  <OrderCard
                    key={order.id}
                    order={order}
                    onUpdateOrderStatus={
                      updateOrderStatus
                    }
                    onUpdatePaymentStatus={
                      updatePaymentStatus
                    }
                    onVerifyPayment={
                      verifyBkashPayment
                    }
                    onRejectPayment={
                      rejectBkashPayment
                    }
                  />

                ))}

              </div>

            )}

          </div>


          {/* =====================================================
              ONLINE ORDERS
          ===================================================== */}
          <div>

            <div className="flex items-center justify-between mb-4">

              <div>

                <h2 className="text-xl font-extrabold text-[#252525]">
                  Online Orders
                </h2>

                <p className="text-sm text-[#8A806B] mt-1">
                  bKash advance payment orders
                </p>

              </div>

              <span className="px-3 py-1 rounded-full bg-pink-50 border border-pink-100 text-sm font-bold text-pink-600">
                {onlineOrders.length}
              </span>

            </div>


            {onlineOrders.length === 0 ? (

              <div className="bg-white rounded-2xl border border-[#E4E0D7] p-10 text-center">

                <FaMobileAlt
                  className="mx-auto text-[#C8C2B5]"
                  size={32}
                />

                <p className="mt-3 font-semibold text-[#252525]">
                  No online orders yet.
                </p>

              </div>

            ) : (

              <div className="space-y-5">

                {onlineOrders.map((order) => (

                  <OrderCard
                    key={order.id}
                    order={order}
                    onUpdateOrderStatus={
                      updateOrderStatus
                    }
                    onUpdatePaymentStatus={
                      updatePaymentStatus
                    }
                    onVerifyPayment={
                      verifyBkashPayment
                    }
                    onRejectPayment={
                      rejectBkashPayment
                    }
                  />

                ))}

              </div>

            )}

          </div>

        </div>

      </div>

    </div>

  );
};

export default Orders;