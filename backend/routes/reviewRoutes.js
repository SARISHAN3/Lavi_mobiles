const express = require("express");

const {
  getProductReviews,
  getReviewSummary,
  canReviewProduct,
  createReview,
  updateMyReview,
  deleteMyReview,
  getAllReviews,
  updateReviewStatus,
  deleteReview,
} = require("../controllers/reviewController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// =====================================
// CUSTOMER / PUBLIC ROUTES
// =====================================

// Get reviews for a product
router.get("/product/:productId", getProductReviews);

// Get rating summary for a product
router.get("/product/:productId/summary", getReviewSummary);

// Check whether logged-in customer
// can review a product
router.get("/product/:productId/can-review", protect, canReviewProduct);

// Create review
router.post("/", protect, createReview);

// Update my review
router.put("/:id", protect, updateMyReview);

// Delete my review
router.delete("/:id", protect, deleteMyReview);

// =====================================
// ADMIN ROUTES
// =====================================

// Get all reviews
router.get("/", protect, adminOnly, getAllReviews);

// Approve / disable review
router.put("/:id/status", protect, adminOnly, updateReviewStatus);

// Delete any review
router.delete("/admin/:id", protect, adminOnly, deleteReview);

module.exports = router;
