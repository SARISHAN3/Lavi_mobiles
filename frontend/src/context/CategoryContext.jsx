import { createContext, useContext, useState } from "react";

import { get, post, put, remove } from "../services/api";

import ENDPOINTS from "../config/endpoints";

const CategoryContext = createContext(null);

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async (params = {}) => {
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
        ? `${ENDPOINTS.CATEGORIES.ALL}?${queryString}`
        : ENDPOINTS.CATEGORIES.ALL;

      const data = await get(endpoint);

      if (data?.success) {
        const categoryList = Array.isArray(data.categories)
          ? data.categories
          : [];

        setCategories(categoryList);

        return data;
      }

      return null;
    } catch (error) {
      console.error("Fetch categories error:", error);

      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchActiveCategories = async () => {
    try {
      setLoading(true);

      const data = await get(ENDPOINTS.CATEGORIES.ACTIVE);

      if (data?.success) {
        const categoryList = Array.isArray(data.categories)
          ? data.categories
          : [];

        setCategories(categoryList);

        return categoryList;
      }

      return [];
    } catch (error) {
      console.error("Fetch active categories error:", error);

      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoryById = async (categoryId) => {
    try {
      setLoading(true);

      const data = await get(ENDPOINTS.CATEGORIES.BY_ID(categoryId));

      if (data?.success && data.category) {
        setCategory(data.category);
        return data.category;
      }

      setCategory(null);

      return null;
    } catch (error) {
      console.error("Fetch category by ID error:", error);

      setCategory(null);

      return null;
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (categoryData) => {
    try {
      setLoading(true);

      const data = await post(ENDPOINTS.CATEGORIES.CREATE, categoryData);

      if (data?.success && data.category) {
        setCategories((currentCategories) => [
          data.category,
          ...currentCategories,
        ]);
      }

      return data;
    } catch (error) {
      console.error("Create category error:", error);

      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateCategory = async (categoryId, categoryData) => {
    try {
      setLoading(true);

      const data = await put(
        ENDPOINTS.CATEGORIES.UPDATE(categoryId),
        categoryData,
      );

      if (data?.success && data.category) {
        setCategory(data.category);

        setCategories((currentCategories) =>
          currentCategories.map((item) =>
            String(item._id) === String(categoryId) ? data.category : item,
          ),
        );
      }

      return data;
    } catch (error) {
      console.error("Update category error:", error);

      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateCategoryStatus = async (categoryId, isActive) => {
    try {
      setLoading(true);

      const data = await put(ENDPOINTS.CATEGORIES.STATUS(categoryId), {
        isActive,
      });

      if (data?.success && data.category) {
        setCategories((currentCategories) =>
          currentCategories.map((item) =>
            String(item._id) === String(categoryId) ? data.category : item,
          ),
        );

        if (category && String(category._id) === String(categoryId)) {
          setCategory(data.category);
        }
      }

      return data;
    } catch (error) {
      console.error("Update category status error:", error);

      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (categoryId) => {
    try {
      setLoading(true);

      const data = await remove(ENDPOINTS.CATEGORIES.DELETE(categoryId));

      if (data?.success) {
        setCategories((currentCategories) =>
          currentCategories.filter(
            (item) => String(item._id) !== String(categoryId),
          ),
        );

        if (category && String(category._id) === String(categoryId)) {
          setCategory(null);
        }
      }

      return data;
    } catch (error) {
      console.error("Delete category error:", error);

      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearCategory = () => {
    setCategory(null);
  };

  const value = {
    categories,
    category,
    loading,

    fetchCategories,
    fetchActiveCategories,
    fetchCategoryById,

    createCategory,
    updateCategory,
    updateCategoryStatus,
    deleteCategory,

    clearCategory,
  };

  return (
    <CategoryContext.Provider value={value}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategories = () => {
  const context = useContext(CategoryContext);

  if (!context) {
    throw new Error("useCategories must be used inside CategoryProvider");
  }

  return context;
};

export default CategoryContext;
