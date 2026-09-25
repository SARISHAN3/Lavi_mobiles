const Review = require("../models/Review");
const Product = require("../models/Product");

// Add a review
const addReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    if (!productId || !rating || !comment) {
      return res.status(400).json({
        message: "Product ID, rating and comment are required",
      });
    }

    if (Number(rating) < 1 || Number(rating) > 5) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5",
      });
    }

    const product = await Product.findById(productId);

    if (!product || !product.isActive) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      user: req.user._id,
      product: productId,
    });

    if (existingReview) {
      return res.status(400).json({
        message: "You have already reviewed this product",
      });
    }

    const review = await Review.create({
      user: req.user._id,
      product: productId,
      rating: Number(rating),
      comment,
    });

    // Update product rating
    const reviews = await Review.find({
      product: productId,
      isApproved: true,
    });

    const totalRating = reviews.reduce((total, item) => total + item.rating, 0);

    const averageRating = totalRating / reviews.length;

    product.rating = Number(averageRating.toFixed(1));
    product.reviewCount = reviews.length;

    await product.save();

    await review.populate("user", "name");

    res.status(201).json({
      message: "Review added successfully",
      review,
    });
  } catch (error) {
    console.error("Add review error:", error.message);

    res.status(500).json({
      message: "Failed to add review",
    });
  }
};

// Get reviews for a product
const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      product: req.params.productId,
      isApproved: true,
    })
      .populate("user", "name")
      .sort({
        createdAt: -1,
      });

    res.json({
      reviews,
    });
  } catch (error) {
    console.error("Get product reviews error:", error.message);

    res.status(500).json({
      message: "Failed to get product reviews",
    });
  }
};

// Get all reviews - Admin
const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("user", "name email")
      .populate("product", "name brand")
      .sort({
        createdAt: -1,
      });

    res.json({
      reviews,
    });
  } catch (error) {
    console.error("Get all reviews error:", error.message);

    res.status(500).json({
      message: "Failed to get all reviews",
    });
  }
};

// Update review approval - Admin
const updateReviewApproval = async (req, res) => {
  try {
    const { isApproved } = req.body;

    if (typeof isApproved !== "boolean") {
      return res.status(400).json({
        message: "isApproved must be true or false",
      });
    }

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        message: "Review not found",
      });
    }

    review.isApproved = isApproved;

    await review.save();

    res.json({
      message: isApproved
        ? "Review approved successfully"
        : "Review hidden successfully",
      review,
    });
  } catch (error) {
    console.error("Update review approval error:", error.message);

    res.status(500).json({
      message: "Failed to update review approval",
    });
  }
};

module.exports = {
  addReview,
  getProductReviews,
  getAllReviews,
  updateReviewApproval,
};
