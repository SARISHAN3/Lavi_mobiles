const express = require("express");

const {
  getProfile,
  updateProfile,
  changePassword,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  getAllUsers,
  updateUserStatus,
  updateUserRole,
} = require("../controllers/userController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// =====================================
// CUSTOMER PROFILE
// =====================================

// Get current user's profile
router.get("/profile", protect, getProfile);

// Update current user's profile
router.put("/profile", protect, updateProfile);

// Change password
router.put("/change-password", protect, changePassword);

// =====================================
// CUSTOMER ADDRESSES
// =====================================

// Add new address
router.post("/addresses", protect, addAddress);

// Update address
router.put("/addresses/:addressId", protect, updateAddress);

// Delete address
router.delete("/addresses/:addressId", protect, deleteAddress);

// Set default address
router.put("/addresses/:addressId/default", protect, setDefaultAddress);

// =====================================
// ADMIN USER MANAGEMENT
// =====================================

// Get all users
router.get("/", protect, adminOnly, getAllUsers);

// Activate / deactivate user
router.put("/:id/status", protect, adminOnly, updateUserStatus);

// Change user role
router.put("/:id/role", protect, adminOnly, updateUserRole);

module.exports = router;
