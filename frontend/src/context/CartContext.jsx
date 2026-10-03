import { createContext, useContext, useEffect, useState } from "react";

import { get, post, put, remove } from "../services/api";

import ENDPOINTS from "../config/endpoints";

import { useAuth } from "./AuthContext";

// =====================================
// CREATE CONTEXT
// =====================================

const CartContext = createContext(null);

// =====================================
// CART PROVIDER
// =====================================

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();

  const [cart, setCart] = useState({
    items: [],
    totalAmount: 0,
  });

  const [loading, setLoading] = useState(false);

  // ===================================
  // GET CART
  // ===================================

  const fetchCart = async () => {
    if (!isAuthenticated) {
      setCart({
        items: [],
        totalAmount: 0,
      });

      return null;
    }

    try {
      setLoading(true);

      const data = await get(ENDPOINTS.CART.GET);

      if (data?.success && data?.cart) {
        setCart(data.cart);

        return data.cart;
      }

      return null;
    } catch (error) {
      console.error("Fetch cart error:", error);

      return null;
    } finally {
      setLoading(false);
    }
  };

  // ===================================
  // LOAD CART AFTER LOGIN
  // ===================================

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCart({
        items: [],
        totalAmount: 0,
      });
    }
  }, [isAuthenticated]);

  // ===================================
  // ADD TO CART
  // ===================================

  const addToCart = async (productId, quantity = 1) => {
    try {
      setLoading(true);

      const data = await post(ENDPOINTS.CART.ADD, {
        productId,
        quantity,
      });

      if (data?.success && data?.cart) {
        setCart(data.cart);
      }

      return data;
    } catch (error) {
      console.error("Add to cart error:", error);

      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ===================================
  // UPDATE CART ITEM
  // ===================================

  const updateCartItem = async (itemId, quantity) => {
    try {
      setLoading(true);

      const data = await put(ENDPOINTS.CART.UPDATE(itemId), {
        quantity,
      });

      if (data?.success && data?.cart) {
        setCart(data.cart);
      }

      return data;
    } catch (error) {
      console.error("Update cart item error:", error);

      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ===================================
  // REMOVE CART ITEM
  // ===================================

  const removeFromCart = async (itemId) => {
    try {
      setLoading(true);

      const data = await remove(ENDPOINTS.CART.REMOVE(itemId));

      if (data?.success && data?.cart) {
        setCart(data.cart);
      }

      return data;
    } catch (error) {
      console.error("Remove cart item error:", error);

      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ===================================
  // CLEAR CART
  // ===================================

  const clearCart = async () => {
    try {
      setLoading(true);

      const data = await remove(ENDPOINTS.CART.CLEAR);

      if (data?.success) {
        setCart({
          items: [],
          totalAmount: 0,
        });
      }

      return data;
    } catch (error) {
      console.error("Clear cart error:", error);

      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ===================================
  // CART ITEM COUNT
  // ===================================

  const cartItemCount = cart.items.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  // ===================================
  // CART TOTAL
  // ===================================

  const cartTotal = Number(cart.totalAmount) || 0;

  // ===================================
  // CONTEXT VALUE
  // ===================================

  const value = {
    cart,
    items: cart.items,

    loading,

    cartItemCount,
    cartTotal,

    fetchCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// =====================================
// CUSTOM HOOK
// =====================================

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
};

export default CartContext;
