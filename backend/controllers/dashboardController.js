const Product = require("../models/Product");
const User = require("../models/User");
const Order = require("../models/Order");

// =====================================
// GET ADMIN DASHBOARD STATISTICS
// =====================================
const getDashboardStats = async (req, res) => {
  try {
    // ---------------------------------
    // PRODUCT COUNTS
    // ---------------------------------
    const totalProducts = await Product.countDocuments();

    const activeProducts = await Product.countDocuments({
      isActive: true,
    });

    const inactiveProducts = await Product.countDocuments({
      isActive: false,
    });

    const lowStockProducts = await Product.countDocuments({
      isActive: true,
      stock: {
        $gt: 0,
      },
      $expr: {
        $lte: ["$stock", "$lowStockLimit"],
      },
    });

    const outOfStockProducts = await Product.countDocuments({
      isActive: true,
      stock: 0,
    });

    // ---------------------------------
    // USER COUNTS
    // ---------------------------------
    const totalUsers = await User.countDocuments();

    const activeUsers = await User.countDocuments({
      isActive: true,
    });

    const inactiveUsers = await User.countDocuments({
      isActive: false,
    });

    const totalCustomers = await User.countDocuments({
      role: "customer",
    });

    // ---------------------------------
    // ORDER COUNTS
    // ---------------------------------
    const totalOrders = await Order.countDocuments();

    const pendingOrders = await Order.countDocuments({
      orderStatus: "Pending",
    });

    const confirmedOrders = await Order.countDocuments({
      orderStatus: "Confirmed",
    });

    const processingOrders = await Order.countDocuments({
      orderStatus: "Processing",
    });

    const shippedOrders = await Order.countDocuments({
      orderStatus: "Shipped",
    });

    const deliveredOrders = await Order.countDocuments({
      orderStatus: "Delivered",
    });

    const cancelledOrders = await Order.countDocuments({
      orderStatus: "Cancelled",
    });

    // ---------------------------------
    // REVENUE
    // ---------------------------------
    const revenueResult = await Order.aggregate([
      {
        $match: {
          orderStatus: {
            $ne: "Cancelled",
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

    // ---------------------------------
    // DELIVERED REVENUE
    // ---------------------------------
    const deliveredRevenueResult = await Order.aggregate([
      {
        $match: {
          orderStatus: "Delivered",
        },
      },
      {
        $group: {
          _id: null,
          revenue: {
            $sum: "$totalAmount",
          },
        },
      },
    ]);

    const deliveredRevenue =
      deliveredRevenueResult.length > 0 ? deliveredRevenueResult[0].revenue : 0;

    // ---------------------------------
    // TODAY'S ORDERS
    // ---------------------------------
    const startOfToday = new Date();

    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();

    endOfToday.setHours(23, 59, 59, 999);

    const todayOrders = await Order.countDocuments({
      createdAt: {
        $gte: startOfToday,
        $lte: endOfToday,
      },
    });

    // ---------------------------------
    // TODAY'S REVENUE
    // ---------------------------------
    const todayRevenueResult = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfToday,
            $lte: endOfToday,
          },
          orderStatus: {
            $ne: "Cancelled",
          },
        },
      },
      {
        $group: {
          _id: null,
          revenue: {
            $sum: "$totalAmount",
          },
        },
      },
    ]);

    const todayRevenue =
      todayRevenueResult.length > 0 ? todayRevenueResult[0].revenue : 0;

    // ---------------------------------
    // RECENT ORDERS
    // ---------------------------------
    const recentOrders = await Order.find()
      .populate("user", "name email phone")
      .sort({
        createdAt: -1,
      })
      .limit(5)
      .select("user items totalAmount orderStatus paymentStatus createdAt");

    // ---------------------------------
    // LOW STOCK PRODUCTS
    // ---------------------------------
    const lowStockProductList = await Product.find({
      isActive: true,
      stock: {
        $gt: 0,
      },
      $expr: {
        $lte: ["$stock", "$lowStockLimit"],
      },
    })
      .sort({
        stock: 1,
      })
      .limit(5)
      .select("name brand price stock lowStockLimit images");

    // ---------------------------------
    // RECENT PRODUCTS
    // ---------------------------------
    const recentProducts = await Product.find()
      .sort({
        createdAt: -1,
      })
      .limit(5)
      .select("name brand price stock images isActive createdAt");

    // ---------------------------------
    // RESPONSE
    // ---------------------------------
    res.json({
      success: true,

      stats: {
        products: {
          total: totalProducts,
          active: activeProducts,
          inactive: inactiveProducts,
          lowStock: lowStockProducts,
          outOfStock: outOfStockProducts,
        },

        users: {
          total: totalUsers,
          customers: totalCustomers,
          active: activeUsers,
          inactive: inactiveUsers,
        },

        orders: {
          total: totalOrders,
          pending: pendingOrders,
          confirmed: confirmedOrders,
          processing: processingOrders,
          shipped: shippedOrders,
          delivered: deliveredOrders,
          cancelled: cancelledOrders,
          today: todayOrders,
        },

        revenue: {
          total: totalRevenue,
          delivered: deliveredRevenue,
          today: todayRevenue,
        },
      },

      recentOrders,

      lowStockProducts: lowStockProductList,

      recentProducts,
    });
  } catch (error) {
    console.error("Dashboard statistics error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load dashboard statistics",
      error: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
};
