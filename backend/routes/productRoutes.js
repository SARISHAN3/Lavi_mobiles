const express = require("express");

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// =========================================================
// CUSTOMER PRODUCT ROUTES
// =========================================================

router.get("/", getProducts);

router.get("/:id", getProductById);

// =========================================================
// ADMIN PRODUCT ROUTES
// =========================================================

// Add product with image
router.post("/", protect, adminOnly, upload.array("image", 10), createProduct);

// Update product
router.put(
  "/:id",
  protect,
  adminOnly,
  upload.array("images", 10),
  updateProduct,
);

// Delete product
router.delete("/:id", protect, adminOnly, deleteProduct);

module.exports = router;
