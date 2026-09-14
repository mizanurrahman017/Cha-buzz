import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

import {
  getApps,
  initializeApp,
  cert,
} from "firebase-admin/app";

import {
  getFirestore,
  FieldValue,
} from "firebase-admin/firestore";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

const FRONTEND_URL =
  process.env.FRONTEND_URL || "http://localhost:5173";

const BACKEND_URL =
  process.env.BACKEND_URL || "http://localhost:5000";

const isSandbox =
  process.env.SSLCOMMERZ_MODE !== "live";

// ==========================================
// Firebase Admin SDK
// ==========================================

const firebasePrivateKey =
  process.env.FIREBASE_PRIVATE_KEY?.replace(
    /\\n/g,
    "\n"
  );

if (
  !process.env.FIREBASE_PROJECT_ID ||
  !process.env.FIREBASE_CLIENT_EMAIL ||
  !firebasePrivateKey
) {
  console.error(
    "Firebase Admin credentials are missing from .env"
  );

  process.exit(1);
}

if (getApps().length === 0) {
  initializeApp({
    credential: cert({
      projectId:
        process.env.FIREBASE_PROJECT_ID,

      clientEmail:
        process.env.FIREBASE_CLIENT_EMAIL,

      privateKey:
        firebasePrivateKey,
    }),
  });
}

const db = getFirestore();

// ==========================================
// SSLCommerz URLs
// ==========================================

const SSL_CREATE_URL = isSandbox
  ? "https://sandbox-gw.sslcommerz.com/gwprocess/v4/api.php"
  : "https://securepay.sslcommerz.com/gwprocess/v4/api.php";

const SSL_VALIDATION_URL = isSandbox
  ? "https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php"
  : "https://securepay.sslcommerz.com/validator/api/validationserverAPI.php";

// ==========================================
// Middleware
// ==========================================

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// ==========================================
// Test Route
// ==========================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Cha Buzz payment server is running!",
    mode: isSandbox ? "sandbox" : "live",
  });
});

// ==========================================
// Find Gateway
// ==========================================

const findGateway = (
  gatewayList,
  gatewayName
) => {
  return gatewayList.find(
    (gateway) =>
      String(gateway?.gw || "").toLowerCase() ===
      gatewayName.toLowerCase()
  );
};

// ==========================================
// Validate SSLCommerz Transaction
// ==========================================

const validateTransaction = async (
  valId
) => {
  if (!valId) {
    throw new Error(
      "SSLCommerz validation ID is missing."
    );
  }

  const response = await axios.get(
    SSL_VALIDATION_URL,
    {
      params: {
        val_id: valId,

        store_id:
          process.env.SSLCOMMERZ_STORE_ID,

        store_passwd:
          process.env.SSLCOMMERZ_STORE_PASSWORD,

        format: "json",
      },

      timeout: 30000,
    }
  );

  return response.data;
};

// ==========================================
// Confirm Order From Payment
// ==========================================

