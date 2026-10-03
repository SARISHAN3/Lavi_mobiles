import { createContext, useContext, useState } from "react";

import { get } from "../services/api";
import ENDPOINTS from "../config/endpoints";

const DashboardContext = createContext(null);

export const DashboardProvider = ({ children }) => {
  const [dashboard, setDashboard] = useState({
    stats: {},
    today: {},
    recentOrders: [],
    lowStockProducts: [],
    recentProducts: [],
  });

  const [loading, setLoading] = useState(false);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const data = await get(ENDPOINTS.DASHBOARD.STATS);

      if (data?.success) {
        setDashboard({
          stats: data.stats || {},
          today: data.today || {},
          recentOrders: Array.isArray(data.recentOrders)
            ? data.recentOrders
            : [],
          lowStockProducts: Array.isArray(data.lowStockProducts)
            ? data.lowStockProducts
            : [],
          recentProducts: Array.isArray(data.recentProducts)
            ? data.recentProducts
            : [],
        });

        return data;
      }

      return null;
    } catch (error) {
      console.error("Fetch dashboard error:", error);

      return null;
    } finally {
      setLoading(false);
    }
  };

  const clearDashboard = () => {
    setDashboard({
      stats: {},
      today: {},
      recentOrders: [],
      lowStockProducts: [],
      recentProducts: [],
    });
  };

  const value = {
    dashboard,
    stats: dashboard.stats,
    today: dashboard.today,
    recentOrders: dashboard.recentOrders,
    lowStockProducts: dashboard.lowStockProducts,
    recentProducts: dashboard.recentProducts,
    loading,

    fetchDashboard,
    clearDashboard,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);

  if (!context) {
    throw new Error("useDashboard must be used inside DashboardProvider");
  }

  return context;
};

export default DashboardContext;
