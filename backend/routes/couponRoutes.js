const express = require("express");

const {
  getCoupons,
  getCouponById,
  createCoupon,
  updateCoupon,
  toggleCouponStatus,
  deleteCoupon,
  validateCoupon,
} = require("../controllers/couponController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// =====================================
// CUSTOMER
// =====================================

// Validate coupon during checkout
router.post("/validate", protect, validateCoupon);

// =====================================
// ADMIN
// =====================================

router.get("/", protect, adminOnly, getCoupons);

router.get("/:id", protect, adminOnly, getCouponById);

router.post("/", protect, adminOnly, createCoupon);

router.put("/:id", protect, adminOnly, updateCoupon);

router.put("/:id/status", protect, adminOnly, toggleCouponStatus);

router.delete("/:id", protect, adminOnly, deleteCoupon);

module.exports = router;
