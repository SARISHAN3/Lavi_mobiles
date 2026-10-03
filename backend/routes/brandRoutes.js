const express = require("express");

const {
  getBrands,
  getActiveBrands,
  getBrandById,
  createBrand,
  updateBrand,
  toggleBrandStatus,
  deleteBrand,
} = require("../controllers/brandController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// =====================================
// CUSTOMER
// =====================================

// Get only active brands
router.get("/active", getActiveBrands);

// =====================================
// GENERAL
// =====================================

// Get brands with search, status and pagination
router.get("/", getBrands);

// Get single brand
router.get("/:id", getBrandById);

// =====================================
// ADMIN
// =====================================

// Create brand
router.post("/", protect, adminOnly, createBrand);

// Update brand
router.put("/:id", protect, adminOnly, updateBrand);

// Activate / deactivate brand
router.put("/:id/status", protect, adminOnly, toggleBrandStatus);

// Delete brand
router.delete("/:id", protect, adminOnly, deleteBrand);

module.exports = router;
