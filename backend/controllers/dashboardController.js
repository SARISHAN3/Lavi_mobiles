const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Category = require("../models/Category");
const Brand = require("../models/Brand");

const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const totalProducts = await Product.countDocuments({
      isActive: true,
    });

    const totalOrders = await Order.countDocuments();

    const totalCategories = await Category.countDocuments({
      isActive: true,
    });

    const totalBrands = await Brand.countDocuments({
      isActive: true,
    });

    const revenueResult = await Order.aggregate([
      {
        $match: {
          orderStatus: {
            $ne: "Cancelled",
          },
          paymentStatus: {
            $in: ["Paid", "Pending"],
          },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$totalAmount",
          },
        },
      },
    ]);

    const totalRevenue =
      revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalCategories,
      totalBrands,
      totalRevenue,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error.message);

    res.status(500).json({
      message: "Failed to get dashboard statistics",
    });
  }
};

module.exports = {
  getDashboardStats,
};
