const mongoose = require("mongoose");

const Coupon = require("../models/Coupon");

// =====================================
// GET ALL COUPONS - ADMIN
// =====================================
const getCoupons = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", status = "" } = req.query;

    const currentPage = Math.max(Number(page), 1);

    const itemsPerPage = Math.min(Math.max(Number(limit), 1), 100);

    const filter = {};

    if (search.trim()) {
      filter.$or = [
        {
          code: {
            $regex: search.trim(),
            $options: "i",
          },
        },
        {
          description: {
            $regex: search.trim(),
            $options: "i",
          },
        },
      ];
    }

    if (status === "active") {
      filter.isActive = true;
    }

    if (status === "inactive") {
      filter.isActive = false;
    }

    const totalCoupons = await Coupon.countDocuments(filter);

    const coupons = await Coupon.find(filter)
      .sort({
        createdAt: -1,
      })
      .skip((currentPage - 1) * itemsPerPage)
      .limit(itemsPerPage);

    res.json({
      success: true,
      coupons,
      pagination: {
        currentPage,
        totalPages: Math.ceil(totalCoupons / itemsPerPage),
        totalCoupons,
        limit: itemsPerPage,
      },
    });
  } catch (error) {
    console.error("Get coupons error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load coupons",
      error: error.message,
    });
  }
};

// =====================================
// GET SINGLE COUPON - ADMIN
// =====================================
const getCouponById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid coupon ID",
      });
    }

    const coupon = await Coupon.findById(id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    res.json({
      success: true,
      coupon,
    });
  } catch (error) {
    console.error("Get coupon error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load coupon",
      error: error.message,
    });
  }
};

// =====================================
// CREATE COUPON - ADMIN
// =====================================
const createCoupon = async (req, res) => {
  try {
    const {
      code,
      description = "",
      discountType,
      discountValue,
      minimumOrderAmount = 0,
      maximumDiscountAmount = 0,
      usageLimit = 0,
      startDate,
      expiryDate,
      isActive = true,
    } = req.body;

    if (!code || !code.trim()) {
      return res.status(400).json({
        success: false,
        message: "Coupon code is required",
      });
    }

    if (!["percentage", "fixed"].includes(discountType)) {
      return res.status(400).json({
        success: false,
        message: "Discount type must be percentage or fixed",
      });
    }

    const numericDiscountValue = Number(discountValue);

    if (Number.isNaN(numericDiscountValue) || numericDiscountValue <= 0) {
      return res.status(400).json({
        success: false,
        message: "Discount value must be greater than 0",
      });
    }

    if (discountType === "percentage" && numericDiscountValue > 100) {
      return res.status(400).json({
        success: false,
        message: "Percentage discount cannot exceed 100",
      });
    }

    const numericMinimum = Number(minimumOrderAmount);

    const numericMaximum = Number(maximumDiscountAmount);

    const numericUsageLimit = Number(usageLimit);

    if (Number.isNaN(numericMinimum) || numericMinimum < 0) {
      return res.status(400).json({
        success: false,
        message: "Minimum order amount cannot be negative",
      });
    }

    if (Number.isNaN(numericMaximum) || numericMaximum < 0) {
      return res.status(400).json({
        success: false,
        message: "Maximum discount amount cannot be negative",
      });
    }

    if (Number.isNaN(numericUsageLimit) || numericUsageLimit < 0) {
      return res.status(400).json({
        success: false,
        message: "Usage limit cannot be negative",
      });
    }

    const normalizedCode = code.trim().toUpperCase();

    const existingCoupon = await Coupon.findOne({
      code: normalizedCode,
    });

    if (existingCoupon) {
      return res.status(400).json({
        success: false,
        message: "A coupon with this code already exists",
      });
    }

    const couponStartDate = startDate ? new Date(startDate) : new Date();

    const couponExpiryDate = expiryDate ? new Date(expiryDate) : null;

    if (Number.isNaN(couponStartDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid start date",
      });
    }

    if (!couponExpiryDate || Number.isNaN(couponExpiryDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "A valid expiry date is required",
      });
    }

    if (couponExpiryDate <= couponStartDate) {
      return res.status(400).json({
        success: false,
        message: "Expiry date must be after start date",
      });
    }

    const coupon = await Coupon.create({
      code: normalizedCode,
      description: description.trim(),
      discountType,
      discountValue: numericDiscountValue,
      minimumOrderAmount: numericMinimum,
      maximumDiscountAmount: numericMaximum,
      usageLimit: numericUsageLimit,
      usedCount: 0,
      startDate: couponStartDate,
      expiryDate: couponExpiryDate,
      isActive: Boolean(isActive),
    });

    res.status(201).json({
      success: true,
      message: "Coupon created successfully",
      coupon,
    });
  } catch (error) {
    console.error("Create coupon error:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "A coupon with this code already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create coupon",
      error: error.message,
    });
  }
};

