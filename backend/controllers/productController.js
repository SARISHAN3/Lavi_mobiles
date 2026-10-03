const Product = require("../models/Product");

// =====================================
// GET PRODUCTS
// =====================================
const getProducts = async (req, res) => {
  try {
    const {
      search = "",
      brand,
      category,
      categoryId,
      ram,
      storage,
      operatingSystem,
      network,
      screenSize,
      minPrice,
      maxPrice,
      minRating,
      availability,
      sort = "newest",
      page = 1,
      limit = 12,
      featured,
      isActive,
    } = req.query;

    const filter = {};

    // =====================================
    // SEARCH
    // =====================================
    if (search.trim()) {
      filter.$or = [
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
        {
          model: {
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

    // =====================================
    // BRAND
    // =====================================
    if (brand) {
      const brands = brand
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      if (brands.length === 1) {
        filter.brand = {
          $regex: `^${escapeRegex(brands[0])}$`,
          $options: "i",
        };
      } else if (brands.length > 1) {
        filter.brand = {
          $in: brands.map((item) => new RegExp(`^${escapeRegex(item)}$`, "i")),
        };
      }
    }

    // =====================================
    // CATEGORY
    // =====================================
    if (category) {
      const categories = category
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      if (categories.length === 1) {
        filter.category = {
          $regex: `^${escapeRegex(categories[0])}$`,
          $options: "i",
        };
      } else if (categories.length > 1) {
        filter.category = {
          $in: categories.map(
            (item) => new RegExp(`^${escapeRegex(item)}$`, "i"),
          ),
        };
      }
    }

    if (categoryId) {
      filter.categoryId = categoryId;
    }

    // =====================================
    // RAM
    // =====================================
    if (ram) {
      const ramValues = ram
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      filter.ram = {
        $in: ramValues.map((item) => new RegExp(`^${escapeRegex(item)}$`, "i")),
      };
    }

    // =====================================
    // STORAGE
    // =====================================
    if (storage) {
      const storageValues = storage
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      filter.storage = {
        $in: storageValues.map(
          (item) => new RegExp(`^${escapeRegex(item)}$`, "i"),
        ),
      };
    }

    // =====================================
    // OPERATING SYSTEM
    // =====================================
    if (operatingSystem) {
      const osValues = operatingSystem
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      filter.operatingSystem = {
        $in: osValues.map((item) => new RegExp(`^${escapeRegex(item)}$`, "i")),
      };
    }

    // =====================================
    // NETWORK
    // =====================================
    if (network) {
      const networkValues = network
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      filter.network = {
        $in: networkValues.map(
          (item) => new RegExp(`^${escapeRegex(item)}$`, "i"),
        ),
      };
    }

    // =====================================
    // SCREEN SIZE
    // =====================================
    if (screenSize) {
      const screenValues = screenSize
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      filter.screenSize = {
        $in: screenValues.map(
          (item) => new RegExp(`^${escapeRegex(item)}$`, "i"),
        ),
      };
    }

    // =====================================
    // PRICE
    // =====================================
    if (minPrice !== undefined && minPrice !== "") {
      filter.price = {
        ...filter.price,
        $gte: Number(minPrice),
      };
    }

    if (maxPrice !== undefined && maxPrice !== "") {
      filter.price = {
        ...filter.price,
        $lte: Number(maxPrice),
      };
    }

    // =====================================
    // RATING
    // =====================================
    if (minRating !== undefined && minRating !== "") {
      filter.rating = {
        $gte: Number(minRating),
      };
    }

    // =====================================
    // AVAILABILITY
    // =====================================
    if (availability === "in-stock") {
      filter.stock = {
        $gt: 0,
      };
    }

    if (availability === "out-of-stock") {
      filter.stock = 0;
    }

    if (availability === "low-stock") {
      filter.$expr = {
        $and: [
          {
            $gt: ["$stock", 0],
          },
          {
            $lte: ["$stock", "$lowStockLimit"],
          },
        ],
      };
    }

    // =====================================
    // ACTIVE / INACTIVE
    // =====================================
    if (isActive === "true") {
      filter.isActive = true;
    }

    if (isActive === "false") {
      filter.isActive = false;
    }

    // Customer normally sees active products
    if (isActive === undefined && req.user?.role !== "admin") {
      filter.isActive = true;
    }

    // =====================================
    // FEATURED
    // =====================================
    if (featured === "true") {
      filter.isFeatured = true;
    }

    // =====================================
    // SORTING
    // =====================================
    let sortOption = {
      createdAt: -1,
    };

    switch (sort) {
      case "price-low":
        sortOption = {
          price: 1,
        };
        break;

      case "price-high":
        sortOption = {
          price: -1,
        };
        break;

      case "rating":
        sortOption = {
          rating: -1,
          reviewCount: -1,
        };
        break;

      case "name-asc":
        sortOption = {
          name: 1,
        };
        break;

      case "name-desc":
        sortOption = {
          name: -1,
        };
        break;

      case "discount":
        sortOption = {
          discount: -1,
        };
        break;

      case "stock-low":
        sortOption = {
          stock: 1,
        };
        break;

      case "newest":
      default:
        sortOption = {
          createdAt: -1,
        };
        break;
    }

    // =====================================
    // PAGINATION
    // =====================================
    const currentPage = Math.max(Number(page), 1);

    const perPage = Math.max(Number(limit), 1);

    const skip = (currentPage - 1) * perPage;

    const totalProducts = await Product.countDocuments(filter);

    const products = await Product.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(perPage);

    res.json({
      success: true,
      products,
      pagination: {
        currentPage,
        totalPages: Math.ceil(totalProducts / perPage),
        totalProducts,
        limit: perPage,
      },
    });
  } catch (error) {
    console.error("Get products error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load products",
      error: error.message,
    });
  }
};

// =====================================
// GET SINGLE PRODUCT
// =====================================
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (!product.isActive && req.user?.role !== "admin") {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Get product by ID error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load product",
      error: error.message,
    });
  }
};

