const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    // Basic product information
    name: {
      type: String,
      required: true,
      trim: true,
    },

    brand: {
      type: String,
      required: true,
      trim: true,
    },

    model: {
      type: String,
      default: "",
      trim: true,
    },

    // Category
    category: {
      type: String,
      default: "Mobile Phones",
      trim: true,
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },

    // Pricing
    price: {
      type: Number,
      required: true,
      min: 0,
    },

    mrp: {
      type: Number,
      required: true,
      min: 0,
    },

    discount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Images
    images: [
      {
        type: String,
      },
    ],

    // Description
    description: {
      type: String,
      default: "",
    },

    highlights: [
      {
        type: String,
      },
    ],

    // Mobile / product specifications
    ram: {
      type: String,
      default: "",
    },

    storage: {
      type: String,
      default: "",
    },

    operatingSystem: {
      type: String,
      default: "",
    },

    network: {
      type: String,
      default: "5G",
    },

    screenSize: {
      type: String,
      default: "",
    },

    battery: {
      type: String,
      default: "",
    },

    processor: {
      type: String,
      default: "",
    },

    camera: {
      type: String,
      default: "",
    },

    colors: [
      {
        type: String,
      },
    ],

    // Smartwatch / accessory specifications
    connectivity: {
      type: String,
      default: "",
    },

    compatibility: {
      type: String,
      default: "",
    },

    waterResistance: {
      type: String,
      default: "",
    },

    batteryLife: {
      type: String,
      default: "",
    },

    // Stock
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },

    lowStockLimit: {
      type: Number,
      default: 5,
      min: 0,
    },

    // Reviews
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Product status
    isFeatured: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Product", productSchema);
