import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  MdStore,
  MdPerson,
  MdNotifications,
  MdSecurity,
  MdPalette,
  MdSave,
  MdVisibility,
  MdVisibilityOff,
  MdCheckCircle,
} from "react-icons/md";

/* =========================================================
   INPUT FIELD
========================================================= */

const InputField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
      />
    </div>
  );
};

/* =========================================================
   SAVE BUTTON
========================================================= */

const SaveButton = ({ onClick, saving, loading }) => {
  return (
    <div className="flex justify-end mt-6">
      <button
        type="button"
        onClick={onClick}
        disabled={saving || loading}
        className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <MdSave size={19} />

        {saving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
};

/* =========================================================
   TOGGLE
========================================================= */

const Toggle = ({ label, description, name, value, onChange }) => {
  return (
    <div className="flex items-center justify-between gap-4 py-4 border-b border-gray-100 last:border-b-0">
      <div>
        <h4 className="text-sm font-semibold text-gray-800">{label}</h4>

        <p className="text-xs text-gray-500 mt-1">{description}</p>
      </div>

      <button
        type="button"
        onClick={() => onChange(name)}
        className={`relative w-12 h-6 rounded-full transition ${
          value ? "bg-orange-500" : "bg-gray-300"
        }`}
      >
        <span
          className={`absolute top-1 w-4 h-4 bg-white rounded-full transition ${
            value ? "left-7" : "left-1"
          }`}
        />
      </button>
    </div>
  );
};

/* =========================================================
   ADMIN SETTINGS
========================================================= */

const AdminSettings = () => {
  const [activeSection, setActiveSection] = useState("store");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);

  const [message, setMessage] = useState("");

  /* =====================================================
     SETTINGS STATE
  ===================================================== */

  const [settings, setSettings] = useState({
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
  });

  /* =====================================================
     ADMIN PROFILE
  ===================================================== */

  const [adminProfile, setAdminProfile] = useState({
    name: "",
    email: "",
    phone: "",
  });

  /* =====================================================
     PASSWORD
  ===================================================== */

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  /* =====================================================
     AUTH HEADERS
  ===================================================== */

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");

    return {
      Authorization: `Bearer ${token}`,
    };
  };

  /* =====================================================
     INITIAL LOAD
  ===================================================== */

  useEffect(() => {
    fetchSettings();
    fetchAdminProfile();
  }, []);

  /* =====================================================
     FETCH SETTINGS
  ===================================================== */

  const fetchSettings = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/settings", {
        headers: getAuthHeaders(),
      });

      const data = response.data;

      setSettings({
        store: {
          name: data?.store?.name || "Lavi Mobile",
          email: data?.store?.email || "",
          phone: data?.store?.phone || "",
          address: data?.store?.address || "",
          city: data?.store?.city || "",
          state: data?.store?.state || "",
          pincode: data?.store?.pincode || "",
        },

        notifications: {
          newOrder: data?.notifications?.newOrder ?? true,

          orderStatus: data?.notifications?.orderStatus ?? true,

          lowStock: data?.notifications?.lowStock ?? true,

          newReview: data?.notifications?.newReview ?? true,

          newUser: data?.notifications?.newUser ?? false,
        },

        appearance: {
          theme: data?.appearance?.theme || "light",
        },
      });
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     FETCH ADMIN PROFILE
  ===================================================== */

  const fetchAdminProfile = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/users/profile",
        {
          headers: getAuthHeaders(),
        },
      );

      const data = response.data;

      const user = data?.user || data;

      setAdminProfile({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
      });
    } catch (error) {
      console.error("Error fetching admin profile:", error);
    }
  };

  /* =====================================================
     STORE CHANGE
  ===================================================== */

  const handleStoreChange = (event) => {
    const { name, value } = event.target;

    setSettings((previous) => ({
      ...previous,

      store: {
        ...previous.store,
        [name]: value,
      },
    }));
  };

  /* =====================================================
     NOTIFICATION CHANGE
  ===================================================== */

  const handleNotificationChange = (name) => {
    setSettings((previous) => ({
      ...previous,

      notifications: {
        ...previous.notifications,

        [name]: !previous.notifications[name],
      },
    }));
  };

  /* =====================================================
     APPEARANCE
  ===================================================== */

  const handleAppearanceChange = (theme) => {
    setSettings((previous) => ({
      ...previous,

      appearance: {
        ...previous.appearance,
        theme,
      },
    }));
  };

  /* =====================================================
     ADMIN PROFILE CHANGE
  ===================================================== */

  const handleAdminProfileChange = (event) => {
    const { name, value } = event.target;

    setAdminProfile((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* =====================================================
     PASSWORD CHANGE
  ===================================================== */

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;

    setPasswordData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* =====================================================
     SAVE SETTINGS
  ===================================================== */

  const saveSettings = async () => {
    try {
      setSaving(true);
      setMessage("");

      await axios.put("http://localhost:5000/api/settings", settings, {
        headers: getAuthHeaders(),
      });

      await axios.put(
        "http://localhost:5000/api/users/profile",
        {
          name: adminProfile.name,
          phone: adminProfile.phone,
        },
        {
          headers: getAuthHeaders(),
        },
      );

      setMessage("Settings saved successfully.");

      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error saving settings:", error);

      setMessage(error.response?.data?.message || "Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  /* =====================================================
     MENU
  ===================================================== */

  const settingsMenu = [
    {
      id: "store",
      label: "Store Settings",
      icon: MdStore,
    },
    {
      id: "profile",
      label: "Admin Profile",
      icon: MdPerson,
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: MdNotifications,
    },
    {
      id: "security",
      label: "Security",
      icon: MdSecurity,
    },
    {
      id: "appearance",
      label: "Appearance",
      icon: MdPalette,
    },
  ];

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-sm text-gray-500">Loading settings...</p>
        </div>
      </div>
    );
  }

  /* =====================================================
     UI
  ===================================================== */

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 p-4 md:p-6">
      {/* Header */}

      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Settings
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Manage your store, profile, notifications and preferences.
        </p>
      </div>

      {/* Message */}

      {message && (
        <div className="mb-5 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          <MdCheckCircle size={20} />

          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">
        {/* =================================================
            SETTINGS MENU
        ================================================= */}

        <div className="bg-white rounded-2xl border border-gray-200 p-3 h-fit">
          {settingsMenu.map((item) => {
            const Icon = item.icon;

            const active = activeSection === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition mb-1 ${
                  active
                    ? "bg-orange-50 text-orange-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Icon size={20} />

                {item.label}
              </button>
            );
          })}
        </div>

        {/* =================================================
            CONTENT
        ================================================= */}

        <div className="space-y-6">
          {/* =================================================
              STORE
          ================================================= */}

          {activeSection === "store" && (
            <div className="bg-white rounded-2xl border border-gray-200 p-5 md:p-6">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-900">
                  Store Settings
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Update your Lavi Mobile store information.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InputField
                  label="Store Name"
                  name="name"
                  value={settings.store.name}
                  onChange={handleStoreChange}
                />

                <InputField
                  label="Store Email"
                  name="email"
                  value={settings.store.email}
                  onChange={handleStoreChange}
                  type="email"
                />

                <InputField
                  label="Phone Number"
                  name="phone"
                  value={settings.store.phone}
                  onChange={handleStoreChange}
                />

                <InputField
                  label="Address"
                  name="address"
                  value={settings.store.address}
                  onChange={handleStoreChange}
                />

                <InputField
                  label="City"
                  name="city"
                  value={settings.store.city}
                  onChange={handleStoreChange}
                />

                <InputField
                  label="State"
                  name="state"
                  value={settings.store.state}
                  onChange={handleStoreChange}
                />

                <InputField
                  label="Pincode"
                  name="pincode"
                  value={settings.store.pincode}
                  onChange={handleStoreChange}
                />
              </div>

              <SaveButton
                onClick={saveSettings}
                saving={saving}
                loading={loading}
              />
            </div>
          )}

          {/* =================================================
              PROFILE
          ================================================= */}

          {activeSection === "profile" && (
            <div className="bg-white rounded-2xl border border-gray-200 p-5 md:p-6">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-900">
                  Admin Profile
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Manage your administrator account information.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InputField
                  label="Name"
                  name="name"
                  value={adminProfile.name}
                  onChange={handleAdminProfileChange}
                />

                <InputField
                  label="Email"
                  name="email"
                  value={adminProfile.email}
                  onChange={handleAdminProfileChange}
                  type="email"
                />

                <InputField
                  label="Phone"
                  name="phone"
                  value={adminProfile.phone}
                  onChange={handleAdminProfileChange}
                />
              </div>

              <SaveButton
                onClick={saveSettings}
                saving={saving}
                loading={loading}
              />
            </div>
          )}

          {/* =================================================
              NOTIFICATIONS
          ================================================= */}

          {activeSection === "notifications" && (
            <div className="bg-white rounded-2xl border border-gray-200 p-5 md:p-6">
              <div className="mb-4">
                <h2 className="text-lg font-bold text-gray-900">
                  Notifications
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Choose which notifications you want to receive.
                </p>
              </div>

              <Toggle
                name="newOrder"
                label="New Orders"
                description="Get notified when a new order is placed."
                value={settings.notifications.newOrder}
                onChange={handleNotificationChange}
              />

              <Toggle
                name="orderStatus"
                label="Order Status"
                description="Receive updates when an order status changes."
                value={settings.notifications.orderStatus}
                onChange={handleNotificationChange}
              />

              <Toggle
                name="lowStock"
                label="Low Stock"
                description="Get notified when products reach the low-stock limit."
                value={settings.notifications.lowStock}
                onChange={handleNotificationChange}
              />

              <Toggle
                name="newReview"
                label="New Reviews"
                description="Receive notifications when customers submit reviews."
                value={settings.notifications.newReview}
                onChange={handleNotificationChange}
              />

              <Toggle
                name="newUser"
                label="New Users"
                description="Get notified when a new customer registers."
                value={settings.notifications.newUser}
                onChange={handleNotificationChange}
              />

              <SaveButton
                onClick={saveSettings}
                saving={saving}
                loading={loading}
              />
            </div>
          )}

          {/* =================================================
              SECURITY
          ================================================= */}

          {activeSection === "security" && (
            <div className="bg-white rounded-2xl border border-gray-200 p-5 md:p-6">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-900">Security</h2>

                <p className="text-sm text-gray-500 mt-1">
                  Manage your administrator password.
                </p>
              </div>

              <div className="space-y-5">
                <div className="relative">
                  <InputField
                    label="Current Password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    type={showCurrentPassword ? "text" : "password"}
                  />

                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 bottom-3 text-gray-500 hover:text-orange-500"
                  >
                    {showCurrentPassword ? (
                      <MdVisibilityOff size={20} />
                    ) : (
                      <MdVisibility size={20} />
                    )}
                  </button>
                </div>

                <InputField
                  label="New Password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  type="password"
                />

                <InputField
                  label="Confirm New Password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  type="password"
                />
              </div>

              <SaveButton
                onClick={saveSettings}
                saving={saving}
                loading={loading}
              />
            </div>
          )}

          {/* =================================================
              APPEARANCE
          ================================================= */}

          {activeSection === "appearance" && (
            <div className="bg-white rounded-2xl border border-gray-200 p-5 md:p-6">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-900">Appearance</h2>

                <p className="text-sm text-gray-500 mt-1">
                  Choose your preferred admin panel theme.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Light */}

                <button
                  type="button"
                  onClick={() => handleAppearanceChange("light")}
                  className={`rounded-2xl border-2 p-4 text-left transition ${
                    settings.appearance.theme === "light"
                      ? "border-orange-500"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="h-28 rounded-xl bg-gray-100 p-4">
                    <div className="h-3 w-20 bg-white rounded mb-3" />

                    <div className="h-16 bg-white rounded-xl" />
                  </div>

                  <p className="mt-3 text-sm font-semibold text-gray-800">
                    Light Mode
                  </p>
                </button>

                {/* Dark */}

                <button
                  type="button"
                  onClick={() => handleAppearanceChange("dark")}
                  className={`rounded-2xl border-2 p-4 text-left transition ${
                    settings.appearance.theme === "dark"
                      ? "border-orange-500"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="h-28 rounded-xl bg-gray-900 p-4">
                    <div className="h-3 w-20 bg-gray-700 rounded mb-3" />

                    <div className="h-16 bg-gray-800 rounded-xl" />
                  </div>

                  <p className="mt-3 text-sm font-semibold text-gray-800">
                    Dark Mode
                  </p>
                </button>
              </div>

              <SaveButton
                onClick={saveSettings}
                saving={saving}
                loading={loading}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
