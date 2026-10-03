const express = require("express");

const {
  createOrder,
  getMyOrders,
  getMyOrderById,
  cancelMyOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
} = require("../controllers/orderController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// =====================================
// CUSTOMER ROUTES
// =====================================

// Create a new order
router.post("/", protect, createOrder);

// Get logged-in user's orders
router.get("/my-orders", protect, getMyOrders);

// Get logged-in user's single order
router.get("/my-orders/:id", protect, getMyOrderById);

// Cancel logged-in user's order
router.put("/my-orders/:id/cancel", protect, cancelMyOrder);

// =====================================
// ADMIN ROUTES
// =====================================

// Get all orders
router.get("/", protect, adminOnly, getAllOrders);

// Get single order
router.get("/:id", protect, adminOnly, getOrderById);

// Update order status
router.put("/:id/status", protect, adminOnly, updateOrderStatus);

module.exports = router;
