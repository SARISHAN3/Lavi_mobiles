const express = require("express");

const { getDashboardStats } = require("../controllers/dashboardController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// =====================================
// ADMIN DASHBOARD
// =====================================

router.get("/stats", protect, adminOnly, getDashboardStats);

module.exports = router;
