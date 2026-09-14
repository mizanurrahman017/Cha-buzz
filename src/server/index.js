import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

// ===============================
// Middleware
// ===============================

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===============================
// Test Route
// ===============================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Cha Buzz payment server is running!",
  });
});

// ===============================
// SSLCommerz Payment Create
// ===============================

app.post("/api/payment/create", async (req, res) => {
  try {
    const {
      customer,
      items,
      subtotal,
      deliveryFee,
      total,
      orderId,
    } = req.body;

    // ===============================
    // Basic Validation
    // ===============================

    if (!customer?.name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Customer name is required.",
      });
    }

    if (!customer?.phone?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Customer phone is required.",
      });
    }

    if (!customer?.address?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Customer address is required.",
      });
    }

    // SSLCommerz postcode requirement
    if (!customer?.postcode?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Customer postcode is required.",
      });
    }

    if (
      !items ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty.",
      });
    }

    if (!total || Number(total) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment amount.",
      });
    }

    // ===============================
    // Generate Transaction ID
    // ===============================

    const tranId =
      orderId ||
      `CHA-BUZZ-${Date.now()}-${Math.floor(
        Math.random() * 10000
      )}`;

    // ===============================
    // SSLCommerz Sandbox API
    // ===============================

    const sslcommerzUrl =
      "https://sandbox-gw.sslcommerz.com/gwprocess/v4/api.php";

    // ===============================
    // Customer Values
    // ===============================

    const customerName = customer.name.trim();

    const customerPhone = customer.phone.trim();

    const customerEmail =
      customer.email?.trim() ||
      "customer@chabuzz.com";

    const customerAddress =
      customer.address.trim();

    const customerPostcode =
      customer.postcode.trim();

    // ===============================
    // Payment Data
    // ===============================

    const paymentData = {
      // ===============================
      // Store Credentials
      // ===============================

      store_id:
        process.env.SSLCOMMERZ_STORE_ID,

      store_passwd:
        process.env.SSLCOMMERZ_STORE_PASSWORD,

      // ===============================
      // Payment Amount
      // ===============================

      total_amount:
        Number(total).toFixed(2),

      currency: "BDT",

      // ===============================
      // Transaction ID
      // ===============================

      tran_id: tranId,

      // ===============================
      // Gateway Selection
      // ===============================

      // Only request bKash and Nagad
      multi_card_name: "bkash,nagad",

      // ===============================
      // Callback URLs
      // ===============================

      success_url:
        "http://localhost:5000/api/payment/success",

      fail_url:
        "http://localhost:5000/api/payment/fail",

      cancel_url:
        "http://localhost:5000/api/payment/cancel",

      ipn_url:
        "http://localhost:5000/api/payment/ipn",

      // ===============================
      // Customer Information
      // ===============================

      cus_name: customerName,

      cus_email: customerEmail,

      cus_phone: customerPhone,

      cus_add1: customerAddress,

      cus_city: "Sylhet",

      cus_postcode: customerPostcode,

      cus_country: "Bangladesh",

      // ===============================
      // Product Information
      // ===============================

      product_name:
        items.length === 1
          ? items[0].name
          : `Cha Buzz Order (${items.length} items)`,

      product_category: "Food",

      product_profile: "general",

      // Total number of food items
      num_of_item: items.reduce(
        (totalItems, item) =>
          totalItems +
          Number(item.quantity || 0),
        0
      ),

      // ===============================
      // Shipping Information
      // ===============================

      shipping_method: "YES",

      ship_name: customerName,

      ship_add1: customerAddress,

      ship_city: "Sylhet",

      ship_postcode: customerPostcode,

      ship_country: "Bangladesh",

      // ===============================
      // Optional Values
      // ===============================

      value_a: tranId,

      value_b: "cha-buzz",

      value_c: customerPostcode,
    };

    // ===============================
    // Debug Information
    // ===============================

    console.log(
      "================================="
    );

    console.log(
      "Creating SSLCommerz payment..."
    );

    console.log({
      tran_id: tranId,

      total_amount:
        paymentData.total_amount,

      customer: customerName,

      phone: customerPhone,

      postcode: customerPostcode,

      items: items.length,

      payment_gateways:
        paymentData.multi_card_name,
    });

    console.log(
      "================================="
    );

    // ===============================
    // Send Request to SSLCommerz
    // ===============================

    const response = await axios.post(
      sslcommerzUrl,
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

    const data = response.data;

    // ===============================
    // SSLCommerz Response
    // ===============================

    console.log(
      "SSLCommerz Response:",
      data
    );

    // ===============================
    // Check Gateway URL
    // ===============================

    if (!data?.GatewayPageURL) {
      return res.status(400).json({
        success: false,

        message:
          data?.failedreason ||
          "Unable to create SSLCommerz payment session.",

        sslcommerzResponse: data,
      });
    }

    // ===============================
    // Send Gateway URL to Frontend
    // ===============================

    return res.status(200).json({
      success: true,

      message:
        "Payment session created successfully.",

      tranId,

      gatewayPageURL:
        data.GatewayPageURL,

      sessionKey:
        data.sessionkey || null,
    });
  } catch (error) {
    console.error(
      "================================="
    );

    console.error(
      "SSLCommerz payment error:"
    );

    console.error(
      error.response?.data ||
        error.message
    );

    console.error(
      "================================="
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
});

