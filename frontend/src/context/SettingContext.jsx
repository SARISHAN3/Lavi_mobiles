import { createContext, useContext, useState } from "react";

import { get, put, post } from "../services/api";

import ENDPOINTS from "../config/endpoints";

const SettingContext = createContext(null);

const defaultSettings = {
  store: {
    name: "Lavi Mobile",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  },
  notifications: {
    newOrder: true,
    orderStatus: true,
    lowStock: true,
    newReview: true,
    newUser: false,
  },
  appearance: {
    theme: "light",
  },
};

export const SettingProvider = ({ children }) => {
  const [settings, setSettings] = useState(defaultSettings);

  const [loading, setLoading] = useState(false);

  const fetchSettings = async () => {
    try {
      setLoading(true);

      const data = await get(ENDPOINTS.SETTINGS.GET);

      if (data?.success && data.settings) {
        setSettings(data.settings);

        return data.settings;
      }

      return null;
    } catch (error) {
      console.error("Fetch settings error:", error);

      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (settingsData) => {
    try {
      setLoading(true);

      const data = await put(ENDPOINTS.SETTINGS.UPDATE, settingsData);

      if (data?.success && data.settings) {
        setSettings(data.settings);

        return data.settings;
      }

      return null;
    } catch (error) {
      console.error("Update settings error:", error);

      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetSettings = async () => {
    try {
      setLoading(true);

      const data = await post(ENDPOINTS.SETTINGS.RESET);

      if (data?.success && data.settings) {
        setSettings(data.settings);

        return data.settings;
      }

      return null;
    } catch (error) {
      console.error("Reset settings error:", error);

      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateStoreSettings = async (storeData) => {
    const updatedSettings = {
      ...settings,
      store: {
        ...settings.store,
        ...storeData,
      },
    };

    return updateSettings(updatedSettings);
  };

  const updateNotificationSettings = async (notificationData) => {
    const updatedSettings = {
      ...settings,
      notifications: {
        ...settings.notifications,
        ...notificationData,
      },
    };

    return updateSettings(updatedSettings);
  };

  const updateAppearanceSettings = async (appearanceData) => {
    const updatedSettings = {
      ...settings,
      appearance: {
        ...settings.appearance,
        ...appearanceData,
      },
    };

    return updateSettings(updatedSettings);
  };

  const clearSettings = () => {
    setSettings(defaultSettings);
  };

  const value = {
    settings,
    loading,

    fetchSettings,
    updateSettings,
    resetSettings,

    updateStoreSettings,
    updateNotificationSettings,
    updateAppearanceSettings,

    clearSettings,
  };

  return (
    <SettingContext.Provider value={value}>{children}</SettingContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingContext);

  if (!context) {
    throw new Error("useSettings must be used inside SettingProvider");
  }

  return context;
};

export default SettingContext;
