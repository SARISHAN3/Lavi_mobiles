const express = require("express");

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  toggleProductStatus,
  deleteProduct,
  getFeaturedProducts,
  updateProductStock,
} = require("../controllers/productController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// =====================================
// CUSTOMER / GENERAL
// =====================================

// Get products
//
// Examples:
// /api/products
// /api/products?search=iPhone
// /api/products?brand=Apple
// /api/products?category=Smart%20Watches
// /api/products?minPrice=10000&maxPrice=50000
// /api/products?sort=price-low
// /api/products?page=2&limit=12
router.get("/", getProducts);

// Get featured products
router.get("/featured", getFeaturedProducts);

// Get single product
router.get("/:id", getProductById);

// =====================================
// ADMIN
// =====================================

// Create product with images
router.post("/", protect, adminOnly, upload.array("images", 10), createProduct);

// Update product with images
router.put(
  "/:id",
  protect,
  adminOnly,
  upload.array("images", 10),
  updateProduct,
);

// Activate / deactivate product
router.put("/:id/status", protect, adminOnly, toggleProductStatus);

// Update stock
router.put("/:id/stock", protect, adminOnly, updateProductStock);

// Delete product
router.delete("/:id", protect, adminOnly, deleteProduct);

module.exports = router;
