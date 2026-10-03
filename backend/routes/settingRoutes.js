const express = require("express");

const {
  getSettings,
  updateSettings,
  resetSettings,
} = require("../controllers/settingController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// =====================================
// ADMIN SETTINGS
// =====================================

router.get("/", protect, adminOnly, getSettings);

router.put("/", protect, adminOnly, updateSettings);

router.post("/reset", protect, adminOnly, resetSettings);

module.exports = router;