const confirmOrderFromPayment = async ({
  paymentData,
  source,
}) => {
  const tranId =
    paymentData?.tran_id ||
    paymentData?.value_a;

  const valId =
    paymentData?.val_id;

  if (!tranId) {
    throw new Error(
      "Transaction ID was not found."
    );
  }

  if (!valId) {
    throw new Error(
      "Validation ID was not found."
    );
  }

  // ========================================
  // Validate transaction with SSLCommerz
  // ========================================

  const validation =
    await validateTransaction(valId);

  console.log(
    "SSLCommerz Validation:",
    validation
  );

  const validStatus =
    validation?.status === "VALID" ||
    validation?.status === "VALIDATED";

  if (!validStatus) {
    throw new Error(
      `Payment is not valid. Status: ${validation?.status}`
    );
  }

  // ========================================
  // Find Firestore Order
  // ========================================

  const orderRef = db
    .collection("orders")
    .doc(tranId);

  const orderSnap =
    await orderRef.get();

  if (!orderSnap.exists) {
    throw new Error(
      `Order ${tranId} was not found in Firestore.`
    );
  }

  const order = orderSnap.data();

  // ========================================
  // Amount Verification
  // ========================================

  const firestoreTotal =
    Number(order.total || 0);

  const sslAmount =
    Number(validation.amount || 0);

  if (
    firestoreTotal.toFixed(2) !==
    sslAmount.toFixed(2)
  ) {
    throw new Error(
      `Amount mismatch. Firestore: ${firestoreTotal}, SSLCommerz: ${sslAmount}`
    );
  }

  // ========================================
  // Currency Verification
  // ========================================

  if (
    validation.currency &&
    validation.currency !== "BDT"
  ) {
    throw new Error(
      `Invalid currency: ${validation.currency}`
    );
  }

  // ========================================
  // Already Processed
  // ========================================

  if (
    order.paymentStatus === "paid" &&
    order.orderStatus === "confirmed"
  ) {
    return {
      alreadyProcessed: true,

      orderId: tranId,

      validation,
    };
  }

  // ========================================
  // Update Firestore
  // ========================================

  await orderRef.update({
    paymentStatus: "paid",

    orderStatus: "confirmed",

    transactionId:
      validation.tran_id || tranId,

    validationId:
      validation.val_id || valId,

    paymentGateway:
      validation.card_type ||
      validation.card_name ||
      order.paymentMethod ||
      "sslcommerz",

    validatedAmount:
      sslAmount,

    currency:
      validation.currency || "BDT",

    paymentValidatedAt:
      FieldValue.serverTimestamp(),

    paymentValidatedBy:
      source,

    sslcommerzResponse: {
      status:
        validation.status || null,

      tran_date:
        validation.tran_date || null,

      bank_tran_id:
        validation.bank_tran_id || null,

      card_type:
        validation.card_type || null,

      currency:
        validation.currency || null,
    },
  });

  console.log(
    `Order ${tranId} confirmed successfully.`
  );

  return {
    alreadyProcessed: false,

    orderId: tranId,

    validation,
  };
};

// ==========================================
// CREATE PAYMENT
// ==========================================

