const mongoose = require("mongoose");

const Review = require("../models/Review");
const Product = require("../models/Product");
const Order = require("../models/Order");

// =====================================
// GET PRODUCT REVIEWS
// =====================================
const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const { page = 1, limit = 10 } = req.query;

    const currentPage = Math.max(Number(page), 1);

    const itemsPerPage = Math.min(Math.max(Number(limit), 1), 50);

    const filter = {
      product: productId,
      isApproved: true,
      isActive: true,
    };

    const totalReviews = await Review.countDocuments(filter);

    const reviews = await Review.find(filter)
      .populate({
        path: "user",
        select: "name profileImage",
      })
      .sort({
        createdAt: -1,
      })
      .skip((currentPage - 1) * itemsPerPage)
      .limit(itemsPerPage);

    res.json({
      success: true,
      reviews,
      pagination: {
        currentPage,
        totalPages: Math.ceil(totalReviews / itemsPerPage),
        totalReviews,
        limit: itemsPerPage,
      },
    });
  } catch (error) {
    console.error("Get product reviews error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load product reviews",
      error: error.message,
    });
  }
};

// =====================================
// GET PRODUCT REVIEW SUMMARY
// =====================================
const getReviewSummary = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const reviews = await Review.find({
      product: productId,
      isApproved: true,
      isActive: true,
    }).select("rating");

    const totalReviews = reviews.length;

    let averageRating = 0;

    if (totalReviews > 0) {
      const totalRating = reviews.reduce(
        (sum, review) => sum + review.rating,
        0,
      );

      averageRating = totalRating / totalReviews;
    }

    const ratingDistribution = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    };

    reviews.forEach((review) => {
      ratingDistribution[review.rating] += 1;
    });

    res.json({
      success: true,
      summary: {
        averageRating: Number(averageRating.toFixed(1)),
        totalReviews,
        ratingDistribution,
      },
    });
  } catch (error) {
    console.error("Get review summary error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load review summary",
      error: error.message,
    });
  }
};

// =====================================
// CHECK IF USER CAN REVIEW
// =====================================
const canReviewProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const existingReview = await Review.findOne({
      product: productId,
      user: req.user._id,
    });

    if (existingReview) {
      return res.json({
        success: true,
        canReview: false,
        hasReviewed: true,
        message: "You have already reviewed this product",
      });
    }

    const deliveredOrder = await Order.findOne({
      user: req.user._id,
      orderStatus: "Delivered",
      "items.product": productId,
    });

    if (!deliveredOrder) {
      return res.json({
        success: true,
        canReview: false,
        hasReviewed: false,
        message:
          "You can review this product after purchasing and receiving it",
      });
    }

    res.json({
      success: true,
      canReview: true,
      hasReviewed: false,
      message: "You can review this product",
    });
  } catch (error) {
    console.error("Can review product error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to check review eligibility",
      error: error.message,
    });
  }
};

// =====================================
// CREATE REVIEW
// =====================================
const createReview = async (req, res) => {
  try {
    const { productId, rating, title = "", comment } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const numericRating = Number(rating);

    if (
      !Number.isInteger(numericRating) ||
      numericRating < 1 ||
      numericRating > 5
    ) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    if (!comment || !comment.trim()) {
      return res.status(400).json({
        success: false,
        message: "Review comment is required",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (!product.isActive) {
      return res.status(400).json({
        success: false,
        message: "This product is currently unavailable",
      });
    }

    // Check whether the customer
    // actually purchased and received
    // the product.
    const deliveredOrder = await Order.findOne({
      user: req.user._id,
      orderStatus: "Delivered",
      "items.product": productId,
    });

    if (!deliveredOrder) {
      return res.status(403).json({
        success: false,
        message:
          "You can review a product only after purchasing and receiving it",
      });
    }

    const existingReview = await Review.findOne({
      product: productId,
      user: req.user._id,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product",
      });
    }

    const review = await Review.create({
      product: productId,
      user: req.user._id,
      rating: numericRating,
      title: title ? title.trim() : "",
      comment: comment.trim(),
      isApproved: true,
      isActive: true,
    });

    // Update product rating.
    await updateProductRating(productId);

    const populatedReview = await Review.findById(review._id).populate({
      path: "user",
      select: "name profileImage",
    });

    res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      review: populatedReview,
    });
  } catch (error) {
    console.error("Create review error:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to submit review",
      error: error.message,
    });
  }
};

