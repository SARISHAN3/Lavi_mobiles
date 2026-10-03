import { createContext, useContext, useState } from "react";

import { get, post, put, remove } from "../services/api";

import ENDPOINTS from "../config/endpoints";

const CouponContext = createContext(null);

export const CouponProvider = ({ children }) => {
  const [coupons, setCoupons] = useState([]);
  const [coupon, setCoupon] = useState(null);
  const [loading, setLoading] = useState(false);

  const [validatedCoupon, setValidatedCoupon] = useState(null);

  const fetchCoupons = async (params = {}) => {
    try {
      setLoading(true);

      const searchParams = new URLSearchParams();

      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          searchParams.append(key, value);
        }
      });

      const queryString = searchParams.toString();

      const endpoint = queryString
        ? `${ENDPOINTS.COUPONS.ALL}?${queryString}`
        : ENDPOINTS.COUPONS.ALL;

      const data = await get(endpoint);

      if (data?.success) {
        const couponList = Array.isArray(data.coupons) ? data.coupons : [];

        setCoupons(couponList);

        return data;
      }

      return null;
    } catch (error) {
      console.error("Fetch coupons error:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchCouponById = async (couponId) => {
    try {
      setLoading(true);

      const data = await get(ENDPOINTS.COUPONS.BY_ID(couponId));

      if (data?.success && data.coupon) {
        setCoupon(data.coupon);

        return data.coupon;
      }

      setCoupon(null);

      return null;
    } catch (error) {
      console.error("Fetch coupon by ID error:", error);

      setCoupon(null);

      return null;
    } finally {
      setLoading(false);
    }
  };

  const createCoupon = async (couponData) => {
    try {
      setLoading(true);

      const data = await post(ENDPOINTS.COUPONS.CREATE, couponData);

      if (data?.success && data.coupon) {
        setCoupons((currentCoupons) => [data.coupon, ...currentCoupons]);
      }

      return data;
    } catch (error) {
      console.error("Create coupon error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateCoupon = async (couponId, couponData) => {
    try {
      setLoading(true);

      const data = await put(ENDPOINTS.COUPONS.UPDATE(couponId), couponData);

      if (data?.success && data.coupon) {
        setCoupon(data.coupon);

        setCoupons((currentCoupons) =>
          currentCoupons.map((item) =>
            String(item._id) === String(couponId) ? data.coupon : item,
          ),
        );
      }

      return data;
    } catch (error) {
      console.error("Update coupon error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateCouponStatus = async (couponId, isActive) => {
    try {
      setLoading(true);

      const data = await put(ENDPOINTS.COUPONS.STATUS(couponId), {
        isActive,
      });

      if (data?.success && data.coupon) {
        setCoupons((currentCoupons) =>
          currentCoupons.map((item) =>
            String(item._id) === String(couponId) ? data.coupon : item,
          ),
        );

        if (coupon && String(coupon._id) === String(couponId)) {
          setCoupon(data.coupon);
        }
      }

      return data;
    } catch (error) {
      console.error("Update coupon status error:", error);

      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteCoupon = async (couponId) => {
    try {
      setLoading(true);

      const data = await remove(ENDPOINTS.COUPONS.DELETE(couponId));

      if (data?.success) {
        setCoupons((currentCoupons) =>
          currentCoupons.filter(
            (item) => String(item._id) !== String(couponId),
          ),
        );

        if (coupon && String(coupon._id) === String(couponId)) {
          setCoupon(null);
        }
      }

      return data;
    } catch (error) {
      console.error("Delete coupon error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const validateCoupon = async (code, orderAmount) => {
    try {
      setLoading(true);

      const data = await post(ENDPOINTS.COUPONS.VALIDATE, {
        code,
        orderAmount,
      });

      if (data?.success) {
        setValidatedCoupon(data.coupon || data);

        return data;
      }

      setValidatedCoupon(null);

      return data;
    } catch (error) {
      console.error("Validate coupon error:", error);

      setValidatedCoupon(null);

      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearValidatedCoupon = () => {
    setValidatedCoupon(null);
  };

  const clearCoupon = () => {
    setCoupon(null);
  };

  const value = {
    coupons,
    coupon,
    validatedCoupon,
    loading,

    fetchCoupons,
    fetchCouponById,

    createCoupon,
    updateCoupon,
    updateCouponStatus,
    deleteCoupon,

    validateCoupon,
    clearValidatedCoupon,
    clearCoupon,
  };

  return (
    <CouponContext.Provider value={value}>{children}</CouponContext.Provider>
  );
};

export const useCoupons = () => {
  const context = useContext(CouponContext);

  if (!context) {
    throw new Error("useCoupons must be used inside CouponProvider");
  }

  return context;
};

export default CouponContext;
