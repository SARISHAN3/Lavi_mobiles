import { createContext, useContext, useState } from "react";

import { get, postFormData, putFormData, put, remove } from "../services/api";

import ENDPOINTS from "../config/endpoints";

const ProductContext = createContext(null);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    limit: 12,
  });

  const [loading, setLoading] = useState(false);

  const fetchProducts = async (params = {}) => {
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
        ? `${ENDPOINTS.PRODUCTS.ALL}?${queryString}`
        : ENDPOINTS.PRODUCTS.ALL;

      const data = await get(endpoint);

      if (data?.success) {
        setProducts(Array.isArray(data.products) ? data.products : []);

        if (data.pagination) {
          setPagination(data.pagination);
        }

        return data;
      }

      return null;
    } catch (error) {
      console.error("Fetch products error:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchFeaturedProducts = async (limit = 8) => {
    try {
      setLoading(true);

      const data = await get(`${ENDPOINTS.PRODUCTS.FEATURED}?limit=${limit}`);

      if (data?.success) {
        const featuredProducts = Array.isArray(data.products)
          ? data.products
          : [];

        setProducts(featuredProducts);

        return featuredProducts;
      }

      return [];
    } catch (error) {
      console.error("Fetch featured products error:", error);

      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchProductById = async (productId) => {
    try {
      setLoading(true);

      const data = await get(ENDPOINTS.PRODUCTS.BY_ID(productId));

      if (data?.success && data.product) {
        setProduct(data.product);
        return data.product;
      }

      setProduct(null);
      return null;
    } catch (error) {
      console.error("Fetch product by ID error:", error);

      setProduct(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (formData) => {
    try {
      setLoading(true);

      const data = await postFormData(ENDPOINTS.PRODUCTS.CREATE, formData);

      if (data?.success && data.product) {
        setProducts((currentProducts) => [data.product, ...currentProducts]);
      }

      return data;
    } catch (error) {
      console.error("Create product error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (productId, formData) => {
    try {
      setLoading(true);

      const data = await putFormData(
        ENDPOINTS.PRODUCTS.UPDATE(productId),
        formData,
      );

      if (data?.success && data.product) {
        setProduct(data.product);

        setProducts((currentProducts) =>
          currentProducts.map((item) =>
            String(item._id) === String(productId) ? data.product : item,
          ),
        );
      }

      return data;
    } catch (error) {
      console.error("Update product error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProductStatus = async (productId, isActive) => {
    try {
      setLoading(true);

      const data = await put(ENDPOINTS.PRODUCTS.STATUS(productId), {
        isActive,
      });

      if (data?.success && data.product) {
        setProducts((currentProducts) =>
          currentProducts.map((item) =>
            String(item._id) === String(productId) ? data.product : item,
          ),
        );

        if (product && String(product._id) === String(productId)) {
          setProduct(data.product);
        }
      }

      return data;
    } catch (error) {
      console.error("Update product status error:", error);

      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProductStock = async (productId, stock) => {
    try {
      setLoading(true);

      const data = await put(ENDPOINTS.PRODUCTS.STOCK(productId), {
        stock,
      });

      if (data?.success && data.product) {
        setProducts((currentProducts) =>
          currentProducts.map((item) =>
            String(item._id) === String(productId) ? data.product : item,
          ),
        );

        if (product && String(product._id) === String(productId)) {
          setProduct(data.product);
        }
      }

      return data;
    } catch (error) {
      console.error("Update product stock error:", error);

      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateFeaturedStatus = async (productId, isFeatured) => {
    try {
      setLoading(true);

      const data = await put(ENDPOINTS.PRODUCTS.STATUS(productId), {
        isFeatured,
      });

      if (data?.success && data.product) {
        setProducts((currentProducts) =>
          currentProducts.map((item) =>
            String(item._id) === String(productId) ? data.product : item,
          ),
        );

        if (product && String(product._id) === String(productId)) {
          setProduct(data.product);
        }
      }

      return data;
    } catch (error) {
      console.error("Update featured status error:", error);

      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (productId) => {
    try {
      setLoading(true);

      const data = await remove(ENDPOINTS.PRODUCTS.DELETE(productId));

      if (data?.success) {
        setProducts((currentProducts) =>
          currentProducts.filter(
            (item) => String(item._id) !== String(productId),
          ),
        );

        if (product && String(product._id) === String(productId)) {
          setProduct(null);
        }
      }

      return data;
    } catch (error) {
      console.error("Delete product error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearProduct = () => {
    setProduct(null);
  };

  const value = {
    products,
    product,
    pagination,
    loading,

    fetchProducts,
    fetchFeaturedProducts,
    fetchProductById,

    createProduct,
    updateProduct,
    updateProductStatus,
    updateProductStock,
    updateFeaturedStatus,
    deleteProduct,

    clearProduct,
  };

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);

  if (!context) {
    throw new Error("useProducts must be used inside ProductProvider");
  }

  return context;
};

export default ProductContext;
