const mongoose = require("mongoose");

const productOptionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: [
        "name",
        "model",
        "ram",
        "storage",
        "operatingSystem",
        "network",
        "screenSize",
        "battery",
        "processor",
        "camera",
        "connectivity",
        "compatibility",
        "waterResistance",
        "batteryLife",
        "color",
      ],
      trim: true,
    },

    value: {
      type: String,
      required: true,
      trim: true,
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

// Prevent duplicate option values for the same option type
productOptionSchema.index({ type: 1, value: 1 }, { unique: true });

module.exports = mongoose.model("ProductOption", productOptionSchema);
