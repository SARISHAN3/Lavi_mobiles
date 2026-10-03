const Cart = require("../models/Cart");
const Product = require("../models/Product");

// =====================================
// GET CURRENT USER CART
// =====================================
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({
      user: req.user._id,
    }).populate({
      path: "items.product",
      select:
        "name brand model price mrp discount images stock isActive category",
    });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
        totalAmount: 0,
      });

      cart = await Cart.findById(cart._id).populate({
        path: "items.product",
        select:
          "name brand model price mrp discount images stock isActive category",
      });
    }

    // Remove products that no longer exist or are inactive/out of stock.
    const validItems = [];
    let changed = false;

    for (const item of cart.items) {
      if (!item.product || !item.product.isActive || item.product.stock <= 0) {
        changed = true;
        continue;
      }

      if (item.quantity > item.product.stock) {
        item.quantity = item.product.stock;
        changed = true;
      }

      // Keep the latest product price in the cart.
      if (item.price !== item.product.price) {
        item.price = item.product.price;
        changed = true;
      }

      validItems.push(item);
    }

    if (changed) {
      cart.items = validItems;
      calculateCartTotal(cart);
      await cart.save();

      cart = await Cart.findById(cart._id).populate({
        path: "items.product",
        select:
          "name brand model price mrp discount images stock isActive category",
      });
    }

    res.json({
      success: true,
      cart,
    });
  } catch (error) {
    console.error("Get cart error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load cart",
      error: error.message,
    });
  }
};

// =====================================
// ADD PRODUCT TO CART
// =====================================
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const requestedQuantity = Number(quantity);

    if (!Number.isInteger(requestedQuantity) || requestedQuantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
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

    if (product.stock <= 0) {
      return res.status(400).json({
        success: false,
        message: "This product is out of stock",
      });
    }

    let cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
        totalAmount: 0,
      });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId.toString(),
    );

    if (existingItem) {
      const newQuantity = existingItem.quantity + requestedQuantity;

      if (newQuantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stock} item(s) available`,
        });
      }

      existingItem.quantity = newQuantity;
      existingItem.price = product.price;
    } else {
      if (requestedQuantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stock} item(s) available`,
        });
      }

      cart.items.push({
        product: product._id,
        quantity: requestedQuantity,
        price: product.price,
      });
    }

    calculateCartTotal(cart);

    await cart.save();

    cart = await Cart.findById(cart._id).populate({
      path: "items.product",
      select:
        "name brand model price mrp discount images stock isActive category",
    });

    res.status(201).json({
      success: true,
      message: "Product added to cart",
      cart,
    });
  } catch (error) {
    console.error("Add to cart error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add product to cart",
      error: error.message,
    });
  }
};

// =====================================
// UPDATE CART ITEM QUANTITY
// =====================================
const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;

    const requestedQuantity = Number(quantity);

    if (!Number.isInteger(requestedQuantity) || requestedQuantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const item = cart.items.id(req.params.itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    const product = await Product.findById(item.product);

    if (!product) {
      cart.items.pull(req.params.itemId);
      calculateCartTotal(cart);
      await cart.save();

      return res.status(404).json({
        success: false,
        message: "Product no longer exists",
      });
    }

    if (!product.isActive) {
      return res.status(400).json({
        success: false,
        message: "This product is currently unavailable",
      });
    }

    if (requestedQuantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} item(s) available`,
      });
    }

    item.quantity = requestedQuantity;
    item.price = product.price;

    calculateCartTotal(cart);

    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate({
      path: "items.product",
      select:
        "name brand model price mrp discount images stock isActive category",
    });

    res.json({
      success: true,
      message: "Cart item updated successfully",
      cart: updatedCart,
    });
  } catch (error) {
    console.error("Update cart item error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update cart item",
      error: error.message,
    });
  }
};

// =====================================
// REMOVE CART ITEM
// =====================================
const removeCartItem = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const item = cart.items.id(req.params.itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    cart.items.pull(req.params.itemId);

    calculateCartTotal(cart);

    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate({
      path: "items.product",
      select:
        "name brand model price mrp discount images stock isActive category",
    });

    res.json({
      success: true,
      message: "Product removed from cart",
      cart: updatedCart,
    });
  } catch (error) {
    console.error("Remove cart item error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to remove cart item",
      error: error.message,
    });
  }
};

// =====================================
// CLEAR CART
// =====================================
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      return res.json({
        success: true,
        message: "Cart is already empty",
        cart: {
          items: [],
          totalAmount: 0,
        },
      });
    }

    cart.items = [];
    cart.totalAmount = 0;

    await cart.save();

    res.json({
      success: true,
      message: "Cart cleared successfully",
      cart,
    });
  } catch (error) {
    console.error("Clear cart error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to clear cart",
      error: error.message,
    });
  }
};

// =====================================
// HELPER: CALCULATE TOTAL
// =====================================
const calculateCartTotal = (cart) => {
  cart.totalAmount = cart.items.reduce((total, item) => {
    return total + Number(item.price) * Number(item.quantity);
  }, 0);
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
};
