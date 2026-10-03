const ProductOption = require("../models/ProductOption");

// =====================================
// GET PRODUCT OPTIONS
// =====================================
const getProductOptions = async (req, res) => {
  try {
    const { type, search = "", includeInactive = "false" } = req.query;

    const filter = {};

    if (type) {
      filter.type = type;
    }

    if (includeInactive !== "true") {
      filter.isActive = true;
    }

    if (search.trim()) {
      filter.value = {
        $regex: search.trim(),
        $options: "i",
      };
    }

    const options = await ProductOption.find(filter).sort({
      type: 1,
      value: 1,
    });

    res.json({
      success: true,
      options,
    });
  } catch (error) {
    console.error("Get product options error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load product options",
      error: error.message,
    });
  }
};

// =====================================
// CREATE PRODUCT OPTION
// =====================================
const createProductOption = async (req, res) => {
  try {
    const { type, value } = req.body;

    if (!type || !value || !value.trim()) {
      return res.status(400).json({
        success: false,
        message: "Option type and value are required",
      });
    }

    const cleanValue = value.trim();

    const existingOption = await ProductOption.findOne({
      type,
      value: cleanValue,
    });

    if (existingOption) {
      if (!existingOption.isActive) {
        existingOption.isActive = true;
        await existingOption.save();

        return res.json({
          success: true,
          message: "Product option reactivated successfully",
          option: existingOption,
        });
      }

      return res.status(400).json({
        success: false,
        message: "This option already exists",
      });
    }

    const option = await ProductOption.create({
      type,
      value: cleanValue,
      isActive: true,
    });

    res.status(201).json({
      success: true,
      message: "Product option created successfully",
      option,
    });
  } catch (error) {
    console.error("Create product option error:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "This option already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create product option",
      error: error.message,
    });
  }
};

// =====================================
// UPDATE PRODUCT OPTION
// =====================================
const updateProductOption = async (req, res) => {
  try {
    const { type, value, isActive } = req.body;

    const option = await ProductOption.findById(req.params.id);

    if (!option) {
      return res.status(404).json({
        success: false,
        message: "Product option not found",
      });
    }

    if (type !== undefined) {
      if (!type.trim()) {
        return res.status(400).json({
          success: false,
          message: "Option type is required",
        });
      }

      option.type = type.trim();
    }

    if (value !== undefined) {
      if (!value.trim()) {
        return res.status(400).json({
          success: false,
          message: "Option value is required",
        });
      }

      option.value = value.trim();
    }

    if (typeof isActive === "boolean") {
      option.isActive = isActive;
    }

    const duplicate = await ProductOption.findOne({
      _id: { $ne: option._id },
      type: option.type,
      value: option.value,
    });

    if (duplicate) {
      return res.status(400).json({
        success: false,
        message: "This option already exists",
      });
    }

    await option.save();

    res.json({
      success: true,
      message: "Product option updated successfully",
      option,
    });
  } catch (error) {
    console.error("Update product option error:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "This option already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update product option",
      error: error.message,
    });
  }
};

// =====================================
// TOGGLE PRODUCT OPTION STATUS
// =====================================
const toggleProductOptionStatus = async (req, res) => {
  try {
    const option = await ProductOption.findById(req.params.id);

    if (!option) {
      return res.status(404).json({
        success: false,
        message: "Product option not found",
      });
    }

    option.isActive = !option.isActive;

    await option.save();

    res.json({
      success: true,
      message: `Product option ${
        option.isActive ? "activated" : "deactivated"
      } successfully`,
      option,
    });
  } catch (error) {
    console.error("Toggle product option status error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update product option status",
      error: error.message,
    });
  }
};

// =====================================
// DELETE PRODUCT OPTION
// =====================================
const deleteProductOption = async (req, res) => {
  try {
    const option = await ProductOption.findById(req.params.id);

    if (!option) {
      return res.status(404).json({
        success: false,
        message: "Product option not found",
      });
    }

    await option.deleteOne();

    res.json({
      success: true,
      message: "Product option deleted successfully",
    });
  } catch (error) {
    console.error("Delete product option error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete product option",
      error: error.message,
    });
  }
};

module.exports = {
  getProductOptions,
  createProductOption,
  updateProductOption,
  toggleProductOptionStatus,
  deleteProductOption,
};
