const express = require("express");

const {
  getAllUsers,
  getUserById,
  updateUserStatus,
  updateUserRole,
  updateProfile,
} = require("../controllers/userController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// Get logged-in user's profile
router.get("/profile", protect, (req, res) => {
  res.json({
    message: "Profile accessed successfully",
    user: req.user,
  });
});

// Update logged-in user's profile
router.put("/profile", protect, updateProfile);

// Get all users - Admin
router.get("/admin/all", protect, adminOnly, getAllUsers);

// Get single user - Admin
router.get("/admin/:id", protect, adminOnly, getUserById);

// Activate / deactivate user - Admin
router.put("/admin/:id/status", protect, adminOnly, updateUserStatus);

// Change user role - Admin
router.put("/admin/:id/role", protect, adminOnly, updateUserRole);

module.exports = router;
