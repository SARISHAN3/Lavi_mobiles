import { useEffect, useMemo, useState } from "react";
import axios from "axios";

import {
  MdSearch,
  MdFilterList,
  MdStar,
  MdVisibility,
  MdVisibilityOff,
  MdRefresh,
  MdChevronLeft,
  MdChevronRight,
} from "react-icons/md";

function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [ratingFilter, setRatingFilter] = useState("All");

  const [currentPage, setCurrentPage] = useState(1);

  const reviewsPerPage = 8;

  // =========================================================
  // GET REVIEWS
  // =========================================================

  const getReviews = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/reviews/admin/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setReviews(response.data.reviews || []);
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

  // =========================================================
  // APPROVE / HIDE REVIEW
  // =========================================================

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

  // =========================================================
  // COUNTS
  // =========================================================

  const totalReviews = reviews.length;

  const approvedReviews = reviews.filter((review) => review.isApproved).length;

  const hiddenReviews = reviews.filter((review) => !review.isApproved).length;

  const fiveStarReviews = reviews.filter(
    (review) => review.rating === 5,
  ).length;

  // =========================================================
  // FILTER REVIEWS
  // =========================================================

  const filteredReviews = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    return reviews.filter((review) => {
      const customerName = review.user?.name?.toLowerCase() || "";

      const customerEmail = review.user?.email?.toLowerCase() || "";

      const productName = review.product?.name?.toLowerCase() || "";

      const comment = review.comment?.toLowerCase() || "";

      const matchesSearch =
        !searchValue ||
        customerName.includes(searchValue) ||
        customerEmail.includes(searchValue) ||
        productName.includes(searchValue) ||
        comment.includes(searchValue);

      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Approved" && review.isApproved) ||
        (statusFilter === "Hidden" && !review.isApproved);

      const matchesRating =
        ratingFilter === "All" || review.rating === Number(ratingFilter);

      return matchesSearch && matchesStatus && matchesRating;
    });
  }, [reviews, search, statusFilter, ratingFilter]);

  // =========================================================
  // PAGINATION
  // =========================================================

  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);

  const startIndex = (currentPage - 1) * reviewsPerPage;

  const currentReviews = filteredReviews.slice(
    startIndex,
    startIndex + reviewsPerPage,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, ratingFilter]);

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // =========================================================
  // RESET FILTERS
  // =========================================================

  const handleReset = () => {
    setSearch("");
    setStatusFilter("All");
    setRatingFilter("All");
    setCurrentPage(1);
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-orange-100 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>

          <p className="text-gray-500 text-sm">Loading reviews...</p>
        </div>
      </div>
    );
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="space-y-6">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Reviews</h1>

          <p className="text-gray-500 text-sm mt-1">
            Manage and moderate customer product reviews
          </p>
        </div>

        <button
          onClick={getReviews}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
        >
          <MdRefresh size={20} />
          Refresh
        </button>
      </div>

      {/* =====================================================
          SUMMARY CARDS
      ===================================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Total */}

        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Reviews</p>

              <h2 className="text-2xl font-bold text-gray-800 mt-1">
                {totalReviews}
              </h2>
            </div>

            <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center">
              <MdStar size={24} className="text-orange-500" />
            </div>
          </div>
        </div>

        {/* Approved */}

        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Approved</p>

              <h2 className="text-2xl font-bold text-gray-800 mt-1">
                {approvedReviews}
              </h2>
            </div>

            <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center">
              <MdVisibility size={24} className="text-green-500" />
            </div>
          </div>
        </div>

        {/* Hidden */}

        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Hidden</p>

              <h2 className="text-2xl font-bold text-gray-800 mt-1">
                {hiddenReviews}
              </h2>
            </div>

            <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center">
              <MdVisibilityOff size={24} className="text-red-500" />
            </div>
          </div>
        </div>

        {/* 5 Star */}

        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">5 Star Reviews</p>

              <h2 className="text-2xl font-bold text-gray-800 mt-1">
                {fiveStarReviews}
              </h2>
            </div>

            <div className="w-11 h-11 rounded-xl bg-yellow-50 flex items-center justify-center">
              <MdStar size={24} className="text-yellow-500" />
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          SEARCH + FILTERS
      ===================================================== */}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex flex-col lg:flex-row gap-3">
          {/* Search */}

          <div className="relative flex-1">
            <MdSearch
              size={21}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search customer, email, product or review..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl outline-none text-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
            />
          </div>

          {/* Status */}

          <div className="relative">
            <MdFilterList
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-2.5 border border-gray-200 rounded-xl outline-none text-sm bg-white focus:border-orange-400"
            >
              <option value="All">All Status</option>

              <option value="Approved">Approved</option>

              <option value="Hidden">Hidden</option>
            </select>
          </div>

          {/* Rating */}

          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-xl outline-none text-sm bg-white focus:border-orange-400"
          >
            <option value="All">All Ratings</option>

            <option value="5">★★★★★ 5 Stars</option>
            <option value="4">★★★★ 4 Stars</option>
            <option value="3">★★★ 3 Stars</option>
            <option value="2">★★ 2 Stars</option>
            <option value="1">★ 1 Star</option>
          </select>

          {/* Reset */}

          {(search || statusFilter !== "All" || ratingFilter !== "All") && (
            <button
              onClick={handleReset}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* =====================================================
          RESULT COUNT
      ===================================================== */}

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-700">
              {filteredReviews.length === 0 ? 0 : startIndex + 1}-
              {Math.min(startIndex + reviewsPerPage, filteredReviews.length)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-700">
              {filteredReviews.length}
            </span>{" "}
            reviews
          </p>
        </div>
      </div>

      {/* =====================================================
          TABLE
      ===================================================== */}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px]">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Customer
                </th>

                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Product
                </th>

                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Rating
                </th>

                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Review
                </th>

                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Status
                </th>

                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {currentReviews.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-16">
                    <div className="flex flex-col items-center">
                      <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                        <MdStar size={28} className="text-gray-400" />
                      </div>

                      <p className="font-medium text-gray-700">
                        No reviews found
                      </p>

                      <p className="text-sm text-gray-400 mt-1">
                        Try changing your search or filters.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentReviews.map((review) => (
                  <tr key={review._id} className="hover:bg-gray-50 transition">
                    {/* Customer */}

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-semibold">
                          {review.user?.name?.charAt(0)?.toUpperCase() || "U"}
                        </div>

                        <div className="min-w-0">
                          <p className="font-medium text-gray-800 truncate max-w-[160px]">
                            {review.user?.name || "Unknown"}
                          </p>

                          <p className="text-xs text-gray-500 truncate max-w-[180px]">
                            {review.user?.email || "-"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Product */}

                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-800 max-w-[190px] truncate">
                        {review.product?.name || "Unknown Product"}
                      </p>
                    </td>

                    {/* Rating */}

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500 text-base">
                          {"★".repeat(review.rating)}
                        </span>

                        <span className="text-xs text-gray-500">
                          ({review.rating}.0)
                        </span>
                      </div>
                    </td>

                    {/* Review */}

                    <td className="px-6 py-4">
                      <p
                        className="text-sm text-gray-600 max-w-[280px] truncate"
                        title={review.comment}
                      >
                        {review.comment}
                      </p>
                    </td>

                    {/* Status */}

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                          review.isApproved
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            review.isApproved ? "bg-green-500" : "bg-red-500"
                          }`}
                        />

                        {review.isApproved ? "Approved" : "Hidden"}
                      </span>
                    </td>

                    {/* Action */}

                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleApprovalChange(review)}
                        title={
                          review.isApproved ? "Hide review" : "Approve review"
                        }
                        className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition ${
                          review.isApproved
                            ? "bg-red-50 text-red-600 hover:bg-red-100"
                            : "bg-green-50 text-green-600 hover:bg-green-100"
                        }`}
                      >
                        {review.isApproved ? (
                          <>
                            <MdVisibilityOff size={17} />
                            Hide
                          </>
                        ) : (
                          <>
                            <MdVisibility size={17} />
                            Approve
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ===================================================
            PAGINATION
        =================================================== */}

        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Page{" "}
              <span className="font-medium text-gray-700">{currentPage}</span>{" "}
              of <span className="font-medium text-gray-700">{totalPages}</span>
            </p>

            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((page) => page - 1)}
                className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <MdChevronLeft size={21} />
              </button>

              <div className="px-3 py-1.5 rounded-lg bg-orange-500 text-white text-sm font-medium">
                {currentPage}
              </div>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((page) => page + 1)}
                className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <MdChevronRight size={21} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminReviews;
