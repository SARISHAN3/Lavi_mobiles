const TOKEN_KEY = "lavi_token";
const USER_KEY = "lavi_user";

// =====================================
// TOKEN
// =====================================

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

// =====================================
// USER
// =====================================

export const getStoredUser = () => {
  const user = localStorage.getItem(USER_KEY);

  if (!user) {
    return null;
  }

  try {
    return JSON.parse(user);
  } catch (error) {
    console.error("Failed to read stored user:", error);

    localStorage.removeItem(USER_KEY);

    return null;
  }
};

export const setStoredUser = (user) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const removeStoredUser = () => {
  localStorage.removeItem(USER_KEY);
};

// =====================================
// AUTH
// =====================================

export const isLoggedIn = () => {
  return Boolean(getToken());
};

export const logoutUser = () => {
  removeToken();
  removeStoredUser();
};

// =====================================
// AUTH HEADERS
// =====================================

export const getAuthHeaders = () => {
  const token = getToken();

  return {
    "Content-Type": "application/json",
    ...(token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {}),
  };
};

// =====================================
// MULTIPART HEADERS
// =====================================

export const getAuthHeadersWithoutContentType = () => {
  const token = getToken();

  return {
    ...(token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {}),
  };
};