app.post(
  "/api/payment/create",
  async (req, res) => {
    try {
      const {
        customer,
        items,
        subtotal,
        deliveryFee,
        total,
        orderId,
      } = req.body;

      // ======================================
      // Customer Validation
      // ======================================

      if (!customer?.name?.trim()) {
        return res.status(400).json({
          success: false,
          message:
            "Customer name is required.",
        });
      }

      if (!customer?.phone?.trim()) {
        return res.status(400).json({
          success: false,
          message:
            "Customer phone is required.",
        });
      }

      if (!customer?.address?.trim()) {
        return res.status(400).json({
          success: false,
          message:
            "Customer address is required.",
        });
      }

      if (!customer?.postcode?.trim()) {
        return res.status(400).json({
          success: false,
          message:
            "Customer postcode is required.",
        });
      }

      // ======================================
      // Cart Validation
      // ======================================

      if (
        !Array.isArray(items) ||
        items.length === 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Cart is empty.",
        });
      }

      // ======================================
      // Amount Validation
      // ======================================

      if (
        !total ||
        Number(total) <= 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid payment amount.",
        });
      }

      // ======================================
      // Order ID Required
      // ======================================

      if (!orderId) {
        return res.status(400).json({
          success: false,
          message:
            "Order ID is required.",
        });
      }

      // ======================================
      // Transaction ID
      // ======================================

      const tranId = orderId;

      // ======================================
      // Customer Information
      // ======================================

      const customerName =
        customer.name.trim();

      const customerPhone =
        customer.phone.trim();

      const customerEmail =
        customer.email?.trim() ||
        "customer@chabuzz.com";

      const customerAddress =
        customer.address.trim();

      const customerPostcode =
        customer.postcode.trim();

      // ======================================
      // Payment Data
      // ======================================

      const paymentData = {
        store_id:
          process.env.SSLCOMMERZ_STORE_ID,

        store_passwd:
          process.env.SSLCOMMERZ_STORE_PASSWORD,

        total_amount:
          Number(total).toFixed(2),

        currency: "BDT",

        tran_id: tranId,

        // Only bKash + Nagad
        multi_card_name:
          "bkash,nagad",

        // ====================================
        // Callback URLs
        // ====================================

        success_url:
          `${BACKEND_URL}/api/payment/success`,

        fail_url:
          `${BACKEND_URL}/api/payment/fail`,

        cancel_url:
          `${BACKEND_URL}/api/payment/cancel`,

        ipn_url:
          `${BACKEND_URL}/api/payment/ipn`,

        // ====================================
        // Customer
        // ====================================

        cus_name:
          customerName,

        cus_email:
          customerEmail,

        cus_phone:
          customerPhone,

        cus_add1:
          customerAddress,

        cus_city:
          "Sylhet",

        cus_postcode:
          customerPostcode,

        cus_country:
          "Bangladesh",

        // ====================================
        // Product
        // ====================================

        product_name:
          items.length === 1
            ? items[0].name
            : `Cha Buzz Order (${items.length} items)`,

        product_category:
          "Food",

        product_profile:
          "general",

        num_of_item:
          items.reduce(
            (sum, item) =>
              sum +
              Number(
                item.quantity || 0
              ),
            0
          ),

        // ====================================
        // Shipping
        // ====================================

        shipping_method:
          "YES",

        ship_name:
          customerName,

        ship_add1:
          customerAddress,

        ship_city:
          "Sylhet",

        ship_postcode:
          customerPostcode,

        ship_country:
          "Bangladesh",

        // ====================================
        // Custom Values
        // ====================================

        value_a:
          tranId,

        value_b:
          "cha-buzz",

        value_c:
          customerPostcode,
      };

      // ======================================
      // Debug
      // ======================================

      console.log(
        "======================================"
      );

      console.log(
        "Creating SSLCommerz Payment"
      );

      console.log({
        mode:
          isSandbox
            ? "SANDBOX"
            : "LIVE",

        tran_id:
          tranId,

        total_amount:
          paymentData.total_amount,

        customer:
          customerName,

        phone:
          customerPhone,

        gateways:
          paymentData.multi_card_name,
      });

      console.log(
        "======================================"
      );

      // ======================================
      // Create SSLCommerz Session
      // ======================================

      const response =
        await axios.post(
          SSL_CREATE_URL,

          new URLSearchParams(
            paymentData
          ).toString(),

          {
            headers: {
              "Content-Type":
                "application/x-www-form-urlencoded",
            },

            timeout: 30000,
          }
        );

      const data =
        response.data;

      console.log(
        "SSLCommerz Response:",
        data
      );

      // ======================================
      // Gateway URL Check
      // ======================================

      if (!data?.GatewayPageURL) {
        return res.status(400).json({
          success: false,

          message:
            data?.failedreason ||
            "Unable to create SSLCommerz payment session.",

          sslcommerzResponse:
            data,
        });
      }

      // ======================================
      // Gateway List
      // ======================================

      const gatewayList =
        Array.isArray(data.desc)
          ? data.desc
          : [];

      console.log(
        "Available Gateways:"
      );

      console.log(
        gatewayList.map(
          (gateway) => ({
            name:
              gateway.name,

            gw:
              gateway.gw,

            type:
              gateway.type,

            redirectGatewayURL:
              gateway.redirectGatewayURL,
          })
        )
      );

      // ======================================
      // Find bKash
      // ======================================

      const bkashGateway =
        findGateway(
          gatewayList,
          "bkash"
        );

      // ======================================
      // Find Nagad
      // ======================================

      const nagadGateway =
        findGateway(
          gatewayList,
          "nagad"
        );

      // ======================================
      // Debug
      // ======================================

      console.log(
        "bKash Gateway:",
        bkashGateway
      );

      console.log(
        "Nagad Gateway:",
        nagadGateway
      );

      // ======================================
      // Send Response
      // ======================================

      return res.status(200).json({
        success: true,

        message:
          "Payment session created successfully.",

        tranId,

        sessionKey:
          data.sessionkey ||
          null,

        paymentOptions: {
          bkash:
            bkashGateway?.redirectGatewayURL ||
            null,

          nagad:
            nagadGateway?.redirectGatewayURL ||
            null,
        },

        gatewayPageURL:
          data.GatewayPageURL,
      });
    } catch (error) {
      console.error(
        "======================================"
      );

      console.error(
        "SSLCommerz Payment Error"
      );

      console.error(
        error.response?.data ||
        error.message
      );

      console.error(
        "======================================"
      );

      return res.status(500).json({
        success: false,

        message:
          "Failed to create payment session.",

        error:
          error.response?.data ||
          error.message,
      });
    }
  }
);

