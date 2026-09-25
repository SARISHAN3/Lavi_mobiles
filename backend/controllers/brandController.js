const Brand = require("../models/Brand");

// Get all brands
const getBrands = async (req, res) => {
  try {
    const brands = await Brand.find().sort({
      name: 1,
    });

    res.json({
      brands,
    });
  } catch (error) {
    console.error("Get brands error:", error.message);

    res.status(500).json({
      message: "Failed to get brands",
    });
  }
};

// Get single brand
const getBrandById = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);

    if (!brand || !brand.isActive) {
      return res.status(404).json({
        message: "Brand not found",
      });
    }

    res.json({
      brand,
    });
  } catch (error) {
    console.error("Get brand error:", error.message);

    res.status(500).json({
      message: "Failed to get brand",
    });
  }
};

// Create brand
const createBrand = async (req, res) => {
  try {
    const { name, slug, logo, description } = req.body;

    if (!name || !slug) {
      return res.status(400).json({
        message: "Name and slug are required",
      });
    }

    const existingBrand = await Brand.findOne({
      $or: [{ name }, { slug }],
    });

    if (existingBrand) {
      return res.status(400).json({
        message: "Brand already exists",
      });
    }

    const brand = await Brand.create({
      name,
      slug,
      logo: logo || "",
      description: description || "",
    });

    res.status(201).json({
      message: "Brand created successfully",
      brand,
    });
  } catch (error) {
    console.error("Create brand error:", error.message);

    res.status(400).json({
      message: "Failed to create brand",
      error: error.message,
    });
  }
};

// Update brand
const updateBrand = async (req, res) => {
  try {
    const brand = await Brand.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!brand) {
      return res.status(404).json({
        message: "Brand not found",
      });
    }

    res.json({
      message: "Brand updated successfully",
      brand,
    });
  } catch (error) {
    console.error("Update brand error:", error.message);

    res.status(400).json({
      message: "Failed to update brand",
      error: error.message,
    });
  }
};

// Delete brand
const deleteBrand = async (req, res) => {
  try {
    const brand = await Brand.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true },
    );

    if (!brand) {
      return res.status(404).json({
        message: "Brand not found",
      });
    }

    res.json({
      message: "Brand deleted successfully",
    });
  } catch (error) {
    console.error("Delete brand error:", error.message);

    res.status(500).json({
      message: "Failed to delete brand",
    });
  }
};

module.exports = {
  getBrands,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand,
};
