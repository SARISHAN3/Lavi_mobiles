const mongoose = require("mongoose");

const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Coupon = require("../models/Coupon");

// =====================================
// CREATE ORDER
// =====================================
const createOrder = async (req, res) => {
  try {
    const {
      shippingAddress,
      paymentMethod = "COD",
      couponCode = "",
      notes = "",
    } = req.body;

    // -----------------------------
    // Validate shipping address
    // -----------------------------
    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        message: "Shipping address is required",
      });
    }

    const requiredAddressFields = [
      "name",
      "phone",
      "street",
      "city",
      "state",
      "pincode",
    ];

    for (const field of requiredAddressFields) {
      if (!shippingAddress[field] || !String(shippingAddress[field]).trim()) {
        return res.status(400).json({
          success: false,
          message: `${field} is required`,
        });
      }
    }

    // -----------------------------
    // Validate payment method
    // -----------------------------
    if (!["COD", "RAZORPAY"].includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment method",
      });
    }

    // Razorpay structure is supported,
    // but actual payment integration comes later.
    if (paymentMethod === "RAZORPAY") {
      return res.status(400).json({
        success: false,
        message:
          "Razorpay payment is not available yet. Please use Cash on Delivery.",
      });
    }

    // -----------------------------
    // Get user's cart
    // -----------------------------
    const cart = await Cart.findOne({
      user: req.user._id,
    }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty",
      });
    }

    // -----------------------------
    // Validate cart products
    // -----------------------------
    const validItems = [];

    for (const item of cart.items) {
      const product = item.product;

      if (!product) {
        return res.status(400).json({
          success: false,
          message: "One of the products in your cart no longer exists",
        });
      }

      if (!product.isActive) {
        return res.status(400).json({
          success: false,
          message: `${product.name} is currently unavailable`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stock} item(s) of ${product.name} are available`,
        });
      }

      validItems.push({
        product: product._id,
        name: product.name,
        image:
          product.images && product.images.length > 0 ? product.images[0] : "",
        price: product.price,
        quantity: item.quantity,
      });
    }

    // -----------------------------
    // Calculate subtotal
    // -----------------------------
    const subtotal = validItems.reduce(
      (total, item) => total + Number(item.price) * Number(item.quantity),
      0,
    );

    // -----------------------------
    // Validate coupon
    // -----------------------------
    let coupon = null;
    let discountAmount = 0;
    let normalizedCouponCode = "";

    if (couponCode && couponCode.trim()) {
      normalizedCouponCode = couponCode.trim().toUpperCase();

      coupon = await Coupon.findOne({
        code: normalizedCouponCode,
      });

      if (!coupon) {
        return res.status(400).json({
          success: false,
          message: "Invalid coupon code",
        });
      }

      const now = new Date();

      if (!coupon.isActive) {
        return res.status(400).json({
          success: false,
          message: "This coupon is inactive",
        });
      }

      if (now < coupon.startDate) {
        return res.status(400).json({
          success: false,
          message: "This coupon is not active yet",
        });
      }

      if (now > coupon.expiryDate) {
        return res.status(400).json({
          success: false,
          message: "This coupon has expired",
        });
      }

      if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
        return res.status(400).json({
          success: false,
          message: "This coupon usage limit has been reached",
        });
      }

      if (subtotal < coupon.minimumOrderAmount) {
        return res.status(400).json({
          success: false,
          message: `Minimum order amount for this coupon is ₹${coupon.minimumOrderAmount}`,
        });
      }

      if (coupon.discountType === "percentage") {
        discountAmount = (subtotal * coupon.discountValue) / 100;

        if (
          coupon.maximumDiscountAmount > 0 &&
          discountAmount > coupon.maximumDiscountAmount
        ) {
          discountAmount = coupon.maximumDiscountAmount;
        }
      } else if (coupon.discountType === "fixed") {
        discountAmount = coupon.discountValue;
      }

      // Discount cannot exceed subtotal.
      if (discountAmount > subtotal) {
        discountAmount = subtotal;
      }
    }

    // -----------------------------
    // Shipping
    // -----------------------------
    // Free shipping for now.
    // Can be changed later based on
    // admin settings/order amount.
    const shippingAmount = 0;

    const totalAmount = subtotal - discountAmount + shippingAmount;

    // -----------------------------
    // Create order
    // -----------------------------
    const order = await Order.create({
      user: req.user._id,

      items: validItems,

      shippingAddress: {
        name: shippingAddress.name.trim(),
        phone: shippingAddress.phone.trim(),
        street: shippingAddress.street.trim(),
        city: shippingAddress.city.trim(),
        state: shippingAddress.state.trim(),
        pincode: shippingAddress.pincode.trim(),
      },

      paymentMethod: "COD",
      paymentStatus: "Pending",
      orderStatus: "Pending",

      subtotal,
      discountAmount,
      shippingAmount,
      totalAmount,

      couponCode: normalizedCouponCode,
      couponId: coupon ? coupon._id : null,

      notes: notes ? notes.trim() : "",
    });

    // -----------------------------
    // Reduce product stock
    // -----------------------------
    for (const item of validItems) {
      const updatedProduct = await Product.findOneAndUpdate(
        {
          _id: item.product,
          stock: {
            $gte: item.quantity,
          },
        },
        {
          $inc: {
            stock: -item.quantity,
          },
        },
        {
          new: true,
        },
      );

      if (!updatedProduct) {
        // This normally means stock changed
        // between validation and update.
        return res.status(400).json({
          success: false,
          message: "Stock changed while placing the order. Please try again.",
        });
      }
    }

    // -----------------------------
    // Update coupon usage
    // -----------------------------
    if (coupon) {
      await Coupon.findByIdAndUpdate(coupon._id, {
        $inc: {
          usedCount: 1,
        },
      });
    }

    // -----------------------------
    // Clear cart
    // -----------------------------
    cart.items = [];
    cart.totalAmount = 0;

    await cart.save();

    // -----------------------------
    // Populate order
    // -----------------------------
    const populatedOrder = await Order.findById(order._id)
      .populate({
        path: "user",
        select: "name email phone",
      })
      .populate({
        path: "items.product",
        select: "name brand model price mrp images stock",
      });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: populatedOrder,
    });
  } catch (error) {
    console.error("Create order error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to place order",
      error: error.message,
    });
  }
};

// =====================================
// GET MY ORDERS
// =====================================
const getMyOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status = "" } = req.query;

    const currentPage = Math.max(Number(page), 1);

    const itemsPerPage = Math.min(Math.max(Number(limit), 1), 50);

    const filter = {
      user: req.user._id,
    };

    if (status) {
      const allowedStatuses = [
        "Pending",
        "Confirmed",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
      ];

      if (allowedStatuses.includes(status)) {
        filter.orderStatus = status;
      }
    }

    const totalOrders = await Order.countDocuments(filter);

    const orders = await Order.find(filter)
      .populate({
        path: "items.product",
        select: "name brand model price mrp images",
      })
      .sort({
        createdAt: -1,
      })
      .skip((currentPage - 1) * itemsPerPage)
      .limit(itemsPerPage);

    res.json({
      success: true,
      orders,
      pagination: {
        currentPage,
        totalPages: Math.ceil(totalOrders / itemsPerPage),
        totalOrders,
        limit: itemsPerPage,
      },
    });
  } catch (error) {
    console.error("Get my orders error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load your orders",
      error: error.message,
    });
  }
};

// =====================================
// GET MY ORDER BY ID
// =====================================
const getMyOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const order = await Order.findOne({
      _id: id,
      user: req.user._id,
    })
      .populate({
        path: "items.product",
        select: "name brand model price mrp images stock",
      })
      .populate({
        path: "user",
        select: "name email phone",
      });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Get my order error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load order",
      error: error.message,
    });
  }
};

// =====================================
// CANCEL MY ORDER
// =====================================
const cancelMyOrder = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const order = await Order.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const cancellableStatuses = ["Pending", "Confirmed"];

    if (!cancellableStatuses.includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: "This order can no longer be cancelled",
      });
    }

    order.orderStatus = "Cancelled";

    await order.save();

    // Restore stock.
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: {
          stock: item.quantity,
        },
      });
    }

    // Restore coupon usage.
    if (order.couponId) {
      await Coupon.findByIdAndUpdate(order.couponId, {
        $inc: {
          usedCount: -1,
        },
      });
    }

    const updatedOrder = await Order.findById(order._id)
      .populate({
        path: "items.product",
        select: "name brand model price mrp images stock",
      })
      .populate({
        path: "user",
        select: "name email phone",
      });

    res.json({
      success: true,
      message: "Order cancelled successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Cancel order error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to cancel order",
      error: error.message,
    });
  }
};

// =====================================
// GET ALL ORDERS - ADMIN
// =====================================
const getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", status = "" } = req.query;

    const currentPage = Math.max(Number(page), 1);

    const itemsPerPage = Math.min(Math.max(Number(limit), 1), 100);

    const filter = {};

    if (status) {
      const allowedStatuses = [
        "Pending",
        "Confirmed",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
      ];

      if (allowedStatuses.includes(status)) {
        filter.orderStatus = status;
      }
    }

    if (search.trim()) {
      const users = await require("../models/User")
        .find({
          $or: [
            {
              name: {
                $regex: search.trim(),
                $options: "i",
              },
            },
            {
              email: {
                $regex: search.trim(),
                $options: "i",
              },
            },
            {
              phone: {
                $regex: search.trim(),
                $options: "i",
              },
            },
          ],
        })
        .select("_id");

      filter.user = {
        $in: users.map((user) => user._id),
      };
    }

    const totalOrders = await Order.countDocuments(filter);

    const orders = await Order.find(filter)
      .populate({
        path: "user",
        select: "name email phone",
      })
      .populate({
        path: "items.product",
        select: "name brand model price mrp images",
      })
      .sort({
        createdAt: -1,
      })
      .skip((currentPage - 1) * itemsPerPage)
      .limit(itemsPerPage);

    res.json({
      success: true,
      orders,
      pagination: {
        currentPage,
        totalPages: Math.ceil(totalOrders / itemsPerPage),
        totalOrders,
        limit: itemsPerPage,
      },
    });
  } catch (error) {
    console.error("Get all orders error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load orders",
      error: error.message,
    });
  }
};

// =====================================
// GET ORDER BY ID - ADMIN
// =====================================
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const order = await Order.findById(id)
      .populate({
        path: "user",
        select: "name email phone addresses",
      })
      .populate({
        path: "items.product",
        select: "name brand model price mrp images stock",
      })
      .populate({
        path: "couponId",
        select: "code discountType discountValue",
      });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Get order by ID error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load order",
      error: error.message,
    });
  }
};

// =====================================
// UPDATE ORDER STATUS - ADMIN
// =====================================
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "Confirmed",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const previousStatus = order.orderStatus;

    // Prevent changing a cancelled order.
    if (previousStatus === "Cancelled" && status !== "Cancelled") {
      return res.status(400).json({
        success: false,
        message: "A cancelled order cannot be reopened",
      });
    }

    // Prevent changing a delivered order.
    if (previousStatus === "Delivered" && status !== "Delivered") {
      return res.status(400).json({
        success: false,
        message: "A delivered order cannot be changed",
      });
    }

    order.orderStatus = status;

    if (status === "Delivered") {
      order.paymentStatus =
        order.paymentMethod === "COD" ? "Paid" : order.paymentStatus;
    }

    await order.save();

    // If admin cancels an order,
    // restore product stock.
    if (status === "Cancelled" && previousStatus !== "Cancelled") {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: {
            stock: item.quantity,
          },
        });
      }

      if (order.couponId) {
        await Coupon.findByIdAndUpdate(order.couponId, {
          $inc: {
            usedCount: -1,
          },
        });
      }
    }

    // If a cancelled order is somehow
    // changed back, stock restoration
    // is intentionally blocked above.
    const updatedOrder = await Order.findById(order._id)
      .populate({
        path: "user",
        select: "name email phone",
      })
      .populate({
        path: "items.product",
        select: "name brand model price mrp images stock",
      });

    res.json({
      success: true,
      message: "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Update order status error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update order status",
      error: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getMyOrderById,
  cancelMyOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
};
