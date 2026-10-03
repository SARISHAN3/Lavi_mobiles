const ENDPOINTS = {
  // =====================================
  // AUTH
  // =====================================

  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    ME: "/auth/me",
  },

  // =====================================
  // USERS
  // =====================================

  USERS: {
    PROFILE: "/users/profile",
    CHANGE_PASSWORD: "/users/change-password",
    ADD_ADDRESS: "/users/addresses",
    UPDATE_ADDRESS: (id) => `/users/addresses/${id}`,
    DELETE_ADDRESS: (id) => `/users/addresses/${id}`,
    DEFAULT_ADDRESS: (id) => `/users/addresses/${id}/default`,

    ALL: "/users",
    STATUS: (id) => `/users/${id}/status`,
    ROLE: (id) => `/users/${id}/role`,
  },

  // =====================================
  // PRODUCTS
  // =====================================

  PRODUCTS: {
    ALL: "/products",
    FEATURED: "/products/featured",
    BY_ID: (id) => `/products/${id}`,
    CREATE: "/products",
    UPDATE: (id) => `/products/${id}`,
    STATUS: (id) => `/products/${id}/status`,
    STOCK: (id) => `/products/${id}/stock`,
    DELETE: (id) => `/products/${id}`,
  },

  // =====================================
  // CATEGORIES
  // =====================================

  CATEGORIES: {
    ALL: "/categories",
    ACTIVE: "/categories/active",
    BY_ID: (id) => `/categories/${id}`,
    CREATE: "/categories",
    UPDATE: (id) => `/categories/${id}`,
    STATUS: (id) => `/categories/${id}/status`,
    DELETE: (id) => `/categories/${id}`,
  },

  // =====================================
  // BRANDS
  // =====================================

  BRANDS: {
    ALL: "/brands",
    ACTIVE: "/brands/active",
    BY_ID: (id) => `/brands/${id}`,
    CREATE: "/brands",
    UPDATE: (id) => `/brands/${id}`,
    STATUS: (id) => `/brands/${id}/status`,
    DELETE: (id) => `/brands/${id}`,
  },

  // =====================================
  // PRODUCT OPTIONS
  // =====================================

  PRODUCT_OPTIONS: {
    ALL: "/product-options",
    CREATE: "/product-options",
    UPDATE: (id) => `/product-options/${id}`,
    STATUS: (id) => `/product-options/${id}/status`,
    DELETE: (id) => `/product-options/${id}`,
  },

  // =====================================
  // CART
  // =====================================

  CART: {
    GET: "/cart",
    ADD: "/cart",
    UPDATE: (itemId) => `/cart/${itemId}`,
    REMOVE: (itemId) => `/cart/${itemId}`,
    CLEAR: "/cart",
  },

  // =====================================
  // WISHLIST
  // =====================================

  WISHLIST: {
    GET: "/wishlist",
    ADD: "/wishlist",
    TOGGLE: "/wishlist/toggle",
    REMOVE: (productId) => `/wishlist/${productId}`,
    CLEAR: "/wishlist",
  },

  // =====================================
  // ORDERS
  // =====================================

  ORDERS: {
    CREATE: "/orders",
    MY_ORDERS: "/orders/my-orders",
    MY_ORDER: (id) => `/orders/my-orders/${id}`,
    CANCEL_MY_ORDER: (id) => `/orders/my-orders/${id}/cancel`,

    ALL: "/orders",
    BY_ID: (id) => `/orders/${id}`,
    STATUS: (id) => `/orders/${id}/status`,
  },

  // =====================================
  // REVIEWS
  // =====================================

  REVIEWS: {
    PRODUCT: (productId) => `/reviews/product/${productId}`,
    SUMMARY: (productId) => `/reviews/product/${productId}/summary`,
    CAN_REVIEW: (productId) => `/reviews/product/${productId}/can-review`,

    CREATE: "/reviews",
    UPDATE: (id) => `/reviews/${id}`,
    DELETE: (id) => `/reviews/${id}`,

    ADMIN_ALL: "/reviews",
    ADMIN_STATUS: (id) => `/reviews/${id}/status`,
    ADMIN_DELETE: (id) => `/reviews/admin/${id}`,
  },

  // =====================================
  // COUPONS
  // =====================================

  COUPONS: {
    VALIDATE: "/coupons/validate",

    ALL: "/coupons",
    BY_ID: (id) => `/coupons/${id}`,
    CREATE: "/coupons",
    UPDATE: (id) => `/coupons/${id}`,
    STATUS: (id) => `/coupons/${id}/status`,
    DELETE: (id) => `/coupons/${id}`,
  },

  // =====================================
  // DASHBOARD
  // =====================================

  DASHBOARD: {
    STATS: "/dashboard/stats",
  },

  // =====================================
  // SETTINGS
  // =====================================

  SETTINGS: {
    GET: "/settings",
    UPDATE: "/settings",
    RESET: "/settings/reset",
  },
};

export default ENDPOINTS;
