import { createContext, useContext, useEffect, useState } from "react";

import { get, post, remove } from "../services/api";

import ENDPOINTS from "../config/endpoints";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();

  const [wishlist, setWishlist] = useState({
    products: [],
  });

  const [loading, setLoading] = useState(false);

  const fetchWishlist = async () => {
    if (!isAuthenticated) {
      setWishlist({
        products: [],
      });

      return null;
    }

    try {
      setLoading(true);

      const data = await get(ENDPOINTS.WISHLIST.GET);

      if (data?.success && data?.wishlist) {
        setWishlist(data.wishlist);
        return data.wishlist;
      }

      return null;
    } catch (error) {
      console.error("Fetch wishlist error:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    } else {
      setWishlist({
        products: [],
      });
    }
  }, [isAuthenticated]);

  const addToWishlist = async (productId) => {
    try {
      setLoading(true);

      const data = await post(ENDPOINTS.WISHLIST.ADD, {
        productId,
      });

      if (data?.success && data?.wishlist) {
        setWishlist(data.wishlist);
      }

      return data;
    } catch (error) {
      console.error("Add to wishlist error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      setLoading(true);

      const data = await remove(ENDPOINTS.WISHLIST.REMOVE(productId));

      if (data?.success && data?.wishlist) {
        setWishlist(data.wishlist);
      }

      return data;
    } catch (error) {
      console.error("Remove from wishlist error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const toggleWishlist = async (productId) => {
    try {
      setLoading(true);

      const data = await post(ENDPOINTS.WISHLIST.TOGGLE, {
        productId,
      });

      if (data?.success && data?.wishlist) {
        setWishlist(data.wishlist);
      }

      return data;
    } catch (error) {
      console.error("Toggle wishlist error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearWishlist = async () => {
    try {
      setLoading(true);

      const data = await remove(ENDPOINTS.WISHLIST.CLEAR);

      if (data?.success) {
        setWishlist({
          products: [],
        });
      }

      return data;
    } catch (error) {
      console.error("Clear wishlist error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.products.some((product) => {
      const id = typeof product === "object" ? product._id : product;

      return String(id) === String(productId);
    });
  };

  const wishlistCount = wishlist.products.length;

  const value = {
    wishlist,
    products: wishlist.products,
    loading,
    wishlistCount,
    fetchWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    clearWishlist,
    isInWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error("useWishlist must be used inside WishlistProvider");
  }

  return context;
};

export default WishlistContext;
