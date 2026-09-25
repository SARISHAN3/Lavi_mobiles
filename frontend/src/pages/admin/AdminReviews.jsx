import { useEffect, useState } from "react";
import axios from "axios";

function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const getReviews = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/reviews/admin/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setReviews(response.data.reviews);
    } catch (error) {
      console.error(
        "Failed to load reviews:",
        error.response?.data || error.message,
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getReviews();
  }, []);

  const handleApprovalChange = async (review) => {
    const newStatus = !review.isApproved;

    const action = newStatus ? "approve" : "hide";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} this review?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/reviews/admin/${review._id}/approval`,
        {
          isApproved: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert(
        newStatus
          ? "Review approved successfully."
          : "Review hidden successfully.",
      );

      getReviews();
    } catch (error) {
      console.error(
        "Review approval error:",
        error.response?.data || error.message,
      );

      alert(error.response?.data?.message || "Failed to update review.");
    }
  };

  if (loading) {
    return <p>Loading reviews...</p>;
  }

  return (
    <div>
      {/* Header */}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Reviews</h1>

        <p className="text-gray-500 mt-1">Manage customer product reviews</p>
      </div>

      {/* Reviews Table */}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                  Customer
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                  Product
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                  Rating
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                  Review
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                  Status
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {reviews.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-gray-500">
                    No reviews found.
                  </td>
                </tr>
              ) : (
                reviews.map((review) => (
                  <tr key={review._id} className="hover:bg-gray-50">
                    {/* Customer */}

                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-800">
                        {review.user?.name || "Unknown"}
                      </p>

                      <p className="text-sm text-gray-500">
                        {review.user?.email || "-"}
                      </p>
                    </td>

                    {/* Product */}

                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-800">
                        {review.product?.name || "Unknown Product"}
                      </p>
                    </td>

                    {/* Rating */}

                    <td className="px-6 py-4">
                      <span className="text-yellow-500 font-semibold">
                        {"★".repeat(review.rating)}
                      </span>

                      <span className="text-gray-400 ml-1">
                        ({review.rating}/5)
                      </span>
                    </td>

                    {/* Comment */}

                    <td className="px-6 py-4 max-w-sm">
                      <p className="text-gray-600">{review.comment}</p>
                    </td>

                    {/* Status */}

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          review.isApproved
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {review.isApproved ? "Approved" : "Hidden"}
                      </span>
                    </td>

                    {/* Action */}

                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleApprovalChange(review)}
                        className={`px-3 py-1.5 rounded-lg text-sm ${
                          review.isApproved
                            ? "bg-red-100 text-red-700 hover:bg-red-200"
                            : "bg-green-100 text-green-700 hover:bg-green-200"
                        }`}
                      >
                        {review.isApproved ? "Hide" : "Approve"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminReviews;
