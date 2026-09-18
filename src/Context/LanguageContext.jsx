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