import React, { useState } from "react";
import {
  FaMinus,
  FaPlus,
  FaTrash,
  FaArrowLeft,
  FaLock,
  FaMobileAlt,
  FaCheckCircle,
  FaCopy,
} from "react-icons/fa";
import { Link } from "react-router";
import { useCart } from "../../Contexts/CartContext";

import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";

import { db } from "../../Firebase/Firebase.config";


// =====================================================
// IMPORTANT
// এখানে তোমার আসল Cha Buzz bKash number বসাবে
// =====================================================
const BKASH_NUMBER = "01XXXXXXXXX";


const Cart = () => {
  const {
    cartItems,
    totalPrice,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    postcode: "",
    note: "",
  });

  const [transactionId, setTransactionId] = useState("");

  const [paymentCompleted, setPaymentCompleted] = useState(false);

  const [loading, setLoading] = useState(false);

  // Order successfully submitted হলে এই ID থাকবে
  const [submittedOrderId, setSubmittedOrderId] = useState(null);

  const deliveryFee = cartItems.length > 0 ? 50 : 0;

  const grandTotal = Number(totalPrice) + Number(deliveryFee);


  // =====================================================
  // Form change
  // =====================================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };


  // =====================================================
  // Copy bKash number
  // =====================================================
  const handleCopyNumber = async () => {
    try {
      await navigator.clipboard.writeText(BKASH_NUMBER);
      alert("bKash number copied!");
    } catch (error) {
      console.error("Copy failed:", error);
      alert("Please copy the number manually.");
    }
  };


  // =====================================================
  // Place Order
  // =====================================================
  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    if (!formData.name.trim()) {
      alert("Please enter your name.");
      return;
    }

    if (!formData.phone.trim()) {
      alert("Please enter your phone number.");
      return;
    }

    if (!formData.address.trim()) {
      alert("Please enter your delivery address.");
      return;
    }

    if (!paymentCompleted) {
      alert(
        `Please send ৳${grandTotal} to our bKash number first.`
      );
      return;
    }

    if (!transactionId.trim()) {
      alert("Please enter your bKash Transaction ID.");
      return;
    }


    // =====================================================
    // Confirm customer actually sent money
    // =====================================================
    const confirmPayment = window.confirm(
      `Have you sent ৳${grandTotal} to bKash number ${BKASH_NUMBER}?`
    );

    if (!confirmPayment) {
      return;
    }


    try {
      setLoading(true);

      const cleanTransactionId = transactionId.trim();


      // =====================================================
      // Prevent same Transaction ID from being submitted twice
      // =====================================================
      const duplicateQuery = query(
        collection(db, "orders"),
        where("transactionId", "==", cleanTransactionId)
      );

      const duplicateSnapshot = await getDocs(
        duplicateQuery
      );

      if (!duplicateSnapshot.empty) {
        alert(
          "This Transaction ID has already been submitted."
        );

        setLoading(false);
        return;
      }


      // =====================================================
      // Prepare order items
      // =====================================================
      const orderItems = cartItems.map((item) => ({
        id: item.id,
        name: item.name,
        price: Number(item.price),
        quantity: Number(item.quantity),
        image: item.image || "",
        category: item.category || "",
      }));


      // =====================================================
      // Firestore Order
      // =====================================================
      const orderData = {
        items: orderItems,

        customer: {
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          address: formData.address.trim(),
          postcode: formData.postcode.trim(),
        },

        note: formData.note.trim(),

        subtotal: Number(totalPrice),

        deliveryFee: Number(deliveryFee),

        total: Number(grandTotal),

        orderSource: "online",

        paymentMethod: "bkash",

        // Customer submitted payment proof
        paymentStatus: "submitted",

        // Admin এখনো verify করেনি
        orderStatus: "pending_payment_verification",

        // Customer entered TrxID
        transactionId: cleanTransactionId,

        // Customer says this amount was paid
        paymentAmount: Number(grandTotal),

        createdAt: serverTimestamp(),

        paymentSubmittedAt: serverTimestamp(),
      };


      // =====================================================
      // Save Order
      // =====================================================
      const orderRef = await addDoc(
        collection(db, "orders"),
        orderData
      );


      // =====================================================
      // Clear cart after successful submission
      // =====================================================
      clearCart();

      setSubmittedOrderId(orderRef.id);

    } catch (error) {
      console.error(
        "Error submitting order:",
        error
      );

      alert(
        "Failed to submit order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };


  // =====================================================
  // ORDER SUBMITTED SCREEN
  // =====================================================
  if (submittedOrderId) {
    return (
      <div className="min-h-screen bg-[#F7F5EF] flex items-center justify-center px-4 py-12">

        <div className="w-full max-w-xl bg-white rounded-3xl border border-[#E4E0D7] shadow-xl p-6 sm:p-10 text-center">

          <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-6">
            <FaCheckCircle
              className="text-green-600"
              size={42}
            />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#252525]">
            Payment Submitted!
          </h1>

          <p className="mt-3 text-[#77705F] leading-relaxed">
            Your order has been submitted successfully.
            Our admin will verify your bKash payment
            manually before confirming the order.
          </p>


          <div className="mt-6 bg-[#F7F5EF] rounded-2xl p-5 text-left">

            <p className="text-sm text-[#8A806B]">
              Order ID
            </p>

            <p className="mt-1 font-bold text-[#252525] break-all">
              {submittedOrderId}
            </p>


            <div className="mt-4">
              <p className="text-sm text-[#8A806B]">
                Payment Status
              </p>

              <div className="mt-1 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 text-amber-700 text-sm font-semibold">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                Waiting for verification
              </div>
            </div>

          </div>


          <div className="mt-6 bg-pink-50 border border-pink-100 rounded-2xl p-5 text-left">

            <div className="flex items-center gap-3">

              <div className="w-11 h-11 rounded-xl bg-pink-500 text-white flex items-center justify-center">
                <FaMobileAlt />
              </div>

              <div>
                <p className="font-bold text-[#252525]">
                  bKash Payment
                </p>

                <p className="text-sm text-[#77705F]">
                  Transaction ID submitted successfully
                </p>
              </div>

            </div>

            <p className="mt-4 text-sm text-[#77705F]">
              Please keep your bKash transaction information
              until the order is confirmed.
            </p>

          </div>


          <Link
            to="/"
            className="mt-7 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#252525] text-white font-semibold hover:bg-[#A08E65] transition"
          >
            <FaArrowLeft size={13} />
            Back to Home
          </Link>

        </div>

      </div>
    );
  }


  // =====================================================
  // EMPTY CART
  // =====================================================
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#F7F5EF] flex items-center justify-center px-4">

        <div className="text-center">

          <div className="text-6xl mb-5">
            🛒
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#252525]">
            Your Cart is Empty
          </h1>

          <p className="mt-2 text-[#8A806B]">
            Add some delicious food to your cart.
          </p>

          <Link
            to="/"
            className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-xl bg-[#252525] text-white font-semibold hover:bg-[#A08E65] transition"
          >
            <FaArrowLeft size={13} />
            Continue Shopping
          </Link>

        </div>

      </div>
    );
  }


  return (
    <div className="min-h-screen bg-[#F7F5EF] py-8 sm:py-12">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">


        {/* =====================================================
            Header
        ===================================================== */}
        <div className="mb-8">

          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#77705F] hover:text-[#252525] transition"
          >
            <FaArrowLeft size={12} />
            Continue Shopping
          </Link>

          <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold text-[#252525]">
            Checkout
          </h1>

          <p className="mt-2 text-[#8A806B]">
            Review your order and complete bKash payment.
          </p>

        </div>


        <form onSubmit={handlePlaceOrder}>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">


            {/* =====================================================
                LEFT SIDE
            ===================================================== */}
            <div className="lg:col-span-2 space-y-6">


              {/* =====================================================
                  Cart Items
              ===================================================== */}
              <div className="bg-white rounded-2xl border border-[#E4E0D7] shadow-sm overflow-hidden">

                <div className="px-5 sm:px-6 py-5 border-b border-[#E4E0D7]">

                  <h2 className="text-xl font-bold text-[#252525]">
                    Your Order
                  </h2>

                  <p className="text-sm text-[#8A806B] mt-1">
                    {cartItems.length} food item
                    {cartItems.length !== 1 ? "s" : ""}
                  </p>

                </div>


                <div className="divide-y divide-[#E4E0D7]">

                  {cartItems.map((item) => (

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

                            <h3 className="font-bold text-[#252525] text-sm sm:text-base">
                              {item.name}
                            </h3>

                            <p className="text-xs text-[#8A806B] mt-1">
                              ৳{item.price} each
                            </p>

                          </div>


                          <button
                            type="button"
                            onClick={() =>
                              removeFromCart(item.id)
                            }
                            className="text-red-400 hover:text-red-600 transition"
                          >
                            <FaTrash size={14} />
                          </button>

                        </div>


                        <div className="mt-3 flex items-center justify-between">

                          <div className="flex items-center border border-[#D8D5CC] rounded-lg overflow-hidden">

                            <button
                              type="button"
                              onClick={() =>
                                decreaseQuantity(item.id)
                              }
                              className="w-8 h-8 flex items-center justify-center hover:bg-[#F7F5EF]"
                            >
                              <FaMinus size={10} />
                            </button>

                            <span className="w-9 text-center text-sm font-bold">
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                increaseQuantity(item.id)
                              }
                              className="w-8 h-8 flex items-center justify-center hover:bg-[#F7F5EF]"
                            >
                              <FaPlus size={10} />
                            </button>

                          </div>


                          <p className="font-extrabold text-[#252525]">
                            ৳
                            {Number(item.price) *
                              Number(item.quantity)}
                          </p>

                        </div>

                      </div>

                    </div>

                  ))}

                </div>

              </div>


              {/* =====================================================
                  Customer Information
              ===================================================== */}
              <div className="bg-white rounded-2xl border border-[#E4E0D7] shadow-sm p-5 sm:p-6">

                <h2 className="text-xl font-bold text-[#252525]">
                  Delivery Information
                </h2>

                <p className="text-sm text-[#8A806B] mt-1 mb-6">
                  Enter your information so we can contact you.
                </p>


                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">


                  <div>

                    <label className="block text-sm font-semibold text-[#252525] mb-2">
                      Name *
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      className="w-full h-11 px-4 rounded-xl border border-[#D8D5CC] outline-none focus:border-[#252525]"
                      required
                    />

                  </div>


                  <div>

                    <label className="block text-sm font-semibold text-[#252525] mb-2">
                      Phone Number *
                    </label>

                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="01XXXXXXXXX"
                      className="w-full h-11 px-4 rounded-xl border border-[#D8D5CC] outline-none focus:border-[#252525]"
                      required
                    />

                  </div>


                  <div>

                    <label className="block text-sm font-semibold text-[#252525] mb-2">
                      Email Address
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="example@email.com"
                      className="w-full h-11 px-4 rounded-xl border border-[#D8D5CC] outline-none focus:border-[#252525]"
                    />

                  </div>


                  <div>

                    <label className="block text-sm font-semibold text-[#252525] mb-2">
                      Postcode
                    </label>

                    <input
                      type="text"
                      name="postcode"
                      value={formData.postcode}
                      onChange={handleChange}
                      placeholder="Postcode"
                      className="w-full h-11 px-4 rounded-xl border border-[#D8D5CC] outline-none focus:border-[#252525]"
                    />

                  </div>


                  <div className="sm:col-span-2">

                    <label className="block text-sm font-semibold text-[#252525] mb-2">
                      Address *
                    </label>

                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter your complete delivery address"
                      rows="3"
                      className="w-full px-4 py-3 rounded-xl border border-[#D8D5CC] outline-none focus:border-[#252525] resize-none"
                      required
                    />

                  </div>


                  <div className="sm:col-span-2">

                    <label className="block text-sm font-semibold text-[#252525] mb-2">
                      Note
                    </label>

                    <textarea
                      name="note"
                      value={formData.note}
                      onChange={handleChange}
                      placeholder="Any special instruction?"
                      rows="3"
                      className="w-full px-4 py-3 rounded-xl border border-[#D8D5CC] outline-none focus:border-[#252525] resize-none"
                    />

                  </div>

                </div>

              </div>


              {/* =====================================================
                  bKash Payment
              ===================================================== */}
              <div className="bg-white rounded-2xl border border-pink-200 shadow-sm overflow-hidden">

                <div className="p-5 sm:p-6">

                  <div className="flex items-center gap-3">

                    <div className="w-12 h-12 rounded-xl bg-pink-500 text-white flex items-center justify-center">
                      <FaMobileAlt size={20} />
                    </div>

                    <div>

                      <h2 className="text-xl font-bold text-[#252525]">
                        bKash Payment
                      </h2>

                      <p className="text-sm text-[#8A806B]">
                        Advance payment required
                      </p>

                    </div>

                  </div>


                  {/* Payment instruction */}
                  <div className="mt-6 bg-pink-50 border border-pink-100 rounded-2xl p-5">

                    <p className="text-sm font-semibold text-[#252525]">
                      Step 1 — Send exact amount
                    </p>

                    <p className="mt-2 text-sm text-[#77705F]">
                      Send exactly
                    </p>

                    <p className="text-3xl font-extrabold text-pink-600 mt-1">
                      ৳{grandTotal}
                    </p>


                    <div className="mt-4">

                      <p className="text-xs text-[#8A806B] mb-2">
                        Send to this bKash number
                      </p>


                      <div className="flex items-center gap-2">

                        <div className="flex-1 h-12 px-4 rounded-xl bg-white border border-pink-200 flex items-center font-extrabold text-lg text-[#252525]">
                          {BKASH_NUMBER}
                        </div>


                        <button
                          type="button"
                          onClick={handleCopyNumber}
                          className="h-12 w-12 rounded-xl bg-pink-500 text-white flex items-center justify-center hover:bg-pink-600 transition"
                          title="Copy number"
                        >
                          <FaCopy size={15} />
                        </button>

                      </div>

                    </div>


                    <div className="mt-5 text-sm text-[#77705F] space-y-1">

                      <p>
                        • Send the exact order amount.
                      </p>

                      <p>
                        • Do not send your bKash PIN or OTP to anyone.
                      </p>

                      <p>
                        • Keep your transaction ID after payment.
                      </p>

                    </div>

                  </div>


                  {/* Payment completed checkbox */}
                  <label className="mt-5 flex items-start gap-3 cursor-pointer">

                    <input
                      type="checkbox"
                      checked={paymentCompleted}
                      onChange={(e) =>
                        setPaymentCompleted(
                          e.target.checked
                        )
                      }
                      className="mt-1 w-5 h-5 accent-pink-500"
                    />

                    <span className="text-sm text-[#252525]">
                      I have sent{" "}
                      <strong>
                        ৳{grandTotal}
                      </strong>{" "}
                      to the above bKash number.
                    </span>

                  </label>


                  {/* Transaction ID */}
                  <div className="mt-5">

                    <label className="block text-sm font-semibold text-[#252525] mb-2">
                      bKash Transaction ID *
                    </label>

                    <input
                      type="text"
                      value={transactionId}
                      onChange={(e) =>
                        setTransactionId(
                          e.target.value
                        )
                      }
                      placeholder="Enter your bKash TrxID"
                      className="w-full h-12 px-4 rounded-xl border border-[#D8D5CC] outline-none focus:border-pink-500 uppercase"
                      required
                    />

                    <p className="mt-2 text-xs text-[#8A806B]">
                      Example: 8KJ7A6B2CD
                    </p>

                  </div>


                  {/* Verification notice */}
                  <div className="mt-5 flex gap-3 bg-[#F7F5EF] rounded-xl p-4">

                    <FaLock
                      className="mt-0.5 text-[#A08E65] shrink-0"
                      size={14}
                    />

                    <p className="text-xs sm:text-sm text-[#77705F] leading-relaxed">
                      Your payment will be manually verified
                      by Cha Buzz admin. Your order will only
                      be confirmed after the Transaction ID
                      and payment amount match our bKash
                      transaction record.
                    </p>

                  </div>

                </div>

              </div>

            </div>


            {/* =====================================================
                RIGHT SIDE — SUMMARY
            ===================================================== */}
            <div className="lg:col-span-1">

              <div className="bg-white rounded-2xl border border-[#E4E0D7] shadow-sm p-5 sm:p-6 lg:sticky lg:top-6">

                <h2 className="text-xl font-bold text-[#252525]">
                  Order Summary
                </h2>


                <div className="mt-5 space-y-3">

                  <div className="flex justify-between text-sm">

                    <span className="text-[#8A806B]">
                      Subtotal
                    </span>

                    <span className="font-semibold text-[#252525]">
                      ৳{totalPrice}
                    </span>

                  </div>


                  <div className="flex justify-between text-sm">

                    <span className="text-[#8A806B]">
                      Delivery Fee
                    </span>

                    <span className="font-semibold text-[#252525]">
                      ৳{deliveryFee}
                    </span>

                  </div>


                  <div className="border-t border-[#E4E0D7] pt-4 flex justify-between">

                    <span className="font-bold text-[#252525]">
                      Total
                    </span>

                    <span className="text-2xl font-extrabold text-[#252525]">
                      ৳{grandTotal}
                    </span>

                  </div>

                </div>


                {/* Payment method */}
                <div className="mt-6 p-4 rounded-xl bg-pink-50 border border-pink-100">

                  <div className="flex items-center gap-3">

                    <div className="w-10 h-10 rounded-lg bg-pink-500 text-white flex items-center justify-center">
                      <FaMobileAlt size={16} />
                    </div>

                    <div>

                      <p className="font-bold text-[#252525]">
                        bKash
                      </p>

                      <p className="text-xs text-[#8A806B]">
                        Advance payment
                      </p>

                    </div>

                  </div>

                </div>


                {/* Place Order */}
                <button
                  type="submit"
                  disabled={
                    loading ||
                    !paymentCompleted ||
                    !transactionId.trim()
                  }
                  className="mt-6 w-full h-12 rounded-xl bg-[#252525] text-white font-bold flex items-center justify-center gap-2 hover:bg-[#A08E65] disabled:opacity-50 disabled:cursor-not-allowed transition"
                >

                  {loading ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <FaCheckCircle size={15} />
                      Submit Order
                    </>
                  )}

                </button>


                <p className="mt-4 text-center text-xs text-[#8A806B] leading-relaxed">
                  We'll contact you once the payment is
                  verified and your order is confirmed.
                </p>

              </div>

            </div>

          </div>

        </form>

      </div>

    </div>
  );
};

export default Cart;