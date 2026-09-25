const Coupon = require("../models/Coupon");

// Create coupon - Admin
const createCoupon = async (req, res) => {
  try {
    const {
      code,
      discountType,
      discountValue,
      minimumAmount = 0,
      maximumDiscount = null,
      startDate,
      expiryDate,
      usageLimit = 0,
    } = req.body;

    if (
      !code ||
      !discountType ||
      discountValue === undefined ||
      !startDate ||
      !expiryDate
    ) {
      return res.status(400).json({
        message: "Required coupon details are missing",
      });
    }

    if (!["percentage", "fixed"].includes(discountType)) {
      return res.status(400).json({
        message: "Invalid discount type",
      });
    }

    if (Number(discountValue) <= 0) {
      return res.status(400).json({
        message: "Discount value must be greater than 0",
      });
    }

    if (discountType === "percentage" && Number(discountValue) > 100) {
      return res.status(400).json({
        message: "Percentage discount cannot exceed 100",
      });
    }

    const existingCoupon = await Coupon.findOne({
      code: code.toUpperCase(),
    });

    if (existingCoupon) {
      return res.status(400).json({
        message: "Coupon code already exists",
      });
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      discountType,
      discountValue: Number(discountValue),
      minimumAmount: Number(minimumAmount),
      maximumDiscount:
        maximumDiscount === null ? null : Number(maximumDiscount),
      startDate,
      expiryDate,
      usageLimit: Number(usageLimit),
    });

    res.status(201).json({
      message: "Coupon created successfully",
      coupon,
    });
  } catch (error) {
    console.error("Create coupon error:", error.message);

    res.status(400).json({
      message: "Failed to create coupon",
      error: error.message,
    });
  }
};

// Get all coupons - Admin
const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({
      createdAt: -1,
    });

    res.json({
      coupons,
    });
  } catch (error) {
    console.error("Get all coupons error:", error.message);

    res.status(500).json({
      message: "Failed to get coupons",
    });
  }
};

// Update coupon - Admin
const updateCoupon = async (req, res) => {
  try {
    const {
      discountType,
      discountValue,
      minimumAmount,
      maximumDiscount,
      startDate,
      expiryDate,
      usageLimit,
      isActive,
    } = req.body;

    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        message: "Coupon not found",
      });
    }

    if (
      discountType !== undefined &&
      !["percentage", "fixed"].includes(discountType)
    ) {
      return res.status(400).json({
        message: "Invalid discount type",
      });
    }

    if (discountValue !== undefined && Number(discountValue) <= 0) {
      return res.status(400).json({
        message: "Discount value must be greater than 0",
      });
    }

    const newDiscountType =
      discountType !== undefined ? discountType : coupon.discountType;

    const newDiscountValue =
      discountValue !== undefined
        ? Number(discountValue)
        : coupon.discountValue;

    if (newDiscountType === "percentage" && newDiscountValue > 100) {
      return res.status(400).json({
        message: "Percentage discount cannot exceed 100",
      });
    }

    if (discountType !== undefined) {
      coupon.discountType = discountType;
    }

    if (discountValue !== undefined) {
      coupon.discountValue = Number(discountValue);
    }

    if (minimumAmount !== undefined) {
      coupon.minimumAmount = Number(minimumAmount);
    }

    if (maximumDiscount !== undefined) {
      coupon.maximumDiscount =
        maximumDiscount === null ? null : Number(maximumDiscount);
    }

    if (startDate !== undefined) {
      coupon.startDate = startDate;
    }

    if (expiryDate !== undefined) {
      coupon.expiryDate = expiryDate;
    }

    if (usageLimit !== undefined) {
      coupon.usageLimit = Number(usageLimit);
    }

    if (isActive !== undefined) {
      coupon.isActive = Boolean(isActive);
    }

    await coupon.save();

    res.json({
      message: "Coupon updated successfully",
      coupon,
    });
  } catch (error) {
    console.error("Update coupon error:", error.message);

    res.status(400).json({
      message: "Failed to update coupon",
      error: error.message,
    });
  }
};

// Validate coupon - Customer
const validateCoupon = async (req, res) => {
  try {
    const { code, orderAmount } = req.body;

    if (!code || orderAmount === undefined) {
      return res.status(400).json({
        message: "Coupon code and order amount are required",
      });
    }

    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      isActive: true,
    });

    if (!coupon) {
      return res.status(404).json({
        message: "Invalid or inactive coupon",
      });
    }

    const currentDate = new Date();

    if (currentDate < coupon.startDate) {
      return res.status(400).json({
        message: "This coupon is not active yet",
      });
    }

    if (currentDate > coupon.expiryDate) {
      return res.status(400).json({
        message: "This coupon has expired",
      });
    }

    if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({
        message: "Coupon usage limit has been reached",
      });
    }

    if (Number(orderAmount) < coupon.minimumAmount) {
      return res.status(400).json({
        message: `Minimum order amount is ₹${coupon.minimumAmount}`,
      });
    }

    let discountAmount = 0;

    if (coupon.discountType === "percentage") {
      discountAmount = (Number(orderAmount) * coupon.discountValue) / 100;

      if (
        coupon.maximumDiscount !== null &&
        discountAmount > coupon.maximumDiscount
      ) {
        discountAmount = coupon.maximumDiscount;
      }
    } else {
      discountAmount = coupon.discountValue;
    }

    if (discountAmount > Number(orderAmount)) {
      discountAmount = Number(orderAmount);
    }

    const finalAmount = Number(orderAmount) - discountAmount;

    res.json({
      message: "Coupon applied successfully",
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
      },
      orderAmount: Number(orderAmount),
      discountAmount,
      finalAmount,
    });
  } catch (error) {
    console.error("Validate coupon error:", error.message);

    res.status(500).json({
      message: "Failed to validate coupon",
    });
  }
};

module.exports = {
  createCoupon,
  getAllCoupons,
  updateCoupon,
  validateCoupon,
};
