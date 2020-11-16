const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const stripe = require("stripe")(
  "sk_test_51HnhmzLy3a6p9zZudVHI30hOQeysuHDS4SWCB7AUftFFMNNghKoBAjGQIlb5putAKbq03t0JqoNcCsAHTqz4pROj00tCm8oOVJ"
);

// API

// API COnfig
const app = express();

// Middlewares
app.use(cors({ origin: true }));
app.use(express.json());

// API routes
app.get("/", (request, response) => response.status(200).send("hello world"));

app.post("/payments/create", async (request, response) => {
  const total = request.query.total;

  console.log("Payment request recieved BOOM!!", total);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: total,
    currency: "inr",
  });

  // OK - Created
  response.status(201).send({
    clientSecret: paymentIntent.client_secret,
  });
});

// Listen
exports.api = functions.https.onRequest(app);

// Example API endpoint
//  http://localhost:5001/clone-a07e8/us-central1/api
