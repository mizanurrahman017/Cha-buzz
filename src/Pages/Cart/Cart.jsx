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
import { useLanguage } from "../../Context/LanguageContext";
import { getProductPricing } from "../../Utils/productPricing";

import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";

import { db } from "../../Firebase/Firebase.config";

const BKASH_NUMBER = "01869438544";
const FIXED_DELIVERY_FEE = 50;

const money = (value) =>
  `৳${Number(value || 0).toLocaleString("en-BD", {
    maximumFractionDigits: 2,
  })}`;

const Cart = () => {
  const {
    cartItems,
    totalPrice,
    totalDiscount,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    note: "",
  });

  const [transactionId, setTransactionId] = useState("");
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submittedOrderId, setSubmittedOrderId] = useState(null);

  // Recalculate pricing from the current cart items.
  const pricedItems = cartItems.map((item) => {
    const pricing = getProductPricing(item);
    const quantity = Number(item.quantity || 0);

    return {
      ...item,
      regularPrice: pricing.regularPrice,
      discountPerItem: pricing.discountPerItem,
      discountedPrice: pricing.discountedPrice,
      hasDiscount: pricing.hasDiscount,
      quantity,
      lineSubtotal: pricing.regularPrice * quantity,
      lineDiscount: pricing.discountPerItem * quantity,
      lineTotal: pricing.discountedPrice * quantity,
    };
  });

  const originalSubtotal = pricedItems.reduce(
    (sum, item) => sum + item.lineSubtotal,
    0
  );

  const calculatedDiscount = pricedItems.reduce(
    (sum, item) => sum + item.lineDiscount,
    0
  );

  // CartContext totalPrice is already calculated using discounted prices.
  const subtotal = Number(totalPrice || 0);
  const productDiscount = Number(
    totalDiscount ?? calculatedDiscount
  );

  const deliveryFee =
    cartItems.length > 0 ? FIXED_DELIVERY_FEE : 0;

  // Packing charge is not collected from online customers here.
  const packingCharge = 0;

  const grandTotal =
    subtotal + deliveryFee + packingCharge;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleCopyNumber = async () => {
    try {
      await navigator.clipboard.writeText(BKASH_NUMBER);
      alert(t("bkashNumberCopied") || "bKash number copied!");
    } catch (error) {
      console.error("Copy failed:", error);
      alert(
        t("copyNumberManually") ||
          "Please copy the number manually."
      );
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      alert(t("cartEmpty") || "Your cart is empty.");
      return;
    }

    if (!formData.name.trim()) {
      alert(t("enterName") || "Please enter your name.");
      return;
    }

    if (!formData.phone.trim()) {
      alert(t("enterPhone") || "Please enter your phone number.");
      return;
    }

    if (!formData.address.trim()) {
      alert(t("enterAddress") || "Please enter your delivery address.");
      return;
    }

    if (!paymentCompleted) {
      alert(
        t("sendPaymentFirst") ||
          `Please send ${money(grandTotal)} to our bKash number first.`
      );
      return;
    }

    const cleanTransactionId = transactionId.trim();

    if (!cleanTransactionId) {
      alert(
        t("enterTransactionId") ||
          "Please enter your bKash Transaction ID."
      );
      return;
    }

    const confirmPayment = window.confirm(
      t("confirmPayment") ||
        `Have you sent ${money(grandTotal)} to bKash number ${BKASH_NUMBER}?`
    );

    if (!confirmPayment) return;

    try {
      setLoading(true);

      // Check whether this Transaction ID has already been submitted.
      const duplicateQuery = query(
        collection(db, "orders"),
        where("transactionId", "==", cleanTransactionId)
      );

      const duplicateSnapshot = await getDocs(duplicateQuery);

      if (!duplicateSnapshot.empty) {
        alert(
          t("duplicateTransaction") ||
            "This Transaction ID has already been submitted."
        );
        return;
      }

      // Save a snapshot of product prices and discounts at order time.
      const orderItems = pricedItems.map((item) => ({
        id: item.id,
        name: item.name,
        image: item.image || "",
        category: item.category || "",
        price: item.regularPrice,
        regularPrice: item.regularPrice,
        discountType: item.discountType || "fixed",
        discountValue: Number(item.discountValue || 0),
        discountActive: Boolean(item.discountActive),
        discountPerItem: item.discountPerItem,
        discountedPrice: item.discountedPrice,
        quantity: item.quantity,
        lineSubtotal: item.lineSubtotal,
        lineDiscount: item.lineDiscount,
        lineTotal: item.lineTotal,
      }));

      const orderData = {
        items: orderItems,

        customer: {
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          address: formData.address.trim(),
        },

        note: formData.note.trim(),

        // Original product price before discounts.
        originalSubtotal: Number(originalSubtotal),

        // Total discount for all products.
        productDiscount: Number(productDiscount),

        // Subtotal after product discounts.
        subtotal: Number(subtotal),

        packingCharge: Number(packingCharge),
        deliveryFee: Number(deliveryFee),
        total: Number(grandTotal),

        orderSource: "online",
        paymentMethod: "bkash",
        paymentStatus: "submitted",
        orderStatus: "pending_payment_verification",

        transactionId: cleanTransactionId,
        paymentAmount: Number(grandTotal),

        createdAt: serverTimestamp(),
        paymentSubmittedAt: serverTimestamp(),
      };

      const orderRef = await addDoc(
        collection(db, "orders"),
        orderData
      );

      clearCart();
      setSubmittedOrderId(orderRef.id);
    } catch (error) {
      console.error("Error submitting order:", error);

      alert(
        t("submitOrderFailed") ||
          "Failed to submit order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ORDER SUBMITTED
  if (submittedOrderId) {
    return (
      <div className="min-h-screen bg-[#F7F5EF] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-xl bg-white rounded-3xl border border-[#E4E0D7] shadow-xl p-6 sm:p-10 text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-6">
            <FaCheckCircle className="text-green-600" size={42} />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#252525]">
            {t("paymentSubmitted") || "Payment Submitted"}
          </h1>

          <p className="mt-3 text-[#77705F] leading-relaxed">
            {t("orderSubmittedSuccessfully") ||
              "Your order has been submitted successfully. Our admin will verify your bKash payment manually before confirming the order."}
          </p>

          <div className="mt-6 bg-[#F7F5EF] rounded-2xl p-5 text-left">
            <p className="text-sm text-[#8A806B]">
              {t("orderId") || "Order ID"}
            </p>

            <p className="mt-1 font-bold text-[#252525] break-all">
              {submittedOrderId}
            </p>

            <p className="mt-4 text-sm text-[#8A806B]">
              {t("paymentStatus") || "Payment Status"}
            </p>

            <span className="mt-1 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 text-amber-700 text-sm font-semibold">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              {t("waitingVerification") || "Waiting for verification"}
            </span>
          </div>

          <div className="mt-6 bg-pink-50 border border-pink-100 rounded-2xl p-5 text-left">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-pink-500 text-white flex items-center justify-center">
                <FaMobileAlt />
              </div>

              <div>
                <p className="font-bold text-[#252525]">
                  {t("bkashPayment") || "bKash Payment"}
                </p>
                <p className="text-sm text-[#77705F]">
                  {t("transactionSubmitted") ||
                    "Transaction ID submitted successfully"}
                </p>
              </div>
            </div>

            <p className="mt-4 text-sm text-[#77705F]">
              {t("keepTransactionInfo") ||
                "Please keep your bKash transaction information until the order is confirmed."}
            </p>
          </div>

          <Link
            to="/"
            className="mt-7 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#252525] text-white font-semibold hover:bg-[#A08E65] transition"
          >
            <FaArrowLeft size={13} />
            {t("backToHome") || "Back to Home"}
          </Link>
        </div>
      </div>
    );
  }

  // EMPTY CART
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#F7F5EF] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl mb-5">🛒</div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#252525]">
            {t("cartEmptyTitle") || "Your Cart is Empty"}
          </h1>

          <p className="mt-2 text-[#8A806B]">
            {t("cartEmptyDescription") ||
              "Add some delicious food to your cart."}
          </p>

          <Link
            to="/"
            className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-xl bg-[#252525] text-white font-semibold hover:bg-[#A08E65] transition"
          >
            <FaArrowLeft size={13} />
            {t("continueShopping") || "Continue Shopping"}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F5EF] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#77705F] hover:text-[#252525] transition"
          >
            <FaArrowLeft size={12} />
            {t("continueShopping") || "Continue Shopping"}
          </Link>

          <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold text-[#252525]">
            {t("checkout") || "Checkout"}
          </h1>

          <p className="mt-2 text-[#8A806B]">
            {t("checkoutDescription") ||
              "Review your order and complete bKash payment."}
          </p>
        </div>

        <form onSubmit={handlePlaceOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT */}
            <div className="lg:col-span-2 space-y-6">
              {/* CART ITEMS */}
              <div className="bg-white rounded-2xl border border-[#E4E0D7] shadow-sm overflow-hidden">
                <div className="px-5 sm:px-6 py-5 border-b border-[#E4E0D7]">
                  <h2 className="text-xl font-bold text-[#252525]">
                    {t("yourOrder") || "Your Order"}
                  </h2>

                  <p className="text-sm text-[#8A806B] mt-1">
                    {cartItems.length}{" "}
                    {cartItems.length !== 1
                      ? t("foodItems") || "items"
                      : t("foodItem") || "item"}
                  </p>
                </div>

                <div className="divide-y divide-[#E4E0D7]">
                  {pricedItems.map((item) => (
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

                            <div className="flex items-baseline flex-wrap gap-2 mt-1">
                              {item.hasDiscount && (
                                <span className="text-sm text-gray-400 line-through">
                                  {money(item.regularPrice)}
                                </span>
                              )}

                              <span className="text-sm font-semibold text-green-700">
                                {money(item.discountedPrice)}{" "}
                                {t("each") || "each"}
                              </span>
                            </div>

                            {item.hasDiscount && (
                              <p className="mt-1 text-xs text-green-700">
                                You save {money(item.discountPerItem)} per item
                              </p>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            aria-label={`Remove ${item.name}`}
                            className="text-red-400 hover:text-red-600 transition"
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>

                        <div className="mt-3 flex items-center justify-between gap-3">
                          <div className="flex items-center border border-[#D8D5CC] rounded-lg overflow-hidden">
                            <button
                              type="button"
                              onClick={() => decreaseQuantity(item.id)}
                              aria-label="Decrease quantity"
                              className="w-8 h-8 flex items-center justify-center hover:bg-[#F7F5EF]"
                            >
                              <FaMinus size={10} />
                            </button>

                            <span className="w-9 text-center text-sm font-bold">
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() => increaseQuantity(item.id)}
                              aria-label="Increase quantity"
                              className="w-8 h-8 flex items-center justify-center hover:bg-[#F7F5EF]"
                            >
                              <FaPlus size={10} />
                            </button>
                          </div>

                          <div className="text-right">
                            {item.hasDiscount && (
                              <p className="text-xs text-gray-400 line-through">
                                {money(item.lineSubtotal)}
                              </p>
                            )}

                            <p className="font-extrabold text-[#252525]">
                              {money(item.lineTotal)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CUSTOMER INFORMATION */}
              <div className="bg-white rounded-2xl border border-[#E4E0D7] shadow-sm p-5 sm:p-6">
                <h2 className="text-xl font-bold text-[#252525]">
                  {t("customerInformation") || "Delivery Information"}
                </h2>

                <p className="text-sm text-[#8A806B] mt-1 mb-6">
                  {t("enterContactInformation") ||
                    "Enter your information so we can contact you."}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#252525] mb-2">
                      {t("name") || "Name"} *
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
                      {t("phoneNumber") || "Phone Number"} *
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

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-[#252525] mb-2">
                      {t("address") || "Address"} *
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
                      {t("note") || "Note"}
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

              {/* BKASH PAYMENT */}
              <div className="bg-white rounded-2xl border border-pink-200 shadow-sm overflow-hidden">
                <div className="p-5 sm:p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-pink-500 text-white flex items-center justify-center">
                      <FaMobileAlt size={20} />
                    </div>

                    <div>
                      <h2 className="text-xl font-bold text-[#252525]">
                        {t("bkashPayment") || "bKash Payment"}
                      </h2>

                      <p className="text-sm text-[#8A806B]">
                        {t("advancePaymentRequired") ||
                          "Advance payment required"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 bg-pink-50 border border-pink-100 rounded-2xl p-5">
                    <p className="text-sm font-semibold text-[#252525]">
                      {t("step1SendExactAmount") ||
                        "Step 1 — Send exact amount"}
                    </p>

                    <p className="mt-2 text-sm text-[#77705F]">
                      {t("sendExactly") || "Send exactly"}
                    </p>

                    <p className="text-3xl font-extrabold text-pink-600 mt-1">
                      {money(grandTotal)}
                    </p>

                    <div className="mt-4">
                      <p className="text-xs text-[#8A806B] mb-2">
                        {t("sendToBkashNumber") ||
                          "Send to this bKash number"}
                      </p>

                      <div className="flex items-center gap-2">
                        <div className="flex-1 min-w-0 h-12 px-4 rounded-xl bg-white border border-pink-200 flex items-center font-extrabold text-lg text-[#252525]">
                          {BKASH_NUMBER}
                        </div>

                        <button
                          type="button"
                          onClick={handleCopyNumber}
                          className="h-12 w-12 shrink-0 rounded-xl bg-pink-500 text-white flex items-center justify-center hover:bg-pink-600 transition"
                          title="Copy number"
                        >
                          <FaCopy size={15} />
                        </button>
                      </div>
                    </div>

                    <div className="mt-5 text-sm text-[#77705F] space-y-1">
                      <p>• Send the exact order amount.</p>
                      <p>• Do not share your bKash PIN or OTP.</p>
                      <p>• Keep your transaction ID after payment.</p>
                    </div>
                  </div>

                  <label className="mt-5 flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={paymentCompleted}
                      onChange={(e) =>
                        setPaymentCompleted(e.target.checked)
                      }
                      className="mt-1 w-5 h-5 accent-pink-500"
                    />

                    <span className="text-sm text-[#252525]">
                      I have sent <strong>{money(grandTotal)}</strong> to
                      the above bKash number.
                    </span>
                  </label>

                  <div className="mt-5">
                    <label className="block text-sm font-semibold text-[#252525] mb-2">
                      {t("transactionId") || "Transaction ID"} *
                    </label>

                    <input
                      type="text"
                      value={transactionId}
                      onChange={(e) =>
                        setTransactionId(e.target.value)
                      }
                      placeholder="Enter your bKash TrxID"
                      className="w-full h-12 px-4 rounded-xl border border-[#D8D5CC] outline-none focus:border-pink-500 uppercase"
                      required
                    />

                    <p className="mt-2 text-xs text-[#8A806B]">
                      Example: 8KJ7A6B2CD
                    </p>
                  </div>

                  <div className="mt-5 flex gap-3 bg-[#F7F5EF] rounded-xl p-4">
                    <FaLock
                      className="mt-0.5 text-[#A08E65] shrink-0"
                      size={14}
                    />

                    <p className="text-xs sm:text-sm text-[#77705F] leading-relaxed">
                      Your payment will be manually verified by Cha Buzz
                      admin. Your order will only be confirmed after the
                      Transaction ID and payment amount are checked.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: ORDER SUMMARY */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-[#E4E0D7] shadow-sm p-5 sm:p-6 lg:sticky lg:top-6">
                <h2 className="text-xl font-bold text-[#252525]">
                  {t("orderSummary") || "Order Summary"}
                </h2>

                <div className="mt-5 space-y-3">
                  <div className="flex justify-between gap-3 text-sm">
                    <span className="text-[#8A806B]">
                      Original subtotal
                    </span>
                    <span className="font-semibold text-[#252525]">
                      {money(originalSubtotal)}
                    </span>
                  </div>

                  <div className="flex justify-between gap-3 text-sm">
                    <span className="text-green-700">
                      Product discount
                    </span>
                    <span className="font-semibold text-green-700">
                      −{money(productDiscount)}
                    </span>
                  </div>

                  <div className="flex justify-between gap-3 text-sm">
                    <span className="text-[#8A806B]">
                      {t("subtotal") || "Subtotal after discount"}
                    </span>
                    <span className="font-semibold text-[#252525]">
                      {money(subtotal)}
                    </span>
                  </div>

                  <div className="flex justify-between gap-3 text-sm">
                    <span className="text-[#8A806B]">
                      Packing charge
                    </span>
                    <span className="font-semibold text-[#252525]">
                      {money(packingCharge)}
                    </span>
                  </div>

                  <div className="flex justify-between gap-3 text-sm">
                    <span className="text-[#8A806B]">
                      {t("deliveryFee") || "Delivery fee"}
                    </span>
                    <span className="font-semibold text-[#252525]">
                      {money(deliveryFee)}
                    </span>
                  </div>

                  <div className="border-t border-[#E4E0D7] pt-4 flex justify-between gap-3">
                    <span className="font-bold text-[#252525]">
                      {t("total") || "Total"}
                    </span>
                    <span className="text-2xl font-extrabold text-[#252525]">
                      {money(grandTotal)}
                    </span>
                  </div>
                </div>

                <div className="mt-6 p-4 rounded-xl bg-pink-50 border border-pink-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-pink-500 text-white flex items-center justify-center">
                      <FaMobileAlt size={16} />
                    </div>

                    <div>
                      <p className="font-bold text-[#252525]">
                        {t("bkashPayment") || "bKash Payment"}
                      </p>
                      <p className="text-xs text-[#8A806B]">
                        {t("advancePayment") || "Advance payment"}
                      </p>
                    </div>
                  </div>
                </div>

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
                      <span className="loading loading-spinner loading-sm" />
                      {t("submitting") || "Submitting..."}
                    </>
                  ) : (
                    <>
                      <FaCheckCircle size={15} />
                      {t("submitOrder") || "Submit Order"}
                    </>
                  )}
                </button>

                <p className="mt-4 text-center text-xs text-[#8A806B] leading-relaxed">
                  {t("paymentContactNotice") ||
                    "We'll contact you once the payment is verified and your order is confirmed."}
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