// =====================================
// UPDATE COUPON - ADMIN
// =====================================
const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid coupon ID",
      });
    }

    const coupon = await Coupon.findById(id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    const {
      code,
      description,
      discountType,
      discountValue,
      minimumOrderAmount,
      maximumDiscountAmount,
      usageLimit,
      startDate,
      expiryDate,
      isActive,
    } = req.body;

    if (code !== undefined) {
      if (!code.trim()) {
        return res.status(400).json({
          success: false,
          message: "Coupon code cannot be empty",
        });
      }

      const normalizedCode = code.trim().toUpperCase();

      const duplicateCoupon = await Coupon.findOne({
        code: normalizedCode,
        _id: {
          $ne: id,
        },
      });

      if (duplicateCoupon) {
        return res.status(400).json({
          success: false,
          message: "Another coupon with this code already exists",
        });
      }

      coupon.code = normalizedCode;
    }

    if (description !== undefined) {
      coupon.description = description.trim();
    }

    if (discountType !== undefined) {
      if (!["percentage", "fixed"].includes(discountType)) {
        return res.status(400).json({
          success: false,
          message: "Invalid discount type",
        });
      }

      coupon.discountType = discountType;
    }

    if (discountValue !== undefined) {
      const value = Number(discountValue);

      if (Number.isNaN(value) || value <= 0) {
        return res.status(400).json({
          success: false,
          message: "Discount value must be greater than 0",
        });
      }

      const type =
        discountType !== undefined ? discountType : coupon.discountType;

      if (type === "percentage" && value > 100) {
        return res.status(400).json({
          success: false,
          message: "Percentage discount cannot exceed 100",
        });
      }

      coupon.discountValue = value;
    }

    if (minimumOrderAmount !== undefined) {
      const value = Number(minimumOrderAmount);

      if (Number.isNaN(value) || value < 0) {
        return res.status(400).json({
          success: false,
          message: "Minimum order amount cannot be negative",
        });
      }

      coupon.minimumOrderAmount = value;
    }

    if (maximumDiscountAmount !== undefined) {
      const value = Number(maximumDiscountAmount);

      if (Number.isNaN(value) || value < 0) {
        return res.status(400).json({
          success: false,
          message: "Maximum discount amount cannot be negative",
        });
      }

      coupon.maximumDiscountAmount = value;
    }

    if (usageLimit !== undefined) {
      const value = Number(usageLimit);

      if (Number.isNaN(value) || value < 0) {
        return res.status(400).json({
          success: false,
          message: "Usage limit cannot be negative",
        });
      }

      if (value > 0 && value < coupon.usedCount) {
        return res.status(400).json({
          success: false,
          message:
            "Usage limit cannot be less than the number of coupons already used",
        });
      }

      coupon.usageLimit = value;
    }

    if (startDate !== undefined) {
      const date = new Date(startDate);

      if (Number.isNaN(date.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid start date",
        });
      }

      coupon.startDate = date;
    }

    if (expiryDate !== undefined) {
      const date = new Date(expiryDate);

      if (Number.isNaN(date.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid expiry date",
        });
      }

      coupon.expiryDate = date;
    }

    if (coupon.expiryDate <= coupon.startDate) {
      return res.status(400).json({
        success: false,
        message: "Expiry date must be after start date",
      });
    }

    if (isActive !== undefined) {
      coupon.isActive = Boolean(isActive);
    }

    await coupon.save();

    res.json({
      success: true,
      message: "Coupon updated successfully",
      coupon,
    });
  } catch (error) {
    console.error("Update coupon error:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "A coupon with this code already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update coupon",
      error: error.message,
    });
  }
};

// =====================================
// TOGGLE COUPON STATUS - ADMIN
// =====================================
const toggleCouponStatus = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid coupon ID",
      });
    }

    const coupon = await Coupon.findById(id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    coupon.isActive = !coupon.isActive;

    await coupon.save();

    res.json({
      success: true,
      message: coupon.isActive
        ? "Coupon activated successfully"
        : "Coupon deactivated successfully",
      coupon,
    });
  } catch (error) {
    console.error("Toggle coupon status error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update coupon status",
      error: error.message,
    });
  }
};

// =====================================
// DELETE COUPON - ADMIN
// =====================================
const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid coupon ID",
      });
    }

    const coupon = await Coupon.findById(id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    if (coupon.usedCount > 0) {
      return res.status(400).json({
        success: false,
        message:
          "A coupon that has already been used cannot be deleted. Deactivate it instead.",
      });
    }

    await Coupon.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Coupon deleted successfully",
    });
  } catch (error) {
    console.error("Delete coupon error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete coupon",
      error: error.message,
    });
  }
};

// =====================================
// VALIDATE COUPON - CUSTOMER
// =====================================
const validateCoupon = async (req, res) => {
  try {
    const { code, orderAmount } = req.body;

    if (!code || !code.trim()) {
      return res.status(400).json({
        success: false,
        message: "Coupon code is required",
      });
    }

    const amount = Number(orderAmount);

    if (Number.isNaN(amount) || amount < 0) {
      return res.status(400).json({
        success: false,
        message: "A valid order amount is required",
      });
    }

    const normalizedCode = code.trim().toUpperCase();

    const coupon = await Coupon.findOne({
      code: normalizedCode,
    });

    if (!coupon) {
      return res.status(404).json({
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

    if (amount < coupon.minimumOrderAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount is ₹${coupon.minimumOrderAmount}`,
      });
    }

    let discountAmount = 0;

    if (coupon.discountType === "percentage") {
      discountAmount = (amount * coupon.discountValue) / 100;

      if (
        coupon.maximumDiscountAmount > 0 &&
        discountAmount > coupon.maximumDiscountAmount
      ) {
        discountAmount = coupon.maximumDiscountAmount;
      }
    } else {
      discountAmount = coupon.discountValue;
    }

    if (discountAmount > amount) {
      discountAmount = amount;
    }

    const finalAmount = amount - discountAmount;

    res.json({
      success: true,
      message: "Coupon applied successfully",
      coupon: {
        id: coupon._id,
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
      },
      discountAmount,
      finalAmount,
    });
  } catch (error) {
    console.error("Validate coupon error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to validate coupon",
      error: error.message,
    });
  }
};

module.exports = {
  getCoupons,
  getCouponById,
  createCoupon,
  updateCoupon,
  toggleCouponStatus,
  deleteCoupon,
  validateCoupon,
};
