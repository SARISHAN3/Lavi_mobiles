const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const brandRoutes = require("./routes/brandRoutes");
const productOptionRoutes = require("./routes/productOptionRoutes");
const cartRoutes = require("./routes/cartRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const orderRoutes = require("./routes/orderRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const couponRoutes = require("./routes/couponRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const settingRoutes = require("./routes/settingRoutes");

const app = express();

// =========================================================
// DATABASE
// =========================================================

connectDB();

// =========================================================
// MIDDLEWARE
// =========================================================

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =========================================================
// STATIC FILES
// =========================================================

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// =========================================================
// API ROUTES
// =========================================================

app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);

app.use("/api/products", productRoutes);

app.use("/api/categories", categoryRoutes);

app.use("/api/brands", brandRoutes);

app.use("/api/product-options", productOptionRoutes);

app.use("/api/cart", cartRoutes);

app.use("/api/wishlist", wishlistRoutes);

app.use("/api/orders", orderRoutes);

app.use("/api/reviews", reviewRoutes);

app.use("/api/coupons", couponRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/settings", settingRoutes);

// =========================================================
// API HOME
// =========================================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Lavi Mobile API is running",
  });
});

// =========================================================
// 404 HANDLER
// =========================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
  });
});

// =========================================================
// GLOBAL ERROR HANDLER
// =========================================================

app.use((error, req, res, next) => {
  console.error("Server error:", error);

  res.status(error.status || 500).json({
    success: false,
    message: error.message || "Internal server error",
  });
});

// =========================================================
// SERVER
// =========================================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("----------------------------------------");
  console.log("       LAVI MOBILE API SERVER");
  console.log("----------------------------------------");
  console.log(`Server running on: http://localhost:${PORT}`);
  console.log("----------------------------------------");
});
