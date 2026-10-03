const express = require("express");

const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  toggleWishlist,
  clearWishlist,
} = require("../controllers/wishlistController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Get current user's wishlist
router.get("/", protect, getWishlist);

// Add product to wishlist
router.post("/", protect, addToWishlist);

// Toggle product in wishlist
router.post("/toggle", protect, toggleWishlist);

// Remove product from wishlist
router.delete("/:productId", protect, removeFromWishlist);

// Clear entire wishlist
router.delete("/", protect, clearWishlist);

module.exports = router;