// =====================================
// CREATE PRODUCT
// =====================================
const createProduct = async (req, res) => {
  try {
    const {
      name,
      brand,
      model,
      category,
      categoryId,
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
      connectivity,
      compatibility,
      waterResistance,
      batteryLife,
      stock,
      lowStockLimit,
      rating,
      isFeatured,
      isActive,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Product name is required",
      });
    }

    if (!brand || !brand.trim()) {
      return res.status(400).json({
        success: false,
        message: "Brand is required",
      });
    }

    if (price === undefined || price === "") {
      return res.status(400).json({
        success: false,
        message: "Price is required",
      });
    }

    if (mrp === undefined || mrp === "") {
      return res.status(400).json({
        success: false,
        message: "MRP is required",
      });
    }

    let images = [];

    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        images.push(`/uploads/products/${file.filename}`);
      });
    }

    const product = await Product.create({
      name: name.trim(),
      brand: brand.trim(),
      model: model ? model.trim() : "",
      category: category && category.trim() ? category.trim() : "Mobile Phones",
      categoryId: categoryId || null,
      price: Number(price),
      mrp: Number(mrp),
      discount:
        discount === "" || discount === undefined ? 0 : Number(discount),
      images,
      description: description || "",
      highlights: parseArrayField(highlights),
      ram: ram || "",
      storage: storage || "",
      operatingSystem: operatingSystem || "",
      network: network || "5G",
      screenSize: screenSize || "",
      battery: battery || "",
      processor: processor || "",
      camera: camera || "",
      colors: parseArrayField(colors),
      connectivity: connectivity || "",
      compatibility: compatibility || "",
      waterResistance: waterResistance || "",
      batteryLife: batteryLife || "",
      stock: stock === "" || stock === undefined ? 0 : Number(stock),
      lowStockLimit:
        lowStockLimit === "" || lowStockLimit === undefined
          ? 5
          : Number(lowStockLimit),
      rating: rating === "" || rating === undefined ? 0 : Number(rating),
      isFeatured: parseBoolean(isFeatured),
      isActive: isActive === undefined ? true : parseBoolean(isActive),
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Create product error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create product",
      error: error.message,
    });
  }
};