// ===============================
// Payment Success
// ===============================

app.post(
  "/api/payment/success",
  (req, res) => {
    console.log(
      "================================="
    );

    console.log("Payment Success:");

    console.log(req.body);

    console.log(
      "================================="
    );

    res.send(`
      <html>

        <head>
          <title>Payment Successful</title>

          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
        </head>

        <body
          style="
            font-family: Arial, sans-serif;
            text-align: center;
            padding: 100px 20px;
            background: #F7F5EF;
            color: #252525;
          "
        >

          <div
            style="
              max-width: 500px;
              margin: auto;
              background: white;
              padding: 40px 25px;
              border-radius: 20px;
              box-shadow:
                0 5px 25px
                rgba(0,0,0,0.08);
            "
          >

            <h1 style="color: green;">
              Payment Successful
            </h1>

            <p>
              Your Cha Buzz payment was successful.
            </p>

            <p>
              Please wait while your order
              is being confirmed.
            </p>

          </div>

        </body>

      </html>
    `);
  }
);

// ===============================
// Payment Failed
// ===============================

app.post(
  "/api/payment/fail",
  (req, res) => {
    console.log(
      "================================="
    );

    console.log("Payment Failed:");

    console.log(req.body);

    console.log(
      "================================="
    );

    res.send(`
      <html>

        <head>
          <title>Payment Failed</title>

          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
        </head>

        <body
          style="
            font-family: Arial, sans-serif;
            text-align: center;
            padding: 100px 20px;
            background: #F7F5EF;
            color: #252525;
          "
        >

          <div
            style="
              max-width: 500px;
              margin: auto;
              background: white;
              padding: 40px 25px;
              border-radius: 20px;
              box-shadow:
                0 5px 25px
                rgba(0,0,0,0.08);
            "
          >

            <h1 style="color: red;">
              Payment Failed
            </h1>

            <p>
              Your payment could not be completed.
            </p>

            <p>
              Please try again.
            </p>

          </div>

        </body>

      </html>
    `);
  }
);

// ===============================
// Payment Cancelled
// ===============================

app.post(
  "/api/payment/cancel",
  (req, res) => {
    console.log(
      "================================="
    );

    console.log("Payment Cancelled:");

    console.log(req.body);

    console.log(
      "================================="
    );

    res.send(`
      <html>

        <head>
          <title>Payment Cancelled</title>

          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
        </head>

        <body
          style="
            font-family: Arial, sans-serif;
            text-align: center;
            padding: 100px 20px;
            background: #F7F5EF;
            color: #252525;
          "
        >

          <div
            style="
              max-width: 500px;
              margin: auto;
              background: white;
              padding: 40px 25px;
              border-radius: 20px;
              box-shadow:
                0 5px 25px
                rgba(0,0,0,0.08);
            "
          >

            <h1>
              Payment Cancelled
            </h1>

            <p>
              You cancelled the payment.
            </p>

            <p>
              You can return to Cha Buzz
              and try again.
            </p>

          </div>

        </body>

      </html>
    `);
  }
);

// ===============================
// SSLCommerz IPN
// ===============================

app.post(
  "/api/payment/ipn",
  (req, res) => {
    console.log(
      "================================="
    );

    console.log(
      "SSLCommerz IPN received:"
    );

    console.log(req.body);

    console.log(
      "================================="
    );

    res.status(200).json({
      success: true,

      message:
        "IPN received.",
    });
  }
);

// ===============================
// Start Server
// ===============================

app.listen(PORT, () => {
  console.log(
    `Cha Buzz server running on port ${PORT}`
  );
});