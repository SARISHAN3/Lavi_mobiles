import { createContext, useContext, useState } from "react";

import { get, post, put, remove } from "../services/api";

import ENDPOINTS from "../config/endpoints";

const BrandContext = createContext(null);

export const BrandProvider = ({ children }) => {
  const [brands, setBrands] = useState([]);
  const [brand, setBrand] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchBrands = async (params = {}) => {
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
        ? `${ENDPOINTS.BRANDS.ALL}?${queryString}`
        : ENDPOINTS.BRANDS.ALL;

      const data = await get(endpoint);

      if (data?.success) {
        const brandList = Array.isArray(data.brands) ? data.brands : [];

        setBrands(brandList);

        return data;
      }

      return null;
    } catch (error) {
      console.error("Fetch brands error:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchActiveBrands = async () => {
    try {
      setLoading(true);

      const data = await get(ENDPOINTS.BRANDS.ACTIVE);

      if (data?.success) {
        const brandList = Array.isArray(data.brands) ? data.brands : [];

        setBrands(brandList);

        return brandList;
      }

      return [];
    } catch (error) {
      console.error("Fetch active brands error:", error);

      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchBrandById = async (brandId) => {
    try {
      setLoading(true);

      const data = await get(ENDPOINTS.BRANDS.BY_ID(brandId));

      if (data?.success && data.brand) {
        setBrand(data.brand);
        return data.brand;
      }

      setBrand(null);

      return null;
    } catch (error) {
      console.error("Fetch brand by ID error:", error);

      setBrand(null);

      return null;
    } finally {
      setLoading(false);
    }
  };

  const createBrand = async (brandData) => {
    try {
      setLoading(true);

      const data = await post(ENDPOINTS.BRANDS.CREATE, brandData);

      if (data?.success && data.brand) {
        setBrands((currentBrands) => [data.brand, ...currentBrands]);
      }

      return data;
    } catch (error) {
      console.error("Create brand error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateBrand = async (brandId, brandData) => {
    try {
      setLoading(true);

      const data = await put(ENDPOINTS.BRANDS.UPDATE(brandId), brandData);

      if (data?.success && data.brand) {
        setBrand(data.brand);

        setBrands((currentBrands) =>
          currentBrands.map((item) =>
            String(item._id) === String(brandId) ? data.brand : item,
          ),
        );
      }

      return data;
    } catch (error) {
      console.error("Update brand error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateBrandStatus = async (brandId, isActive) => {
    try {
      setLoading(true);

      const data = await put(ENDPOINTS.BRANDS.STATUS(brandId), {
        isActive,
      });

      if (data?.success && data.brand) {
        setBrands((currentBrands) =>
          currentBrands.map((item) =>
            String(item._id) === String(brandId) ? data.brand : item,
          ),
        );

        if (brand && String(brand._id) === String(brandId)) {
          setBrand(data.brand);
        }
      }

      return data;
    } catch (error) {
      console.error("Update brand status error:", error);

      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteBrand = async (brandId) => {
    try {
      setLoading(true);

      const data = await remove(ENDPOINTS.BRANDS.DELETE(brandId));

      if (data?.success) {
        setBrands((currentBrands) =>
          currentBrands.filter((item) => String(item._id) !== String(brandId)),
        );

        if (brand && String(brand._id) === String(brandId)) {
          setBrand(null);
        }
      }

      return data;
    } catch (error) {
      console.error("Delete brand error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearBrand = () => {
    setBrand(null);
  };

  const value = {
    brands,
    brand,
    loading,

    fetchBrands,
    fetchActiveBrands,
    fetchBrandById,

    createBrand,
    updateBrand,
    updateBrandStatus,
    deleteBrand,

    clearBrand,
  };

  return (
    <BrandContext.Provider value={value}>{children}</BrandContext.Provider>
  );
};

export const useBrands = () => {
  const context = useContext(BrandContext);

  if (!context) {
    throw new Error("useBrands must be used inside BrandProvider");
  }

  return context;
};

export default BrandContext;