// =====================================
// UPDATE PRODUCT
// =====================================
const updateProduct = async (req, res) => {
  try {
    const {
      name,
      brand,
      model,
      category,
      categoryId,
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
      connectivity,
      compatibility,
      waterResistance,
      batteryLife,
      stock,
      lowStockLimit,
      rating,
      isFeatured,
      isActive,
      existingImages,
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Product name is required",
      });
    }

    if (!brand || !brand.trim()) {
      return res.status(400).json({
        success: false,
        message: "Brand is required",
      });
    }

    // =====================================
    // EXISTING IMAGES
    // =====================================
    let images = [];

    if (existingImages) {
      images = Array.isArray(existingImages)
        ? existingImages
        : [existingImages];
    }

    // =====================================
    // NEW IMAGES
    // =====================================
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        images.push(`/uploads/products/${file.filename}`);
      });
    }

    product.name = name.trim();
    product.brand = brand.trim();
    product.model = model ? model.trim() : "";

    product.category =
      category && category.trim() ? category.trim() : "Mobile Phones";

    product.categoryId = categoryId || null;

    product.price = Number(price);
    product.mrp = Number(mrp);

    product.discount =
      discount === "" || discount === undefined ? 0 : Number(discount);

    product.description = description || "";

    product.highlights = parseArrayField(highlights);

    product.ram = ram || "";
    product.storage = storage || "";
    product.operatingSystem = operatingSystem || "";
    product.network = network || "5G";
    product.screenSize = screenSize || "";
    product.battery = battery || "";
    product.processor = processor || "";
    product.camera = camera || "";

    product.colors = parseArrayField(colors);

    product.connectivity = connectivity || "";

    product.compatibility = compatibility || "";

    product.waterResistance = waterResistance || "";

    product.batteryLife = batteryLife || "";

    product.stock = stock === "" || stock === undefined ? 0 : Number(stock);

    product.lowStockLimit =
      lowStockLimit === "" || lowStockLimit === undefined
        ? 5
        : Number(lowStockLimit);

    product.rating = rating === "" || rating === undefined ? 0 : Number(rating);

    product.isFeatured = parseBoolean(isFeatured);

    product.isActive =
      isActive === undefined ? product.isActive : parseBoolean(isActive);

    product.images = images;

    await product.save();

    res.json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Update product error:", error);

    res.status(400).json({
      success: false,
      message: "Failed to update product",
      error: error.message,
    });
  }
};

// =====================================
// TOGGLE PRODUCT STATUS
// =====================================
const toggleProductStatus = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    product.isActive = !product.isActive;

    await product.save();

    res.json({
      success: true,
      message: `Product ${
        product.isActive ? "activated" : "deactivated"
      } successfully`,
      product,
    });
  } catch (error) {
    console.error("Toggle product status error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update product status",
      error: error.message,
    });
  }
};

// =====================================
// DELETE PRODUCT
// =====================================
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await product.deleteOne();

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete product error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error: error.message,
    });
  }
};

// =====================================
// GET FEATURED PRODUCTS
// =====================================
const getFeaturedProducts = async (req, res) => {
  try {
    const { limit = 8 } = req.query;

    const products = await Product.find({
      isActive: true,
      isFeatured: true,
    })
      .sort({
        createdAt: -1,
      })
      .limit(Number(limit));

    res.json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Get featured products error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load featured products",
      error: error.message,
    });
  }
};

// =====================================
// UPDATE STOCK
// =====================================
const updateProductStock = async (req, res) => {
  try {
    const { stock } = req.body;

    if (stock === undefined || stock === "" || Number(stock) < 0) {
      return res.status(400).json({
        success: false,
        message: "A valid stock value is required",
      });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        stock: Number(stock),
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      message: "Product stock updated successfully",
      product,
    });
  } catch (error) {
    console.error("Update product stock error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update product stock",
      error: error.message,
    });
  }
};

// =====================================
// HELPER: ESCAPE REGEX
// =====================================
const escapeRegex = (value) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

// =====================================
// HELPER: PARSE BOOLEAN
// =====================================
const parseBoolean = (value) => {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    return value.toLowerCase() === "true";
  }

  return Boolean(value);
};

// =====================================
// HELPER: PARSE ARRAY FIELD
// =====================================
const parseArrayField = (value) => {
  if (Array.isArray(value)) {
    return value;
  }

  if (!value) {
    return [];
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);

      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch (error) {
      // Continue with comma-separated parsing
    }

    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  toggleProductStatus,
  deleteProduct,
  getFeaturedProducts,
  updateProductStock,
};
