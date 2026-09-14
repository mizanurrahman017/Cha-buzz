import React, { useState } from "react";
import {
  FaMinus,
  FaPlus,
  FaTrash,
  FaArrowLeft,
  FaLock,
  FaCreditCard,
} from "react-icons/fa";
import { Link } from "react-router";
import { useCart } from "../../Contexts/CartContext";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
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

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    postcode: "",
    note: "",
  });

  const [loading, setLoading] = useState(false);

  const deliveryFee = cartItems.length > 0 ? 50 : 0;
  const grandTotal = Number(totalPrice) + deliveryFee;

  // Handle form input
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Place order
  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    // Required field validation
    if (
      !formData.name.trim() ||
      !formData.phone.trim() ||
      !formData.address.trim() ||
      !formData.postcode.trim()
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);

      /*
       * Step 1:
       * Create a pending order in Firestore.
       *
       * IMPORTANT:
       * Order is NOT marked as paid here.
       * Payment will be verified by the backend.
       */
      const orderData = {
        items: cartItems.map((item) => ({
          id: item.id,
          name: item.name,
          price: Number(item.price),
          quantity: Number(item.quantity),
          image: item.image || "",
          category: item.category || "",
        })),

        customer: {
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          address: formData.address.trim(),
          postcode: formData.postcode.trim(),
          note: formData.note.trim(),
        },

        subtotal: Number(totalPrice),
        deliveryFee: Number(deliveryFee),
        total: Number(grandTotal),

        orderSource: "online",

        paymentMethod: "online",
        paymentStatus: "pending",

        orderStatus: "pending",

        createdAt: serverTimestamp(),
      };

      const orderRef = await addDoc(
        collection(db, "orders"),
        orderData
      );

      console.log("Pending order created:", orderRef.id);

      /*
       * Step 2:
       * Send order information to our backend.
       *
       * Backend will create the SSLCommerz payment session.
       */
      const paymentResponse = await fetch(
        "http://localhost:5000/api/payment/create",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            orderId: orderRef.id,

            customer: {
              name: formData.name.trim(),
              phone: formData.phone.trim(),
              email: formData.email.trim(),
              address: formData.address.trim(),
              postcode: formData.postcode.trim(),
              note: formData.note.trim(),
            },

            items: cartItems.map((item) => ({
              id: item.id,
              name: item.name,
              price: Number(item.price),
              quantity: Number(item.quantity),
              category: item.category || "",
            })),

            subtotal: Number(totalPrice),
            deliveryFee: Number(deliveryFee),
            total: Number(grandTotal),
          }),
        }
      );

      const paymentData = await paymentResponse.json();

      console.log("Payment API response:", paymentData);

      if (!paymentResponse.ok || !paymentData.success) {
        throw new Error(
          paymentData.message ||
            paymentData.failedreason ||
            "Failed to create payment session."
        );
      }

      /*
       * Step 3:
       * Redirect customer to SSLCommerz payment page.
       */
      if (paymentData.gatewayPageURL) {
        window.location.href = paymentData.gatewayPageURL;
        return;
      }

      throw new Error("Payment gateway URL was not received.");
    } catch (error) {
      console.error("Online payment error:", error);

      alert(
        error.message ||
          "Something went wrong while processing your order."
      );
    } finally {
      setLoading(false);
    }
  };

  // Empty cart
  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] bg-[#F7F5EF] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-white border border-[#E4E0D7] flex items-center justify-center shadow-sm">
            <FaCreditCard className="text-2xl text-[#8A806B]" />
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

  return (
    <div className="min-h-screen bg-[#F7F5EF] py-8 sm:py-10 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page Header */}
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

          {/* LEFT SIDE */}
          <div className="lg:col-span-7 space-y-6">

            {/* Cart Items */}
            <div className="bg-white rounded-2xl border border-[#E4E0D7] shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-[#E4E0D7] flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-[#252525]">
                    Your Order
                  </h2>

                  <p className="text-xs text-[#8A806B] mt-1">
                    {cartItems.reduce(
                      (total, item) => total + item.quantity,
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
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 sm:p-5 flex gap-4"
                  >
                    {/* Image */}
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover shrink-0"
                    />

                    {/* Info */}
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
                            removeFromCart(item.id)
                          }
                          className="text-[#8A806B] hover:text-red-500 transition"
                          aria-label={`Remove ${item.name}`}
                        >
                          <FaTrash size={13} />
                        </button>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        {/* Quantity */}
                        <div className="flex items-center border border-[#D8D5CC] rounded-lg overflow-hidden">
                          <button
                            type="button"
                            onClick={() =>
                              decreaseQuantity(item.id)
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
                              increaseQuantity(item.id)
                            }
                            className="w-8 h-8 flex items-center justify-center text-[#252525] hover:bg-[#F7F5EF] transition"
                          >
                            <FaPlus size={10} />
                          </button>
                        </div>

                        {/* Item total */}
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

            {/* Customer Information */}
            <form
              onSubmit={handlePlaceOrder}
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
                    Name <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                    className="w-full h-12 px-4 rounded-xl border border-[#D8D5CC] bg-[#FCFBF8] outline-none text-sm text-[#252525] placeholder:text-[#A8A092] focus:border-[#252525] transition"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-[#252525] mb-2">
                    Phone Number{" "}
                    <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
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
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example@gmail.com"
                    className="w-full h-12 px-4 rounded-xl border border-[#D8D5CC] bg-[#FCFBF8] outline-none text-sm text-[#252525] placeholder:text-[#A8A092] focus:border-[#252525] transition"
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-semibold text-[#252525] mb-2">
                    Delivery Address{" "}
                    <span className="text-red-500">*</span>
                  </label>

                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
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
                    <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    name="postcode"
                    value={formData.postcode}
                    onChange={handleChange}
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
                    value={formData.note}
                    onChange={handleChange}
                    placeholder="Any special instruction?"
                    rows="3"
                    className="w-full px-4 py-3 rounded-xl border border-[#D8D5CC] bg-[#FCFBF8] outline-none resize-none text-sm text-[#252525] placeholder:text-[#A8A092] focus:border-[#252525] transition"
                  />
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-sm font-semibold text-[#252525] mb-3">
                    Payment Method
                  </label>

                  <div className="border-2 border-[#252525] rounded-xl p-4 bg-[#FCFBF8]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#252525] text-white flex items-center justify-center">
                        <FaCreditCard size={16} />
                      </div>

                      <div>
                        <p className="text-sm font-bold text-[#252525]">
                          Online Payment
                        </p>

                        <p className="text-xs text-[#8A806B] mt-0.5">
                          Pay securely in advance
                        </p>
                      </div>

                      <div className="ml-auto w-5 h-5 rounded-full border-[5px] border-[#252525]" />
                    </div>
                  </div>
                </div>

                {/* Mobile Place Order Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="lg:hidden w-full h-12 rounded-xl bg-[#252525] text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#A08E65] disabled:opacity-60 disabled:cursor-not-allowed transition"
                >
                  {loading ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Processing...
                    </>
                  ) : (
                    <>
                      <FaLock size={12} />
                      Pay ৳{grandTotal} & Place Order
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-[#8A806B]">
                  We'll contact you once the order is confirmed.
                </p>
              </div>
            </form>
          </div>

          {/* RIGHT SIDE - ORDER SUMMARY */}
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
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-4 text-sm"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-[#252525] truncate">
                            {item.name}
                          </p>

                          <p className="text-xs text-[#8A806B] mt-0.5">
                            {item.quantity} × ৳{item.price}
                          </p>
                        </div>

                        <p className="font-semibold text-[#252525]">
                          ৳
                          {Number(item.price) *
                            Number(item.quantity)}
                        </p>
                      </div>
                    ))}
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

                  {/* Desktop Payment Button */}
                  <button
                    type="submit"
                    form="checkout-form"
                    disabled={loading}
                    className="hidden lg:flex mt-6 w-full h-12 rounded-xl bg-[#252525] text-white font-bold text-sm items-center justify-center gap-2 hover:bg-[#A08E65] disabled:opacity-60 disabled:cursor-not-allowed transition"
                  >
                    {loading ? (
                      <>
                        <span className="loading loading-spinner loading-sm"></span>
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        <FaLock size={12} />
                        Pay ৳{grandTotal} & Place Order
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
                      Your payment is processed securely through
                      our online payment gateway. Your order will
                      only be confirmed after successful payment
                      verification.
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