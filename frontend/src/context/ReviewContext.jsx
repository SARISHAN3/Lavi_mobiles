import { createContext, useContext, useState } from "react";

import { get, post, put, remove } from "../services/api";

import ENDPOINTS from "../config/endpoints";

const ReviewContext = createContext(null);

export const ReviewProvider = ({ children }) => {
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratingCounts: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    },
  });

  const [canReview, setCanReview] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchProductReviews = async (productId, params = {}) => {
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
        ? `${ENDPOINTS.REVIEWS.PRODUCT(productId)}?${queryString}`
        : ENDPOINTS.REVIEWS.PRODUCT(productId);

      const data = await get(endpoint);

      if (data?.success) {
        const reviewList = Array.isArray(data.reviews) ? data.reviews : [];

        setReviews(reviewList);

        return data;
      }

      return null;
    } catch (error) {
      console.error("Fetch product reviews error:", error);

      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchReviewSummary = async (productId) => {
    try {
      setLoading(true);

      const data = await get(ENDPOINTS.REVIEWS.SUMMARY(productId));

      if (data?.success) {
        const reviewSummary = data.summary || {
          averageRating: 0,
          totalReviews: 0,
          ratingCounts: {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
          },
        };

        setSummary(reviewSummary);

        return reviewSummary;
      }

      return null;
    } catch (error) {
      console.error("Fetch review summary error:", error);

      return null;
    } finally {
      setLoading(false);
    }
  };

  const checkCanReview = async (productId) => {
    try {
      const data = await get(ENDPOINTS.REVIEWS.CAN_REVIEW(productId));

      if (data?.success) {
        setCanReview(Boolean(data.canReview));

        return Boolean(data.canReview);
      }

      setCanReview(false);

      return false;
    } catch (error) {
      console.error("Check can review error:", error);

      setCanReview(false);

      return false;
    }
  };

  const createReview = async (reviewData) => {
    try {
      setLoading(true);

      const data = await post(ENDPOINTS.REVIEWS.CREATE, reviewData);

      if (data?.success && data.review) {
        setReviews((currentReviews) => [data.review, ...currentReviews]);

        setCanReview(false);
      }

      return data;
    } catch (error) {
      console.error("Create review error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateReview = async (reviewId, reviewData) => {
    try {
      setLoading(true);

      const data = await put(ENDPOINTS.REVIEWS.UPDATE(reviewId), reviewData);

      if (data?.success && data.review) {
        setReviews((currentReviews) =>
          currentReviews.map((item) =>
            String(item._id) === String(reviewId) ? data.review : item,
          ),
        );
      }

      return data;
    } catch (error) {
      console.error("Update review error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteReview = async (reviewId) => {
    try {
      setLoading(true);

      const data = await remove(ENDPOINTS.REVIEWS.DELETE(reviewId));

      if (data?.success) {
        setReviews((currentReviews) =>
          currentReviews.filter(
            (item) => String(item._id) !== String(reviewId),
          ),
        );
      }

      return data;
    } catch (error) {
      console.error("Delete review error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearReviews = () => {
    setReviews([]);

    setSummary({
      averageRating: 0,
      totalReviews: 0,
      ratingCounts: {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
      },
    });

    setCanReview(false);
  };

  const value = {
    reviews,
    summary,
    canReview,
    loading,

    fetchProductReviews,
    fetchReviewSummary,
    checkCanReview,

    createReview,
    updateReview,
    deleteReview,

    clearReviews,
  };

  return (
    <ReviewContext.Provider value={value}>{children}</ReviewContext.Provider>
  );
};

export const useReviews = () => {
  const context = useContext(ReviewContext);

  if (!context) {
    throw new Error("useReviews must be used inside ReviewProvider");
  }

  return context;
};

export default ReviewContext;
