import { createContext, useContext, useEffect, useState } from "react";

import { get, post, put } from "../services/api";

import ENDPOINTS from "../config/endpoints";
import { useAuth } from "./AuthContext";

const OrderContext = createContext(null);

export const OrderProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMyOrders = async () => {
    if (!isAuthenticated) {
      setOrders([]);
      return [];
    }

    try {
      setLoading(true);

      const data = await get(ENDPOINTS.ORDERS.MY_ORDERS);

      if (data?.success) {
        const orderList = Array.isArray(data.orders) ? data.orders : [];

        setOrders(orderList);

        return orderList;
      }

      return [];
    } catch (error) {
      console.error("Fetch orders error:", error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchMyOrders();
    } else {
      setOrders([]);
    }
  }, [isAuthenticated]);

  const createOrder = async (orderData) => {
    try {
      setLoading(true);

      const data = await post(ENDPOINTS.ORDERS.CREATE, orderData);

      if (data?.success) {
        await fetchMyOrders();
      }

      return data;
    } catch (error) {
      console.error("Create order error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getOrderById = async (orderId) => {
    try {
      setLoading(true);

      const data = await get(ENDPOINTS.ORDERS.MY_ORDER(orderId));

      if (data?.success) {
        return data.order || null;
      }

      return null;
    } catch (error) {
      console.error("Get order error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      setLoading(true);

      const data = await put(ENDPOINTS.ORDERS.CANCEL_MY_ORDER(orderId));

      if (data?.success) {
        await fetchMyOrders();
      }

      return data;
    } catch (error) {
      console.error("Cancel order error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getOrderStatusLabel = (status) => {
    const statusLabels = {
      Pending: "Order Placed",
      Confirmed: "Confirmed",
      Processing: "Processing",
      Shipped: "Shipped",
      Delivered: "Delivered",
      Cancelled: "Cancelled",
    };

    return statusLabels[status] || status;
  };

  const value = {
    orders,
    loading,
    fetchMyOrders,
    createOrder,
    getOrderById,
    cancelOrder,
    getOrderStatusLabel,
  };

  return (
    <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);

  if (!context) {
    throw new Error("useOrders must be used inside OrderProvider");
  }

  return context;
};

export default OrderContext;