// ==========================================
// PAYMENT SUCCESS
// ==========================================

const handlePaymentSuccess =
  async (req, res) => {
    try {
      console.log(
        "======================================"
      );

      console.log(
        "SSLCommerz SUCCESS"
      );

      console.log(
        req.body
      );

      const result =
        await confirmOrderFromPayment({
          paymentData:
            req.body,

          source:
            "success_callback",
        });

      console.log(
        "Payment successfully validated."
      );

      console.log(
        result
      );

      return res.redirect(
        `${FRONTEND_URL}/payment-success?orderId=${encodeURIComponent(
          result.orderId
        )}`
      );
    } catch (error) {
      console.error(
        "Payment success validation error:",
        error.message
      );

      return res.redirect(
        `${FRONTEND_URL}/payment-failed`
      );
    }
  };

app.post(
  "/api/payment/success",
  handlePaymentSuccess
);

app.get(
  "/api/payment/success",
  handlePaymentSuccess
);

// ==========================================
// PAYMENT FAILED
// ==========================================

const handlePaymentFailed =
  (req, res) => {
    console.log(
      "======================================"
    );

    console.log(
      "SSLCommerz PAYMENT FAILED"
    );

    console.log(
      req.body
    );

    return res.redirect(
      `${FRONTEND_URL}/payment-failed`
    );
  };

app.post(
  "/api/payment/fail",
  handlePaymentFailed
);

app.get(
  "/api/payment/fail",
  handlePaymentFailed
);

// ==========================================
// PAYMENT CANCELLED
// ==========================================

const handlePaymentCancelled =
  (req, res) => {
    console.log(
      "======================================"
    );

    console.log(
      "SSLCommerz PAYMENT CANCELLED"
    );

    console.log(
      req.body
    );

    return res.redirect(
      `${FRONTEND_URL}/payment-cancelled`
    );
  };

app.post(
  "/api/payment/cancel",
  handlePaymentCancelled
);

app.get(
  "/api/payment/cancel",
  handlePaymentCancelled
);

// ==========================================
// SSLCommerz IPN
// ==========================================

app.post(
  "/api/payment/ipn",
  async (req, res) => {
    try {
      console.log(
        "======================================"
      );

      console.log(
        "SSLCommerz IPN RECEIVED"
      );

      console.log(
        req.body
      );

      const result =
        await confirmOrderFromPayment({
          paymentData:
            req.body,

          source:
            "ipn",
        });

      console.log(
        "IPN payment validation result:"
      );

      console.log(
        result
      );

      return res.status(200).json({
        success: true,

        message:
          "IPN received and payment validated.",
      });
    } catch (error) {
      console.error(
        "IPN validation error:",
        error.message
      );

      return res.status(400).json({
        success: false,

        message:
          error.message,
      });
    }
  }
);

// ==========================================
// START SERVER
// ==========================================

app.listen(
  PORT,
  () => {
    console.log(
      "======================================"
    );

    console.log(
      `Cha Buzz server running on port ${PORT}`
    );

    console.log(
      `Payment mode: ${
        isSandbox
          ? "SANDBOX"
          : "LIVE"
      }`
    );

    console.log(
      `Frontend: ${FRONTEND_URL}`
    );

    console.log(
      `Backend: ${BACKEND_URL}`
    );

    console.log(
      "======================================"
    );
  }
);