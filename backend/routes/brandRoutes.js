const express = require("express");

const {
  getBrands,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand,
} = require("../controllers/brandController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const uploadBrandLogo = require("../middleware/brandUploadMiddleware");

const router = express.Router();

// Get all brands
router.get("/", getBrands);

// Get single brand
router.get("/:id", getBrandById);

// Create brand
router.post(
  "/",
  protect,
  adminOnly,
  uploadBrandLogo.single("logo"),
  createBrand,
);

// Update brand
router.put(
  "/:id",
  protect,
  adminOnly,
  uploadBrandLogo.single("logo"),
  updateBrand,
);

// Delete brand
router.delete("/:id", protect, adminOnly, deleteBrand);

module.exports = router;
