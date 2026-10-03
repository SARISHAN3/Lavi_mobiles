const express = require("express");

const {
  getProductOptions,
  createProductOption,
  updateProductOption,
  toggleProductOptionStatus,
  deleteProductOption,
} = require("../controllers/productOptionController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// =====================================
// GET PRODUCT OPTIONS
// =====================================

// Get active options
// Optional:
// ?type=ram
// ?search=8
// ?includeInactive=true
router.get("/", getProductOptions);

// =====================================
// ADMIN
// =====================================

// Create product option
router.post("/", protect, adminOnly, createProductOption);

// Update product option
router.put("/:id", protect, adminOnly, updateProductOption);

// Activate / deactivate product option
router.put("/:id/status", protect, adminOnly, toggleProductOptionStatus);

// Delete product option
router.delete("/:id", protect, adminOnly, deleteProductOption);

module.exports = router;
