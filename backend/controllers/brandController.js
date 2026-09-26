const Brand = require("../models/Brand");

// =========================================================
// GET ALL BRANDS
// =========================================================

const getBrands = async (req, res) => {
  try {
    const brands = await Brand.find().sort({
      createdAt: -1,
    });

    res.json({
      brands,
    });
  } catch (error) {
    console.error("Get brands error:", error);

    res.status(500).json({
      message: "Failed to fetch brands",
      error: error.message,
    });
  }
};

// =========================================================
// GET SINGLE BRAND
// =========================================================

const getBrandById = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);

    if (!brand) {
      return res.status(404).json({
        message: "Brand not found",
      });
    }

    res.json({
      brand,
    });
  } catch (error) {
    console.error("Get brand error:", error);

    res.status(500).json({
      message: "Failed to fetch brand",
      error: error.message,
    });
  }
};

// =========================================================
// CREATE BRAND
// =========================================================

const createBrand = async (req, res) => {
  try {
    const { name, slug, description } = req.body;

    // Check required fields
    if (!name || !slug) {
      return res.status(400).json({
        message: "Brand name and slug are required",
      });
    }

    // Check duplicate name
    const existingName = await Brand.findOne({
      name: name.trim(),
    });

    if (existingName) {
      return res.status(400).json({
        message: "Brand name already exists",
      });
    }

    // Check duplicate slug
    const existingSlug = await Brand.findOne({
      slug: slug.trim().toLowerCase(),
    });

    if (existingSlug) {
      return res.status(400).json({
        message: "Brand slug already exists",
      });
    }

    // Logo path
    let logo = "";

    if (req.file) {
      logo = `/uploads/brands/${req.file.filename}`;
    }

    const brand = await Brand.create({
      name: name.trim(),
      slug: slug.trim().toLowerCase(),
      logo,
      description: description?.trim() || "",
    });

    res.status(201).json({
      message: "Brand created successfully",
      brand,
    });
  } catch (error) {
    console.error("Create brand error:", error);

    res.status(500).json({
      message: "Failed to create brand",
      error: error.message,
    });
  }
};

// =========================================================
// UPDATE BRAND
// =========================================================

const updateBrand = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);

    if (!brand) {
      return res.status(404).json({
        message: "Brand not found",
      });
    }

    const { name, slug, description, isActive } = req.body;

    // Check duplicate name
    if (name && name.trim() !== brand.name) {
      const existingName = await Brand.findOne({
        name: name.trim(),
        _id: { $ne: brand._id },
      });

      if (existingName) {
        return res.status(400).json({
          message: "Brand name already exists",
        });
      }

      brand.name = name.trim();
    }

    // Check duplicate slug
    if (slug && slug.trim().toLowerCase() !== brand.slug) {
      const existingSlug = await Brand.findOne({
        slug: slug.trim().toLowerCase(),
        _id: { $ne: brand._id },
      });

      if (existingSlug) {
        return res.status(400).json({
          message: "Brand slug already exists",
        });
      }

      brand.slug = slug.trim().toLowerCase();
    }

    if (description !== undefined) {
      brand.description = description.trim();
    }

    // Update status
    if (isActive !== undefined) {
      brand.isActive = isActive === true || isActive === "true";
    }

    // Update logo if a new image was uploaded
    if (req.file) {
      brand.logo = `/uploads/brands/${req.file.filename}`;
    }

    await brand.save();

    res.json({
      message: "Brand updated successfully",
      brand,
    });
  } catch (error) {
    console.error("Update brand error:", error);

    res.status(500).json({
      message: "Failed to update brand",
      error: error.message,
    });
  }
};

// =========================================================
// DELETE BRAND
// =========================================================

const deleteBrand = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);

    if (!brand) {
      return res.status(404).json({
        message: "Brand not found",
      });
    }

    await brand.deleteOne();

    res.json({
      message: "Brand deleted successfully",
    });
  } catch (error) {
    console.error("Delete brand error:", error);

    res.status(500).json({
      message: "Failed to delete brand",
      error: error.message,
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
