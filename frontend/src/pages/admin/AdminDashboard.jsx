import { useEffect, useState } from "react";
import axios from "axios";

import {
  MdPeople,
  MdInventory2,
  MdShoppingBag,
  MdCategory,
  MdBrandingWatermark,
  MdCurrencyRupee,
  MdTrendingUp,
  MdRefresh,
  MdArrowForward,
} from "react-icons/md";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getDashboardStats = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/dashboard/stats",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setStats(response.data);
    } catch (error) {
      console.error(
        "Failed to load dashboard stats:",
        error.response?.data || error.message,
      );

      setError("Failed to load dashboard statistics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDashboardStats();
  }, []);

  const formatNumber = (value) => {
    return Number(value || 0).toLocaleString("en-IN");
  };

  const formatCurrency = (value) => {
    return `₹${Number(value || 0).toLocaleString("en-IN")}`;
  };

  const getTodayDate = () => {
    return new Date().toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex flex-col gap-2">
          <div className="h-8 w-48 bg-gray-200 rounded-lg"></div>
          <div className="h-4 w-72 bg-gray-200 rounded-lg"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border border-gray-100 p-6"
            >
              <div className="flex justify-between">
                <div>
                  <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  <div className="h-8 w-28 bg-gray-200 rounded mt-4"></div>
                </div>

                <div className="h-11 w-11 bg-gray-200 rounded-xl"></div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border border-gray-100 p-6 h-40"
            >
              <div className="h-5 w-32 bg-gray-200 rounded"></div>
              <div className="h-9 w-24 bg-gray-200 rounded mt-5"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8 text-center max-w-md w-full">
          <div className="w-14 h-14 mx-auto rounded-full bg-red-50 flex items-center justify-center">
            <MdRefresh className="text-red-500 text-2xl" />
          </div>

          <h2 className="text-lg font-semibold text-gray-800 mt-4">
            Unable to load dashboard
          </h2>

          <p className="text-sm text-gray-500 mt-2">
            {error || "Dashboard statistics are unavailable."}
          </p>

          <button
            onClick={getDashboardStats}
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-medium transition"
          >
            <MdRefresh className="text-lg" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const mainCards = [
    {
      title: "Total Revenue",
      value: formatCurrency(stats.totalRevenue),
      description: "From delivered orders",
      icon: MdCurrencyRupee,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-500",
      valueColor: "text-orange-500",
    },
    {
      title: "Total Orders",
      value: formatNumber(stats.totalOrders),
      description: "Orders placed",
      icon: MdShoppingBag,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-500",
      valueColor: "text-gray-800",
    },
    {
      title: "Total Products",
      value: formatNumber(stats.totalProducts),
      description: "Products in store",
      icon: MdInventory2,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-500",
      valueColor: "text-gray-800",
    },
    {
      title: "Total Customers",
      value: formatNumber(stats.totalUsers),
      description: "Registered users",
      icon: MdPeople,
      iconBg: "bg-green-100",
      iconColor: "text-green-500",
      valueColor: "text-gray-800",
    },
  ];

  const secondaryCards = [
    {
      title: "Categories",
      value: formatNumber(stats.totalCategories),
      description: "Product categories",
      icon: MdCategory,
      iconBg: "bg-pink-100",
      iconColor: "text-pink-500",
    },
    {
      title: "Brands",
      value: formatNumber(stats.totalBrands),
      description: "Available brands",
      icon: MdBrandingWatermark,
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Dashboard
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Welcome back! Here is what's happening with Lavi Mobile today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <p className="text-xs text-gray-400">Today</p>

            <p className="text-sm font-medium text-gray-700">
              {getTodayDate()}
            </p>
          </div>

          <button
            onClick={getDashboardStats}
            className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:text-orange-500 hover:border-orange-200 transition"
            title="Refresh dashboard"
          >
            <MdRefresh className="text-xl" />
          </button>
        </div>
      </div>

      {/* Main Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {mainCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">
                    {card.title}
                  </p>

                  <h2
                    className={`text-2xl sm:text-3xl font-bold mt-3 ${card.valueColor}`}
                  >
                    {card.value}
                  </h2>
                </div>

                <div
                  className={`w-11 h-11 rounded-xl ${card.iconBg} ${card.iconColor} flex items-center justify-center`}
                >
                  <Icon className="text-xl" />
                </div>
              </div>

              <div className="flex items-center gap-1.5 mt-5">
                <MdTrendingUp className="text-green-500 text-base" />

                <span className="text-xs text-gray-500">
                  {card.description}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Revenue Highlight */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-orange-100 flex items-center justify-center">
                  <MdCurrencyRupee className="text-orange-500 text-xl" />
                </div>

                <h2 className="text-lg font-semibold text-gray-800">
                  Delivered Revenue
                </h2>
              </div>

              <p className="text-sm text-gray-500 mt-2">
                Total revenue generated from successfully delivered orders.
              </p>
            </div>

            <div className="text-left sm:text-right">
              <p className="text-3xl font-bold text-orange-500">
                {formatCurrency(stats.totalRevenue)}
              </p>

              <p className="text-xs text-gray-400 mt-1">
                Delivered orders only
              </p>
            </div>
          </div>

          <div className="mt-6 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-orange-500 rounded-full w-full"></div>
          </div>
        </div>
      </div>

      {/* Secondary Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {secondaryCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl ${card.iconBg} ${card.iconColor} flex items-center justify-center`}
                  >
                    <Icon className="text-2xl" />
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">{card.title}</p>

                    <h2 className="text-2xl font-bold text-gray-800 mt-1">
                      {card.value}
                    </h2>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs text-gray-400">{card.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Store Overview
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Current store statistics
              </p>
            </div>

            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
              <MdTrendingUp className="text-orange-500 text-xl" />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500">Users</p>

              <p className="text-xl font-bold text-gray-800 mt-2">
                {formatNumber(stats.totalUsers)}
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500">Products</p>

              <p className="text-xl font-bold text-gray-800 mt-2">
                {formatNumber(stats.totalProducts)}
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500">Orders</p>

              <p className="text-xl font-bold text-gray-800 mt-2">
                {formatNumber(stats.totalOrders)}
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500">Revenue</p>

              <p className="text-xl font-bold text-orange-500 mt-2">
                {formatCurrency(stats.totalRevenue)}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Action */}
        <div className="bg-orange-500 rounded-2xl shadow-sm p-6 text-white flex flex-col justify-between">
          <div>
            <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center">
              <MdInventory2 className="text-2xl" />
            </div>

            <h2 className="text-xl font-semibold mt-5">Manage Your Store</h2>

            <p className="text-sm text-orange-100 mt-2 leading-6">
              Manage products, orders, customers and other store information
              from the admin panel.
            </p>
          </div>

          <button
            onClick={() => {
              window.location.href = "/admin/products";
            }}
            className="mt-6 w-full flex items-center justify-center gap-2 bg-white text-orange-500 hover:bg-orange-50 rounded-xl py-3 text-sm font-semibold transition"
          >
            Manage Products
            <MdArrowForward className="text-lg" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
