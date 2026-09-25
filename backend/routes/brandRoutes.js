const express = require("express");

const {
  getBrands,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand,
} = require("../controllers/brandController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.get("/", getBrands);
router.get("/:id", getBrandById);

// Admin routes
router.post("/", protect, adminOnly, createBrand);
router.put("/:id", protect, adminOnly, updateBrand);
router.delete("/:id", protect, adminOnly, deleteBrand);

module.exports = router;
