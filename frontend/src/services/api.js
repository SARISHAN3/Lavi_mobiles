import API_BASE_URL from "../config/api";
import { getToken, logoutUser } from "../config/auth";

// =====================================
// API REQUEST HELPER
// =====================================

const apiRequest = async (endpoint, options = {}) => {
  try {
    const { method = "GET", body, headers = {}, isFormData = false } = options;

    const token = getToken();

    const requestHeaders = {
      ...headers,
    };

    // Do not manually set Content-Type
    // for FormData.
    if (!isFormData) {
      requestHeaders["Content-Type"] = "application/json";
    }

    // Add JWT token when available
    if (token) {
      requestHeaders.Authorization = `Bearer ${token}`;
    }

    const requestOptions = {
      method,
      headers: requestHeaders,
    };

    // Add request body
    if (body !== undefined) {
      if (isFormData) {
        requestOptions.body = body;
      } else {
        requestOptions.body = JSON.stringify(body);
      }
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, requestOptions);

    // Try to read JSON response
    let data = null;

    try {
      data = await response.json();
    } catch (error) {
      data = null;
    }

    // Token expired / unauthorized
    if (response.status === 401) {
      logoutUser();
    }

    if (!response.ok) {
      const error = new Error(data?.message || "Something went wrong");

      error.status = response.status;

      error.data = data;

      throw error;
    }

    return data;
  } catch (error) {
    console.error("API request error:", error);

    throw error;
  }
};

// =====================================
// GET
// =====================================

export const get = (endpoint) => {
  return apiRequest(endpoint, {
    method: "GET",
  });
};

// =====================================
// POST
// =====================================

export const post = (endpoint, body) => {
  return apiRequest(endpoint, {
    method: "POST",
    body,
  });
};

// =====================================
// PUT
// =====================================

export const put = (endpoint, body) => {
  return apiRequest(endpoint, {
    method: "PUT",
    body,
  });
};

// =====================================
// DELETE
// =====================================

export const remove = (endpoint) => {
  return apiRequest(endpoint, {
    method: "DELETE",
  });
};

// =====================================
// FORM DATA POST
// =====================================

export const postFormData = (endpoint, formData) => {
  return apiRequest(endpoint, {
    method: "POST",
    body: formData,
    isFormData: true,
  });
};

// =====================================
// FORM DATA PUT
// =====================================

export const putFormData = (endpoint, formData) => {
  return apiRequest(endpoint, {
    method: "PUT",
    body: formData,
    isFormData: true,
  });
};

// =====================================
// CUSTOM REQUEST
// =====================================

export const request = (endpoint, options = {}) => {
  return apiRequest(endpoint, options);
};

export default apiRequest;
