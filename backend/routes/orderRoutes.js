const express = require("express");

const {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/orderController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// Get logged-in user's orders
router.get("/my-orders", protect, getMyOrders);

// Get all orders - Admin
router.get("/admin/all", protect, adminOnly, getAllOrders);

// Update order status - Admin
router.put("/admin/:id/status", protect, adminOnly, updateOrderStatus);

// Get single order
router.get("/:id", protect, getOrderById);

// Cancel order
router.put("/:id/cancel", protect, cancelOrder);

// Create order
router.post("/", protect, createOrder);

module.exports = router;
