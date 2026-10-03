const Wishlist = require("../models/Wishlist");
const Product = require("../models/Product");

// =====================================
// GET CURRENT USER WISHLIST
// =====================================
const getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({
      user: req.user._id,
    }).populate({
      path: "products",
      select:
        "name brand model price mrp discount images stock rating reviewCount isActive category",
    });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.user._id,
        products: [],
      });

      wishlist = await Wishlist.findById(wishlist._id).populate({
        path: "products",
        select:
          "name brand model price mrp discount images stock rating reviewCount isActive category",
      });
    }

    // Remove products that no longer exist or are inactive.
    const activeProducts = wishlist.products.filter(
      (product) => product && product.isActive,
    );

    if (activeProducts.length !== wishlist.products.length) {
      wishlist.products = activeProducts.map((product) => product._id);

      await wishlist.save();

      wishlist = await Wishlist.findById(wishlist._id).populate({
        path: "products",
        select:
          "name brand model price mrp discount images stock rating reviewCount isActive category",
      });
    }

    res.json({
      success: true,
      wishlist,
    });
  } catch (error) {
    console.error("Get wishlist error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load wishlist",
      error: error.message,
    });
  }
};

// =====================================
// ADD PRODUCT TO WISHLIST
// =====================================
const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
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

    let wishlist = await Wishlist.findOne({
      user: req.user._id,
    });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.user._id,
        products: [product._id],
      });
    } else {
      const alreadyExists = wishlist.products.some(
        (id) => id.toString() === productId.toString(),
      );

      if (alreadyExists) {
        return res.status(400).json({
          success: false,
          message: "Product is already in your wishlist",
        });
      }

      wishlist.products.push(product._id);

      await wishlist.save();
    }

    wishlist = await Wishlist.findById(wishlist._id).populate({
      path: "products",
      select:
        "name brand model price mrp discount images stock rating reviewCount isActive category",
    });

    res.status(201).json({
      success: true,
      message: "Product added to wishlist",
      wishlist,
    });
  } catch (error) {
    console.error("Add to wishlist error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add product to wishlist",
      error: error.message,
    });
  }
};

// =====================================
// REMOVE PRODUCT FROM WISHLIST
// =====================================
const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({
      user: req.user._id,
    });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: "Wishlist not found",
      });
    }

    const productExists = wishlist.products.some(
      (id) => id.toString() === productId.toString(),
    );

    if (!productExists) {
      return res.status(404).json({
        success: false,
        message: "Product is not in your wishlist",
      });
    }

    wishlist.products = wishlist.products.filter(
      (id) => id.toString() !== productId.toString(),
    );

    await wishlist.save();

    const updatedWishlist = await Wishlist.findById(wishlist._id).populate({
      path: "products",
      select:
        "name brand model price mrp discount images stock rating reviewCount isActive category",
    });

    res.json({
      success: true,
      message: "Product removed from wishlist",
      wishlist: updatedWishlist,
    });
  } catch (error) {
    console.error("Remove from wishlist error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to remove product from wishlist",
      error: error.message,
    });
  }
};

// =====================================
// TOGGLE WISHLIST PRODUCT
// =====================================
const toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
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

    let wishlist = await Wishlist.findOne({
      user: req.user._id,
    });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.user._id,
        products: [product._id],
      });

      const populatedWishlist = await Wishlist.findById(wishlist._id).populate({
        path: "products",
        select:
          "name brand model price mrp discount images stock rating reviewCount isActive category",
      });

      return res.json({
        success: true,
        message: "Product added to wishlist",
        action: "added",
        wishlist: populatedWishlist,
      });
    }

    const productIndex = wishlist.products.findIndex(
      (id) => id.toString() === productId.toString(),
    );

    if (productIndex !== -1) {
      wishlist.products.splice(productIndex, 1);

      await wishlist.save();

      const updatedWishlist = await Wishlist.findById(wishlist._id).populate({
        path: "products",
        select:
          "name brand model price mrp discount images stock rating reviewCount isActive category",
      });

      return res.json({
        success: true,
        message: "Product removed from wishlist",
        action: "removed",
        wishlist: updatedWishlist,
      });
    }

    wishlist.products.push(product._id);

    await wishlist.save();

    const updatedWishlist = await Wishlist.findById(wishlist._id).populate({
      path: "products",
      select:
        "name brand model price mrp discount images stock rating reviewCount isActive category",
    });

    res.json({
      success: true,
      message: "Product added to wishlist",
      action: "added",
      wishlist: updatedWishlist,
    });
  } catch (error) {
    console.error("Toggle wishlist error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update wishlist",
      error: error.message,
    });
  }
};

// =====================================
// CLEAR WISHLIST
// =====================================
const clearWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({
      user: req.user._id,
    });

    if (!wishlist) {
      return res.json({
        success: true,
        message: "Wishlist is already empty",
        wishlist: {
          products: [],
        },
      });
    }

    wishlist.products = [];

    await wishlist.save();

    res.json({
      success: true,
      message: "Wishlist cleared successfully",
      wishlist,
    });
  } catch (error) {
    console.error("Clear wishlist error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to clear wishlist",
      error: error.message,
    });
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  toggleWishlist,
  clearWishlist,
};
