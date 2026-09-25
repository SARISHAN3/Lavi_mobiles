const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
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

    price: {
      type: Number,
      required: true,
    },

    mrp: {
      type: Number,
      required: true,
    },

    discount: {
      type: Number,
      default: 0,
    },

    images: [
      {
        type: String,
      },
    ],

    description: {
      type: String,
      default: "",
    },

    highlights: [
      {
        type: String,
      },
    ],

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

    stock: {
      type: Number,
      default: 0,
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    reviewCount: {
      type: Number,
      default: 0,
    },

    category: {
      type: String,
      default: "Mobile Phones",
    },

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
