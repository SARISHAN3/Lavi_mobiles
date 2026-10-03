const SERVER_BASE_URL = "http://localhost:5000";

// =====================================
// GET IMAGE URL
// =====================================

export const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return "";
  }

  // Already a complete URL
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  // Remove an accidental leading slash
  const cleanPath = imagePath.startsWith("/") ? imagePath.slice(1) : imagePath;

  return `${SERVER_BASE_URL}/${cleanPath}`;
};

// =====================================
// GET PRODUCT IMAGE
// =====================================

export const getProductImage = (images) => {
  if (!images) {
    return "";
  }

  if (Array.isArray(images)) {
    if (images.length === 0) {
      return "";
    }

    return getImageUrl(images[0]);
  }

  return getImageUrl(images);
};

export default getImageUrl;
