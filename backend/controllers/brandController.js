const Brand = require("../models/Brand");

// =====================================
// GET ALL BRANDS
// =====================================
const getBrands = async (req, res) => {
  try {
    const { search = "", status, page = 1, limit = 20 } = req.query;

    const filter = {};

    if (search.trim()) {
      filter.$or = [
        {
          name: {
            $regex: search.trim(),
            $options: "i",
          },
        },
        {
          slug: {
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

    const currentPage = Math.max(Number(page), 1);
    const perPage = Math.max(Number(limit), 1);
    const skip = (currentPage - 1) * perPage;

    const totalBrands = await Brand.countDocuments(filter);

    const brands = await Brand.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(perPage);

    res.json({
      success: true,
      brands,
      pagination: {
        currentPage,
        totalPages: Math.ceil(totalBrands / perPage),
        totalBrands,
        limit: perPage,
      },
    });
  } catch (error) {
    console.error("Get brands error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load brands",
      error: error.message,
    });
  }
};

// =====================================
// GET ACTIVE BRANDS
// =====================================
const getActiveBrands = async (req, res) => {
  try {
    const brands = await Brand.find({
      isActive: true,
    }).sort({ name: 1 });

    res.json({
      success: true,
      brands,
    });
  } catch (error) {
    console.error("Get active brands error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load active brands",
      error: error.message,
    });
  }
};

// =====================================
// GET SINGLE BRAND
// =====================================
const getBrandById = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found",
      });
    }

    res.json({
      success: true,
      brand,
    });
  } catch (error) {
    console.error("Get brand error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load brand",
      error: error.message,
    });
  }
};

// =====================================
// CREATE BRAND
// =====================================
const createBrand = async (req, res) => {
  try {
    const { name, slug, logo, description, isActive } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Brand name is required",
      });
    }

    const brandName = name.trim();

    const brandSlug =
      slug && slug.trim()
        ? slug.trim().toLowerCase()
        : brandName
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");

    const existingBrand = await Brand.findOne({
      $or: [{ name: brandName }, { slug: brandSlug }],
    });

    if (existingBrand) {
      return res.status(400).json({
        success: false,
        message: "Brand name or slug already exists",
      });
    }

    const brand = await Brand.create({
      name: brandName,
      slug: brandSlug,
      logo: logo || "",
      description: description ? description.trim() : "",
      isActive: typeof isActive === "boolean" ? isActive : true,
    });

    res.status(201).json({
      success: true,
      message: "Brand created successfully",
      brand,
    });
  } catch (error) {
    console.error("Create brand error:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Brand name or slug already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create brand",
      error: error.message,
    });
  }
};

// =====================================
// UPDATE BRAND
// =====================================
const updateBrand = async (req, res) => {
  try {
    const { name, slug, logo, description, isActive } = req.body;

    const brand = await Brand.findById(req.params.id);

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found",
      });
    }

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({
          success: false,
          message: "Brand name is required",
        });
      }

      brand.name = name.trim();
    }

    if (slug !== undefined) {
      if (!slug.trim()) {
        return res.status(400).json({
          success: false,
          message: "Brand slug is required",
        });
      }

      brand.slug = slug.trim().toLowerCase();
    }

    if (logo !== undefined) {
      brand.logo = logo;
    }

    if (description !== undefined) {
      brand.description = description.trim();
    }

    if (typeof isActive === "boolean") {
      brand.isActive = isActive;
    }

    const duplicate = await Brand.findOne({
      _id: { $ne: brand._id },
      $or: [{ name: brand.name }, { slug: brand.slug }],
    });

    if (duplicate) {
      return res.status(400).json({
        success: false,
        message: "Brand name or slug already exists",
      });
    }

    await brand.save();

    res.json({
      success: true,
      message: "Brand updated successfully",
      brand,
    });
  } catch (error) {
    console.error("Update brand error:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Brand name or slug already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update brand",
      error: error.message,
    });
  }
};

// =====================================
// TOGGLE BRAND STATUS
// =====================================
const toggleBrandStatus = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found",
      });
    }

    brand.isActive = !brand.isActive;

    await brand.save();

    res.json({
      success: true,
      message: `Brand ${
        brand.isActive ? "activated" : "deactivated"
      } successfully`,
      brand,
    });
  } catch (error) {
    console.error("Toggle brand status error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update brand status",
      error: error.message,
    });
  }
};

// =====================================
// DELETE BRAND
// =====================================
const deleteBrand = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found",
      });
    }

    await brand.deleteOne();

    res.json({
      success: true,
      message: "Brand deleted successfully",
    });
  } catch (error) {
    console.error("Delete brand error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete brand",
      error: error.message,
    });
  }
};

module.exports = {
  getBrands,
  getActiveBrands,
  getBrandById,
  createBrand,
  updateBrand,
  toggleBrandStatus,
  deleteBrand,
};
