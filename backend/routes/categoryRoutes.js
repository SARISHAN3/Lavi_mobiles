const express = require("express");

const {
  getCategories,
  getActiveCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  toggleCategoryStatus,
  deleteCategory,
} = require("../controllers/categoryController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// =====================================
// CUSTOMER
// =====================================

// Get only active categories
router.get("/active", getActiveCategories);

// =====================================
// ADMIN / GENERAL
// =====================================

// Get categories with search, status and pagination
router.get("/", getCategories);

// Get single category
router.get("/:id", getCategoryById);

// =====================================
// ADMIN
// =====================================

// Create category
router.post("/", protect, adminOnly, createCategory);

// Update category
router.put("/:id", protect, adminOnly, updateCategory);

// Activate / deactivate category
router.put("/:id/status", protect, adminOnly, toggleCategoryStatus);

// Delete category
router.delete("/:id", protect, adminOnly, deleteCategory);

module.exports = router;
