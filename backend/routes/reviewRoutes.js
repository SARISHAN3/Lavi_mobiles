const express = require("express");

const {
  addReview,
  getProductReviews,
  getAllReviews,
  updateReviewApproval,
} = require("../controllers/reviewController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// Get reviews for a product
router.get("/product/:productId", getProductReviews);

// Get all reviews - Admin
router.get("/admin/all", protect, adminOnly, getAllReviews);

// Approve or hide review - Admin
router.put("/admin/:id/approval", protect, adminOnly, updateReviewApproval);

// Add a review
router.post("/", protect, addReview);

module.exports = router;
