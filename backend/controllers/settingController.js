const Setting = require("../models/Setting");

// =====================================
// GET SETTINGS - ADMIN
// =====================================
const getSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();

    // Create default settings if none exist
    if (!settings) {
      settings = await Setting.create({});
    }

    res.json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error("Get settings error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load settings",
      error: error.message,
    });
  }
};

// =====================================
// UPDATE SETTINGS - ADMIN
// =====================================
const updateSettings = async (req, res) => {
  try {
    const { store, notifications, appearance } = req.body;

    let settings = await Setting.findOne();

    if (!settings) {
      settings = new Setting({});
    }

    // ---------------------------------
    // STORE SETTINGS
    // ---------------------------------
    if (store) {
      if (store.name !== undefined) {
        settings.store.name = String(store.name).trim();
      }

      if (store.email !== undefined) {
        settings.store.email = String(store.email).trim();
      }

      if (store.phone !== undefined) {
        settings.store.phone = String(store.phone).trim();
      }

      if (store.address !== undefined) {
        settings.store.address = String(store.address).trim();
      }

      if (store.city !== undefined) {
        settings.store.city = String(store.city).trim();
      }

      if (store.state !== undefined) {
        settings.store.state = String(store.state).trim();
      }

      if (store.pincode !== undefined) {
        settings.store.pincode = String(store.pincode).trim();
      }
    }

    // ---------------------------------
    // NOTIFICATION SETTINGS
    // ---------------------------------
    if (notifications) {
      if (notifications.newOrder !== undefined) {
        settings.notifications.newOrder = Boolean(notifications.newOrder);
      }

      if (notifications.orderStatus !== undefined) {
        settings.notifications.orderStatus = Boolean(notifications.orderStatus);
      }

      if (notifications.lowStock !== undefined) {
        settings.notifications.lowStock = Boolean(notifications.lowStock);
      }

      if (notifications.newReview !== undefined) {
        settings.notifications.newReview = Boolean(notifications.newReview);
      }

      if (notifications.newUser !== undefined) {
        settings.notifications.newUser = Boolean(notifications.newUser);
      }
    }

    // ---------------------------------
    // APPEARANCE SETTINGS
    // ---------------------------------
    if (appearance) {
      if (appearance.theme !== undefined) {
        if (!["light", "dark"].includes(appearance.theme)) {
          return res.status(400).json({
            success: false,
            message: "Theme must be light or dark",
          });
        }

        settings.appearance.theme = appearance.theme;
      }
    }

    await settings.save();

    res.json({
      success: true,
      message: "Settings updated successfully",
      settings,
    });
  } catch (error) {
    console.error("Update settings error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update settings",
      error: error.message,
    });
  }
};

// =====================================
// RESET SETTINGS - ADMIN
// =====================================
const resetSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();

    if (!settings) {
      settings = await Setting.create({});
    } else {
      settings.store = {
        name: "Lavi Mobile",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
      };

      settings.notifications = {
        newOrder: true,
        orderStatus: true,
        lowStock: true,
        newReview: true,
        newUser: false,
      };

      settings.appearance = {
        theme: "light",
      };

      await settings.save();
    }

    res.json({
      success: true,
      message: "Settings reset successfully",
      settings,
    });
  } catch (error) {
    console.error("Reset settings error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to reset settings",
      error: error.message,
    });
  }
};

module.exports = {
  getSettings,
  updateSettings,
  resetSettings,
};
