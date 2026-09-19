import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";

const LanguageContext = createContext();

export const useLanguage = () => {
    const context = useContext(LanguageContext);

    if (!context) {
        throw new Error(
            "useLanguage must be used inside LanguageProvider"
        );
    }

    return context;
};

// ================= TRANSLATIONS =================

const translations = {
    en: {
        // Navbar
        searchFood: "Search food...",
        searchMenu: "Search food in menu...",
        cart: "Cart",

        // Brand
        teaAndFood: "TEA & FOOD",

        // Footer
        freshFoodDescription:
            "Fresh food, refreshing tea, and a cozy place to enjoy every moment. Order your favorite food easily from Cha Buzz.",

        quickLinks: "Quick Links",
        home: "Home",
        ourMenu: "Our Menu",
        aboutUs: "About Us",
        contactUs: "Contact Us",
        myOrders: "My Orders",

        contact: "Contact Us",
        openingHours: "Opening Hours",

        saturdayThursday: "Saturday - Thursday",
        friday: "Friday",

        openToday: "Open Today",

        privacyPolicy: "Privacy Policy",
        termsConditions: "Terms & Conditions",

        allRightsReserved: "All rights reserved.",

        // Food
        price: "Price",
        addToCart: "Add to Cart",
        buyNow: "Buy Now",

        // Cart
        checkout: "Checkout",
        yourOrder: "Your Order",
        orderSummary: "Order Summary",
        subtotal: "Subtotal",
        deliveryFee: "Delivery Fee",
        total: "Total",

        customerInformation: "Customer Information",
        name: "Name",
        phoneNumber: "Phone Number",
        emailAddress: "Email Address",
        address: "Address",
        note: "Note",
        optional: "Optional",

        payment: "Payment",
        paymentMethod: "Payment Method",
        onlinePayment: "Online Payment",
        cashOnDelivery: "Cash on Delivery",

        bkashPayment: "bKash Payment",
        advancePaymentRequired: "Advance payment is required to confirm your order.",

        transactionId: "Transaction ID",
        submitOrder: "Submit Order",

        continueShopping: "Continue Shopping",

        // Orders
        orders: "Orders",
        onlineOrders: "Online Orders",
        waiterOrders: "Waiter Orders",

        pending: "Pending",
        confirmed: "Confirmed",
        preparing: "Preparing",
        ready: "Ready",
        completed: "Completed",
        cancelled: "Cancelled",

        paymentSubmitted: "Payment Submitted",
        paymentVerification: "Payment Verification",
        paid: "Paid",
        unpaid: "Unpaid",
        rejected: "Rejected",

        allProducts: "All Products",
        exploreFoodDrinks: "Explore our delicious food & drinks",
        sortBy: "Sort by:",
        default: "Default",
        priceLowHigh: "Price: Low to High",
        priceHighLow: "Price: High to Low",
        highestRated: "Highest Rated",
        itemsAvailable: "items available",

        categories: "Categories",
        categoryList: "Category List",

        tea: "Tea",
        coffee: "Coffee",
        coldDrinks: "Cold Drinks",
        burger: "Burger",
        pizza: "Pizza",
        chicken: "Chicken",
        pasta: "Pasta",
        sandwich: "Sandwich",
        fries: "Fries",
        desserts: "Desserts",

        bkashNumberCopied: "bKash number copied!",
        copyNumberManually: "Please copy the number manually.",
        cartEmpty: "Your cart is empty.",
        enterName: "Please enter your name.",
        enterPhone: "Please enter your phone number.",
        enterAddress: "Please enter your delivery address.",
        sendPaymentFirst: "Please send the required amount to our bKash number first.",
        enterTransactionId: "Please enter your bKash Transaction ID.",
        confirmPayment: "Have you sent the required amount to the bKash number?",
        duplicateTransaction: "This Transaction ID has already been submitted.",
        submitOrderFailed: "Failed to submit order. Please try again.",

        orderSubmittedSuccessfully:
            "Your order has been submitted successfully. Our admin will verify your bKash payment manually before confirming the order.",

        orderId: "Order ID",
        paymentStatus: "Payment Status",
        waitingVerification: "Waiting for verification",
        transactionSubmitted: "Transaction ID submitted successfully",
        keepTransactionInfo:
            "Please keep your bKash transaction information until the order is confirmed.",

        cartEmptyTitle: "Your Cart is Empty",
        cartEmptyDescription:
            "Add some delicious food to your cart.",

        checkoutDescription:
            "Review your order and complete bKash payment.",

        foodItem: "food item",
        foodItems: "food items",
        each: "each",

        enterContactInformation:
            "Enter your information so we can contact you.",

        fullNamePlaceholder: "Your full name",
        addressPlaceholder:
            "Enter your complete delivery address",
        notePlaceholder:
            "Any special instruction?",

        step1SendExactAmount:
            "Step 1 — Send exact amount",
        sendExactly: "Send exactly",
        sendToBkashNumber:
            "Send to this bKash number",
        copyNumber: "Copy number",
        sendExactAmount:
            "Send the exact order amount.",
        dontSharePinOtp:
            "Do not send your bKash PIN or OTP to anyone.",
        keepTransactionId:
            "Keep your transaction ID after payment.",

        paymentSentConfirmation:
            "I have sent",
        toBkashNumberAbove:
            "to the above bKash number.",

        transactionPlaceholder:
            "Enter your bKash TrxID",
        transactionExample:
            "Example: 8KJ7A6B2CD",

        paymentVerificationNotice:
            "Your payment will be manually verified by Cha Buzz admin. Your order will only be confirmed after the Transaction ID and payment amount match our bKash transaction record.",

        advancePayment: "Advance payment",

        submitting: "Submitting...",

        paymentContactNotice:
            "We'll contact you once the payment is verified and your order is confirmed.",

        verifyPayment: "Verify Payment",
        rejectPayment: "Reject Payment",

        // Common
        loading: "Loading...",
        noData: "No data found.",
        backToHome: "Back to Home",
    },

    bn: {
        // Navbar
        searchFood: "খাবার খুঁজুন...",
        searchMenu: "মেনুতে খাবার খুঁজুন...",
        cart: "কার্ট",

        // Brand
        teaAndFood: "চা ও খাবার",

        // Footer
        freshFoodDescription:
            "তাজা খাবার, সতেজ চা এবং প্রতিটি মুহূর্ত উপভোগ করার জন্য একটি আরামদায়ক পরিবেশ। Cha Buzz থেকে সহজেই আপনার পছন্দের খাবার অর্ডার করুন।",

        quickLinks: "দ্রুত লিংক",
        home: "হোম",
        ourMenu: "আমাদের মেনু",
        aboutUs: "আমাদের সম্পর্কে",
        contactUs: "যোগাযোগ",
        myOrders: "আমার অর্ডার",

        contact: "যোগাযোগ করুন",
        openingHours: "খোলার সময়",

        saturdayThursday: "শনিবার - বৃহস্পতিবার",
        friday: "শুক্রবার",

        openToday: "আজ খোলা",

        privacyPolicy: "প্রাইভেসি পলিসি",
        termsConditions: "শর্তাবলী",

        allRightsReserved: "সর্বস্বত্ব সংরক্ষিত।",

        // Food
        price: "মূল্য",
        addToCart: "কার্টে যোগ করুন",
        buyNow: "এখনই কিনুন",

        // Cart
        checkout: "চেকআউট",
        yourOrder: "আপনার অর্ডার",
        orderSummary: "অর্ডারের সারাংশ",
        subtotal: "সাবটোটাল",
        deliveryFee: "ডেলিভারি চার্জ",
        total: "মোট",

        customerInformation: "গ্রাহকের তথ্য",
        name: "নাম",
        phoneNumber: "ফোন নম্বর",
        emailAddress: "ইমেইল ঠিকানা",
        address: "ঠিকানা",
        note: "নোট",
        optional: "ঐচ্ছিক",

        payment: "পেমেন্ট",
        paymentMethod: "পেমেন্ট পদ্ধতি",
        onlinePayment: "অনলাইন পেমেন্ট",
        cashOnDelivery: "ক্যাশ অন ডেলিভারি",

        bkashPayment: "বিকাশ পেমেন্ট",
        advancePaymentRequired:
            "অর্ডার নিশ্চিত করার জন্য অগ্রিম পেমেন্ট প্রয়োজন।",

        transactionId: "ট্রানজেকশন আইডি",
        submitOrder: "অর্ডার সাবমিট করুন",

        continueShopping: "কেনাকাটা চালিয়ে যান",

        // Orders
        orders: "অর্ডারসমূহ",
        onlineOrders: "অনলাইন অর্ডার",
        waiterOrders: "ওয়েটার অর্ডার",

        pending: "অপেক্ষমান",
        confirmed: "নিশ্চিত",
        preparing: "প্রস্তুত করা হচ্ছে",
        ready: "প্রস্তুত",
        completed: "সম্পন্ন",
        cancelled: "বাতিল",

        paymentSubmitted: "পেমেন্ট জমা দেওয়া হয়েছে",
        paymentVerification: "পেমেন্ট যাচাই",
        paid: "পেমেন্ট হয়েছে",
        unpaid: "পেমেন্ট হয়নি",
        rejected: "বাতিল করা হয়েছে",

        allProducts: "সকল পণ্য",
        exploreFoodDrinks: "আমাদের সুস্বাদু খাবার ও পানীয় উপভোগ করুন",
        sortBy: "সাজান:",
        default: "ডিফল্ট",
        priceLowHigh: "কম দাম থেকে বেশি",
        priceHighLow: "বেশি দাম থেকে কম",
        highestRated: "সর্বোচ্চ রেটিং",
        itemsAvailable: "টি আইটেম পাওয়া যাচ্ছে",

        categories: "ক্যাটাগরি",
        categoryList: "ক্যাটাগরি তালিকা",

        tea: "চা",
        coffee: "কফি",
        coldDrinks: "কোল্ড ড্রিংকস",
        burger: "বার্গার",
        pizza: "পিজ্জা",
        chicken: "চিকেন",
        pasta: "পাস্তা",
        sandwich: "স্যান্ডউইচ",
        fries: "ফ্রাই",
        desserts: "ডেজার্ট",

        bkashNumberCopied: "বিকাশ নম্বর কপি হয়েছে!",
        copyNumberManually: "দয়া করে নম্বরটি ম্যানুয়ালি কপি করুন।",
        cartEmpty: "আপনার কার্ট খালি।",
        enterName: "আপনার নাম লিখুন।",
        enterPhone: "আপনার ফোন নম্বর লিখুন।",
        enterAddress: "আপনার ডেলিভারি ঠিকানা লিখুন।",
        sendPaymentFirst:
            "প্রথমে আমাদের বিকাশ নম্বরে প্রয়োজনীয় টাকা পাঠান।",
        enterTransactionId:
            "আপনার বিকাশ ট্রানজেকশন আইডি লিখুন।",
        confirmPayment:
            "আপনি কি বিকাশ নম্বরে প্রয়োজনীয় টাকা পাঠিয়েছেন?",
        duplicateTransaction:
            "এই ট্রানজেকশন আইডি ইতিমধ্যে সাবমিট করা হয়েছে।",
        submitOrderFailed:
            "অর্ডার সাবমিট করা যায়নি। আবার চেষ্টা করুন।",

        orderSubmittedSuccessfully:
            "আপনার অর্ডার সফলভাবে সাবমিট হয়েছে। অর্ডার নিশ্চিত করার আগে আমাদের অ্যাডমিন আপনার বিকাশ পেমেন্ট ম্যানুয়ালি যাচাই করবেন।",

        orderId: "অর্ডার আইডি",
        paymentStatus: "পেমেন্ট স্ট্যাটাস",
        waitingVerification: "ভেরিফিকেশনের অপেক্ষায়",
        transactionSubmitted:
            "ট্রানজেকশন আইডি সফলভাবে সাবমিট হয়েছে",
        keepTransactionInfo:
            "অর্ডার কনফার্ম না হওয়া পর্যন্ত আপনার বিকাশ ট্রানজেকশনের তথ্য সংরক্ষণ করুন।",

        cartEmptyTitle: "আপনার কার্ট খালি",
        cartEmptyDescription:
            "আপনার পছন্দের কিছু সুস্বাদু খাবার কার্টে যোগ করুন।",

        checkoutDescription:
            "আপনার অর্ডার দেখুন এবং বিকাশ পেমেন্ট সম্পন্ন করুন।",

        foodItem: "টি খাবার",
        foodItems: "টি খাবার",
        each: "প্রতি পিস",

        enterContactInformation:
            "যোগাযোগের জন্য আপনার তথ্য দিন।",

        fullNamePlaceholder: "আপনার পুরো নাম",
        addressPlaceholder:
            "আপনার সম্পূর্ণ ডেলিভারি ঠিকানা লিখুন",
        notePlaceholder:
            "কোনো বিশেষ নির্দেশনা?",

        step1SendExactAmount:
            "ধাপ ১ — সঠিক পরিমাণ টাকা পাঠান",
        sendExactly: "সঠিক পরিমাণ পাঠান",
        sendToBkashNumber:
            "এই বিকাশ নম্বরে পাঠান",
        copyNumber: "নম্বর কপি করুন",
        sendExactAmount:
            "অর্ডারের সঠিক পরিমাণ টাকা পাঠান।",
        dontSharePinOtp:
            "আপনার বিকাশ PIN বা OTP কারো সাথে শেয়ার করবেন না।",
        keepTransactionId:
            "পেমেন্টের পর আপনার ট্রানজেকশন আইডি সংরক্ষণ করুন।",

        paymentSentConfirmation:
            "আমি পাঠিয়েছি",
        toBkashNumberAbove:
            "উপরের বিকাশ নম্বরে।",

        transactionPlaceholder:
            "আপনার বিকাশ TrxID লিখুন",
        transactionExample:
            "উদাহরণ: 8KJ7A6B2CD",

        paymentVerificationNotice:
            "আপনার পেমেন্ট Cha Buzz অ্যাডমিন ম্যানুয়ালি যাচাই করবেন। ট্রানজেকশন আইডি এবং পেমেন্টের পরিমাণ আমাদের বিকাশ ট্রানজেকশন রেকর্ডের সাথে মিললে অর্ডার নিশ্চিত করা হবে।",

        advancePayment: "অগ্রিম পেমেন্ট",

        submitting: "সাবমিট হচ্ছে...",

        paymentContactNotice:
            "পেমেন্ট যাচাই এবং অর্ডার নিশ্চিত হওয়ার পর আমরা আপনার সাথে যোগাযোগ করব।",



        verifyPayment: "পেমেন্ট যাচাই করুন",
        rejectPayment: "পেমেন্ট বাতিল করুন",


        // Common
        loading: "লোড হচ্ছে...",
        noData: "কোনো তথ্য পাওয়া যায়নি।",
        backToHome: "হোমে ফিরে যান",
    },
};

// ================= PROVIDER =================

const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(() => {
        const savedLanguage = localStorage.getItem("chaBuzzLanguage");

        return savedLanguage === "bn" ? "bn" : "en";
    });

    useEffect(() => {
        localStorage.setItem("chaBuzzLanguage", language);

        document.documentElement.lang =
            language === "bn" ? "bn" : "en";
    }, [language]);

    // ================= TRANSLATE =================

    const t = useCallback(
        (key) => {
            return (
                translations[language]?.[key] ||
                translations.en?.[key] ||
                key
            );
        },
        [language]
    );

    // ================= CHANGE LANGUAGE =================

    const changeLanguage = (newLanguage) => {
        if (newLanguage === "en" || newLanguage === "bn") {
            setLanguage(newLanguage);
        }
    };

    // ================= TOGGLE =================

    const toggleLanguage = () => {
        setLanguage((currentLanguage) =>
            currentLanguage === "en" ? "bn" : "en"
        );
    };

    const languageInfo = {
        language,
        isBangla: language === "bn",
        t,
        changeLanguage,
        toggleLanguage,
    };

    return (
        <LanguageContext.Provider value={languageInfo}>
            {children}
        </LanguageContext.Provider>
    );
};

export default LanguageProvider;