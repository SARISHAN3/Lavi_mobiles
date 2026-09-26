const Product = require("../models/Product");

// Get all products
const getProducts = async (req, res) => {
  try {
    const {
      search,
      brand,
      minPrice,
      maxPrice,
      ram,
      storage,
      network,
      availability,
      sort,
      page = 1,
      limit = 10,
    } = req.query;

    let filter = {
      isActive: true,
    };

    // Search
    if (search) {
      filter.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          brand: {
            $regex: search,
            $options: "i",
          },
        },
        {
          model: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    // Brand filter
    if (brand) {
      filter.brand = {
        $regex: brand,
        $options: "i",
      };
    }

    // Price filter
    if (minPrice || maxPrice) {
      filter.price = {};

      if (minPrice) {
        filter.price.$gte = Number(minPrice);
      }

      if (maxPrice) {
        filter.price.$lte = Number(maxPrice);
      }
    }

    // RAM filter
    if (ram) {
      filter.ram = ram;
    }

    // Storage filter
    if (storage) {
      filter.storage = storage;
    }

    // Network filter
    if (network) {
      filter.network = network;
    }

    // Availability filter
    if (availability === "in-stock") {
      filter.stock = { $gt: 0 };
    }

    if (availability === "low-stock") {
      ((filter.stock = { $gt: ["$stock", 0] }),
        { $lte: ["$stock", "$lowStockLimit"] });
    }

    if (availability === "out-of-stock") {
      filter.stock = { $lte: 0 };
    }

    // Sorting
    let sortOption = {
      createdAt: -1,
    };

    if (sort === "price-low") {
      sortOption = {
        price: 1,
      };
    }

    if (sort === "price-high") {
      sortOption = {
        price: -1,
      };
    }

    if (sort === "rating") {
      sortOption = {
        rating: -1,
      };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const products = await Product.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    const totalProducts = await Product.countDocuments(filter);

    res.json({
      products,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(totalProducts / Number(limit)),
        totalProducts,
        limit: Number(limit),
      },
    });
  } catch (error) {
    console.error("Get products error:", error.message);

    res.status(500).json({
      message: "Failed to get products",
    });
  }
};

// Get single product
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product || !product.isActive) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json({
      product,
    });
  } catch (error) {
    console.error("Get product error:", error.message);

    res.status(500).json({
      message: "Failed to get product",
    });
  }
};

// Create product
const createProduct = async (req, res) => {
  try {
    const {
      name,
      brand,
      model,
      price,
      mrp,
      discount,
      description,
      highlights,
      ram,
      storage,
      operatingSystem,
      network,
      screenSize,
      battery,
      processor,
      camera,
      colors,
      stock,
      lowStockLimit,
      rating,
      category,
      isFeatured,
    } = req.body;

    // Create image array
    let images = [];

    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        images.push(`/uploads/products/${file.filename}`);
      });
    }

    const product = await Product.create({
      name,
      brand,
      model,
      price,
      mrp,
      discount,
      images,
      description,
      highlights,
      ram,
      storage,
      operatingSystem,
      network,
      screenSize,
      battery,
      processor,
      camera,
      colors,
      stock,
      lowStockLimit,
      rating,
      category,
      isFeatured,
    });

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Create product error:", error);

    res.status(500).json({
      message: "Failed to create product",
      error: error.message,
    });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Update product error:", error.message);

    res.status(400).json({
      message: "Failed to update product",
      error: error.message,
    });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true },
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete product error:", error.message);

    res.status(500).json({
      message: "Failed to delete product",
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
