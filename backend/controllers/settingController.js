const Setting = require("../models/Setting");

const getSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();

    if (!settings) {
      settings = await Setting.create({});
    }

    res.json(settings);
  } catch (error) {
    console.error("Get settings error:", error);

    res.status(500).json({
      message: "Failed to get settings",
      error: error.message,
    });
  }
};

const updateSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();

    if (!settings) {
      settings = new Setting();
    }

    const { store, notifications, appearance } = req.body;

    if (store) {
      settings.store = {
        ...settings.store.toObject(),
        ...store,
      };
    }

    if (notifications) {
      settings.notifications = {
        ...settings.notifications.toObject(),
        ...notifications,
      };
    }

    if (appearance) {
      settings.appearance = {
        ...settings.appearance.toObject(),
        ...appearance,
      };
    }

    await settings.save();

    res.json({
      message: "Settings updated successfully",
      settings,
    });
  } catch (error) {
    console.error("Update settings error:", error);

    res.status(500).json({
      message: "Failed to update settings",
      error: error.message,
    });
  }
};

module.exports = {
  getSettings,
  updateSettings,
};
