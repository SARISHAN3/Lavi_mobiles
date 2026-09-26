const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema(
  {
    store: {
      name: {
        type: String,
        default: "Lavi Mobile",
        trim: true,
      },
      email: {
        type: String,
        default: "",
        trim: true,
      },
      phone: {
        type: String,
        default: "",
        trim: true,
      },
      address: {
        type: String,
        default: "",
        trim: true,
      },
      city: {
        type: String,
        default: "",
        trim: true,
      },
      state: {
        type: String,
        default: "",
        trim: true,
      },
      pincode: {
        type: String,
        default: "",
        trim: true,
      },
    },

    notifications: {
      newOrder: {
        type: Boolean,
        default: true,
      },
      orderStatus: {
        type: Boolean,
        default: true,
      },
      lowStock: {
        type: Boolean,
        default: true,
      },
      newReview: {
        type: Boolean,
        default: true,
      },
      newUser: {
        type: Boolean,
        default: false,
      },
    },

    appearance: {
      theme: {
        type: String,
        enum: ["light", "dark"],
        default: "light",
      },
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Setting", settingSchema);