// =====================================
// UPDATE MY REVIEW
// =====================================
const updateMyReview = async (req, res) => {
  try {
    const { id } = req.params;

    const { rating, title = "", comment } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid review ID",
      });
    }

    const review = await Review.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    if (rating !== undefined) {
      const numericRating = Number(rating);

      if (
        !Number.isInteger(numericRating) ||
        numericRating < 1 ||
        numericRating > 5
      ) {
        return res.status(400).json({
          success: false,
          message: "Rating must be between 1 and 5",
        });
      }

      review.rating = numericRating;
    }

    if (comment !== undefined) {
      if (!comment.trim()) {
        return res.status(400).json({
          success: false,
          message: "Review comment cannot be empty",
        });
      }

      review.comment = comment.trim();
    }

    if (title !== undefined) {
      review.title = title ? title.trim() : "";
    }

    await review.save();

    await updateProductRating(review.product);

    const updatedReview = await Review.findById(review._id).populate({
      path: "user",
      select: "name profileImage",
    });

    res.json({
      success: true,
      message: "Review updated successfully",
      review: updatedReview,
    });
  } catch (error) {
    console.error("Update review error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update review",
      error: error.message,
    });
  }
};

// =====================================
// DELETE MY REVIEW
// =====================================
const deleteMyReview = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid review ID",
      });
    }

    const review = await Review.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    const productId = review.product;

    await Review.findByIdAndDelete(review._id);

    await updateProductRating(productId);

    res.json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Delete review error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete review",
      error: error.message,
    });
  }
};

// =====================================
// GET ALL REVIEWS - ADMIN
// =====================================
const getAllReviews = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      rating = "",
      status = "",
    } = req.query;

    const currentPage = Math.max(Number(page), 1);

    const itemsPerPage = Math.min(Math.max(Number(limit), 1), 100);

    const filter = {};

    if (rating) {
      const numericRating = Number(rating);

      if (
        Number.isInteger(numericRating) &&
        numericRating >= 1 &&
        numericRating <= 5
      ) {
        filter.rating = numericRating;
      }
    }

    if (status === "approved") {
      filter.isApproved = true;
    }

    if (status === "pending") {
      filter.isApproved = false;
    }

    if (status === "active") {
      filter.isActive = true;
    }

    if (status === "inactive") {
      filter.isActive = false;
    }

    if (search.trim()) {
      const products = await Product.find({
        $or: [
          {
            name: {
              $regex: search.trim(),
              $options: "i",
            },
          },
          {
            brand: {
              $regex: search.trim(),
              $options: "i",
            },
          },
        ],
      }).select("_id");

      filter.product = {
        $in: products.map((product) => product._id),
      };
    }

    const totalReviews = await Review.countDocuments(filter);

    const reviews = await Review.find(filter)
      .populate({
        path: "user",
        select: "name email profileImage",
      })
      .populate({
        path: "product",
        select: "name brand model images",
      })
      .sort({
        createdAt: -1,
      })
      .skip((currentPage - 1) * itemsPerPage)
      .limit(itemsPerPage);

    res.json({
      success: true,
      reviews,
      pagination: {
        currentPage,
        totalPages: Math.ceil(totalReviews / itemsPerPage),
        totalReviews,
        limit: itemsPerPage,
      },
    });
  } catch (error) {
    console.error("Get all reviews error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load reviews",
      error: error.message,
    });
  }
};

// =====================================
// ADMIN APPROVE / DISABLE REVIEW
// =====================================
const updateReviewStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const { isApproved, isActive } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid review ID",
      });
    }

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    if (isApproved !== undefined) {
      review.isApproved = Boolean(isApproved);
    }

    if (isActive !== undefined) {
      review.isActive = Boolean(isActive);
    }

    await review.save();

    await updateProductRating(review.product);

    const updatedReview = await Review.findById(review._id)
      .populate({
        path: "user",
        select: "name email profileImage",
      })
      .populate({
        path: "product",
        select: "name brand model images",
      });

    res.json({
      success: true,
      message: "Review status updated successfully",
      review: updatedReview,
    });
  } catch (error) {
    console.error("Update review status error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update review status",
      error: error.message,
    });
  }
};

// =====================================
// ADMIN DELETE REVIEW
// =====================================
const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid review ID",
      });
    }

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    const productId = review.product;

    await Review.findByIdAndDelete(review._id);

    await updateProductRating(productId);

    res.json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Admin delete review error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete review",
      error: error.message,
    });
  }
};

// =====================================
// UPDATE PRODUCT RATING
// =====================================
const updateProductRating = async (productId) => {
  const reviews = await Review.find({
    product: productId,
    isApproved: true,
    isActive: true,
  }).select("rating");

  const reviewCount = reviews.length;

  let rating = 0;

  if (reviewCount > 0) {
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);

    rating = totalRating / reviewCount;
  }

  await Product.findByIdAndUpdate(productId, {
    rating: Number(rating.toFixed(1)),
    reviewCount,
  });
};

module.exports = {
  getProductReviews,
  getReviewSummary,
  canReviewProduct,
  createReview,
  updateMyReview,
  deleteMyReview,
  getAllReviews,
  updateReviewStatus,
  deleteReview,
};
