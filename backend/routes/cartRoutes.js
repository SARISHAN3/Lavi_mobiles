const express = require("express");

const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} = require("../controllers/cartController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Get current user's cart
router.get("/", protect, getCart);

// Add product to cart
router.post("/", protect, addToCart);

// Update cart item quantity
router.put("/:itemId", protect, updateCartItem);

// Remove product from cart
router.delete("/:itemId", protect, removeCartItem);

// Clear entire cart
router.delete("/", protect, clearCart);

module.exports = router;
