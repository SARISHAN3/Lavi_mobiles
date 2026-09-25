const express = require("express");

const {
  createCoupon,
  getAllCoupons,
  updateCoupon,
  validateCoupon,
} = require("../controllers/couponController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// Get all coupons - Admin
router.get("/admin/all", protect, adminOnly, getAllCoupons);

// Create coupon - Admin
router.post("/", protect, adminOnly, createCoupon);

// Update coupon - Admin
router.put("/:id", protect, adminOnly, updateCoupon);

// Validate coupon - Customer
router.post("/validate", protect, validateCoupon);

module.exports = router;
