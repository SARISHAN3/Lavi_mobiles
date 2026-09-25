const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Coupon = require("../models/Coupon");

// Create order from cart
const createOrder = async (req, res) => {
  try {
    const {
      shippingAddress = {},
      paymentMethod = "COD",
      couponCode = "",
    } = req.body;

    const { name, phone, street, city, state, pincode } = shippingAddress;

    // Validate shipping address
    if (!name || !phone || !street || !city || !state || !pincode) {
      return res.status(400).json({
        message: "Complete shipping address is required",
      });
    }

    // Only COD for now
    if (paymentMethod !== "COD") {
      return res.status(400).json({
        message: "Only Cash on Delivery is available currently",
      });
    }

    let appliedCoupon = null;
    let discountAmount = 0;

    if (couponCode) {
      appliedCoupon = await Coupon.findOne({
        code: couponCode.toUpperCase(),
        isActive: true,
      });

      if (!appliedCoupon) {
        return res.status(400).json({
          message: "Invalid or inactive coupon",
        });
      }

      const currentDate = new Date();

      if (currentDate < appliedCoupon.startDate) {
        return res.status(400).json({
          message: "This coupon is not active yet",
        });
      }

      if (currentDate > appliedCoupon.expiryDate) {
        return res.status(400).json({
          message: "This coupon has expired",
        });
      }

      if (
        appliedCoupon.usageLimit > 0 &&
        appliedCoupon.usedCount >= appliedCoupon.usageLimit
      ) {
        return res.status(400).json({
          message: "Coupon usage limit has been reached",
        });
      }
    }

    // Get user's cart
    const cart = await Cart.findOne({
      user: req.user._id,
    }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        message: "Your cart is empty",
      });
    }

    if (appliedCoupon) {
      if (cart.totalAmount < appliedCoupon.minimumAmount) {
        return res.status(400).json({
          message: `Minimum order amount is ₹${appliedCoupon.minimumAmount}`,
        });
      }

      if (appliedCoupon.discountType === "percentage") {
        discountAmount = (cart.totalAmount * appliedCoupon.discountValue) / 100;

        if (
          appliedCoupon.maximumDiscount !== null &&
          discountAmount > appliedCoupon.maximumDiscount
        ) {
          discountAmount = appliedCoupon.maximumDiscount;
        }
      } else {
        discountAmount = appliedCoupon.discountValue;
      }

      if (discountAmount > cart.totalAmount) {
        discountAmount = cart.totalAmount;
      }
    }

    // Check stock
    for (const item of cart.items) {
      if (!item.product || !item.product.isActive) {
        return res.status(400).json({
          message: "One or more products are no longer available",
        });
      }

      if (item.quantity > item.product.stock) {
        return res.status(400).json({
          message: `Insufficient stock for ${item.product.name}`,
        });
      }
    }

    // Prepare order items
    const orderItems = cart.items.map((item) => ({
      product: item.product._id,
      name: item.product.name,
      image: item.product.images?.[0] || "",
      price: item.price,
      quantity: item.quantity,
    }));

    // Generate order number
    const orderNumber = `LAVI-${Date.now()}`;

    // Create order
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress: {
        name,
        phone,
        street,
        city,
        state,
        pincode,
      },
      totalAmount: cart.totalAmount - discountAmount,
      couponCode: appliedCoupon ? appliedCoupon.code : "",
      discountAmount,
      paymentMethod,
      paymentStatus: "Pending",
      orderStatus: "Pending",
      orderNumber,
    });

    if (appliedCoupon) {
      appliedCoupon.usedCount += 1;
      await appliedCoupon.save();
    }

    // Reduce product stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: {
          stock: -item.quantity,
        },
      });
    }

    // Clear cart after successful order
    cart.items = [];
    cart.totalAmount = 0;

    await cart.save();

    res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error("Create order error:", error.message);

    res.status(500).json({
      message: "Failed to create order",
    });
  }
};

// Get logged-in user's orders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
    })
      .populate("items.product")
      .sort({
        createdAt: -1,
      });

    res.json({
      orders,
    });
  } catch (error) {
    console.error("Get my orders error:", error.message);

    res.status(500).json({
      message: "Failed to get orders",
    });
  }
};

// Get single order
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate("items.product");

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.json({
      order,
    });
  } catch (error) {
    console.error("Get order error:", error.message);

    res.status(500).json({
      message: "Failed to get order",
    });
  }
};

// Cancel order
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // Only Pending or Confirmed orders can be cancelled
    if (order.orderStatus !== "Pending" && order.orderStatus !== "Confirmed") {
      return res.status(400).json({
        message: "This order cannot be cancelled",
      });
    }

    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: {
          stock: item.quantity,
        },
      });
    }

    // Restore coupon usage
    if (order.couponCode) {
      await Coupon.findOneAndUpdate(
        {
          code: order.couponCode,
          usedCount: { $gt: 0 },
        },
        {
          $inc: {
            usedCount: -1,
          },
        },
      );
    }

    order.orderStatus = "Cancelled";

    await order.save();

    res.json({
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    console.error("Cancel order error:", error.message);

    res.status(500).json({
      message: "Failed to cancel order",
    });
  }
};

// Get all orders - Admin
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email phone")
      .populate("items.product")
      .sort({
        createdAt: -1,
      });

    res.json({
      orders,
    });
  } catch (error) {
    console.error("Get all orders error:", error.message);

    res.status(500).json({
      message: "Failed to get all orders",
    });
  }
};

// Update order status - Admin
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
        message: "Invalid order status",
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    order.orderStatus = status;

    await order.save();

    res.json({
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("Update order status error:", error.message);

    res.status(500).json({
      message: "Failed to update order status",
    });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
};
