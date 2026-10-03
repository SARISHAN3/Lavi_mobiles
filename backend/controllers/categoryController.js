const Category = require("../models/Category");

// =====================================
// GET ALL CATEGORIES
// =====================================
const getCategories = async (req, res) => {
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

    const totalCategories = await Category.countDocuments(filter);

    const categories = await Category.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(perPage);

    res.json({
      success: true,
      categories,
      pagination: {
        currentPage,
        totalPages: Math.ceil(totalCategories / perPage),
        totalCategories,
        limit: perPage,
      },
    });
  } catch (error) {
    console.error("Get categories error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load categories",
      error: error.message,
    });
  }
};

// =====================================
// GET ACTIVE CATEGORIES
// =====================================
const getActiveCategories = async (req, res) => {
  try {
    const categories = await Category.find({
      isActive: true,
    }).sort({ name: 1 });

    res.json({
      success: true,
      categories,
    });
  } catch (error) {
    console.error("Get active categories error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load active categories",
      error: error.message,
    });
  }
};

// =====================================
// GET SINGLE CATEGORY
// =====================================
const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.json({
      success: true,
      category,
    });
  } catch (error) {
    console.error("Get category error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load category",
      error: error.message,
    });
  }
};

// =====================================
// CREATE CATEGORY
// =====================================
const createCategory = async (req, res) => {
  try {
    const { name, slug, description, image, isActive } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const categoryName = name.trim();

    const categorySlug =
      slug && slug.trim()
        ? slug.trim().toLowerCase()
        : categoryName
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");

    const existingCategory = await Category.findOne({
      $or: [{ name: categoryName }, { slug: categorySlug }],
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category name or slug already exists",
      });
    }

    const category = await Category.create({
      name: categoryName,
      slug: categorySlug,
      description: description ? description.trim() : "",
      image: image || "",
      isActive: typeof isActive === "boolean" ? isActive : true,
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    console.error("Create category error:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Category name or slug already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create category",
      error: error.message,
    });
  }
};

// =====================================
// UPDATE CATEGORY
// =====================================
const updateCategory = async (req, res) => {
  try {
    const { name, slug, description, image, isActive } = req.body;

    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({
          success: false,
          message: "Category name is required",
        });
      }

      category.name = name.trim();
    }

    if (slug !== undefined) {
      if (!slug.trim()) {
        return res.status(400).json({
          success: false,
          message: "Category slug is required",
        });
      }

      category.slug = slug.trim().toLowerCase();
    }

    if (description !== undefined) {
      category.description = description.trim();
    }

    if (image !== undefined) {
      category.image = image;
    }

    if (typeof isActive === "boolean") {
      category.isActive = isActive;
    }

    const duplicate = await Category.findOne({
      _id: { $ne: category._id },
      $or: [{ name: category.name }, { slug: category.slug }],
    });

    if (duplicate) {
      return res.status(400).json({
        success: false,
        message: "Category name or slug already exists",
      });
    }

    await category.save();

    res.json({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    console.error("Update category error:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Category name or slug already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update category",
      error: error.message,
    });
  }
};

// =====================================
// TOGGLE CATEGORY STATUS
// =====================================
const toggleCategoryStatus = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    category.isActive = !category.isActive;

    await category.save();

    res.json({
      success: true,
      message: `Category ${
        category.isActive ? "activated" : "deactivated"
      } successfully`,
      category,
    });
  } catch (error) {
    console.error("Toggle category status error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update category status",
      error: error.message,
    });
  }
};

// =====================================
// DELETE CATEGORY
// =====================================
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    await category.deleteOne();

    res.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Delete category error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete category",
      error: error.message,
    });
  }
};

module.exports = {
  getCategories,
  getActiveCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  toggleCategoryStatus,
  deleteCategory,
};
