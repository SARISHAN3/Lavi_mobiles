import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  FiSearch,
  FiFilter,
  FiPlus,
  FiEdit2,
  FiChevronLeft,
  FiChevronRight,
  FiX,
  FiGrid,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";

function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search and filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  // Add/Edit modal
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    image: "",
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const categoriesPerPage = 8;

  // Loading states
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  // --------------------------------------------------
  // GET CATEGORIES
  // --------------------------------------------------

  const getCategories = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await axios.get("http://localhost:5000/api/categories", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCategories(response.data.categories || []);
    } catch (error) {
      console.error(
        "Failed to load categories:",
        error.response?.data || error.message,
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  // --------------------------------------------------
  // FORM CHANGE
  // --------------------------------------------------

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // --------------------------------------------------
  // RESET FORM
  // --------------------------------------------------

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
      image: "",
    });

    setEditingId(null);
    setShowModal(false);
  };

  // --------------------------------------------------
  // OPEN ADD
  // --------------------------------------------------

  const handleAdd = () => {
    setEditingId(null);

    setFormData({
      name: "",
      slug: "",
      description: "",
      image: "",
    });

    setShowModal(true);
  };

  // --------------------------------------------------
  // OPEN EDIT
  // --------------------------------------------------

  const handleEdit = (category) => {
    setEditingId(category._id);

    setFormData({
      name: category.name || "",
      slug: category.slug || "",
      description: category.description || "",
      image: category.image || "",
    });

    setShowModal(true);
  };

  // --------------------------------------------------
  // SUBMIT
  // --------------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const token = localStorage.getItem("token");

      if (editingId) {
        await axios.put(
          `http://localhost:5000/api/categories/${editingId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
      } else {
        await axios.post("http://localhost:5000/api/categories", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      resetForm();
      await getCategories();
    } catch (error) {
      console.error(
        "Category save error:",
        error.response?.data || error.message,
      );

      alert(error.response?.data?.message || "Failed to save category.");
    } finally {
      setSaving(false);
    }
  };

  // --------------------------------------------------
  // STATUS CHANGE
  // --------------------------------------------------

  const handleStatusChange = async (category) => {
    const action = category.isActive ? "deactivate" : "activate";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} this category?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setUpdatingId(category._id);

      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/categories/${category._id}`,
        {
          isActive: !category.isActive,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      await getCategories();
    } catch (error) {
      console.error(
        "Category status error:",
        error.response?.data || error.message,
      );

      alert(
        error.response?.data?.message || "Failed to update category status.",
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // --------------------------------------------------
  // COUNTS
  // --------------------------------------------------

  const categoryCounts = useMemo(() => {
    return {
      all: categories.length,

      active: categories.filter((category) => category.isActive).length,

      inactive: categories.filter((category) => !category.isActive).length,
    };
  }, [categories]);

  // --------------------------------------------------
  // FILTER
  // --------------------------------------------------

  const filteredCategories = useMemo(() => {
    let result = [...categories];

    if (search.trim()) {
      const searchText = search.toLowerCase().trim();

      result = result.filter((category) => {
        const name = category.name?.toLowerCase() || "";

        const slug = category.slug?.toLowerCase() || "";

        const description = category.description?.toLowerCase() || "";

        return (
          name.includes(searchText) ||
          slug.includes(searchText) ||
          description.includes(searchText)
        );
      });
    }

    if (statusFilter !== "All") {
      result = result.filter((category) =>
        statusFilter === "Active" ? category.isActive : !category.isActive,
      );
    }

    return result;
  }, [categories, search, statusFilter]);

  // --------------------------------------------------
  // PAGINATION
  // --------------------------------------------------

  const totalPages = Math.ceil(filteredCategories.length / categoriesPerPage);

  const startIndex = (currentPage - 1) * categoriesPerPage;

  const endIndex = startIndex + categoriesPerPage;

  const currentCategories = filteredCategories.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  // --------------------------------------------------
  // CLEAR FILTERS
  // --------------------------------------------------

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("All");
  };

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto"></div>

          <p className="text-gray-500 mt-4">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* =================================================
          PAGE HEADER
      ================================================== */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>

          <p className="text-sm text-gray-500 mt-1">
            Manage product categories
          </p>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition"
        >
          <FiPlus size={18} />
          Add Category
        </button>
      </div>

      {/* =================================================
          SUMMARY CARDS
      ================================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {/* TOTAL */}

        <button
          type="button"
          onClick={() => setStatusFilter("All")}
          className={`text-left bg-white rounded-xl border p-5 transition-all ${
            statusFilter === "All"
              ? "border-orange-500 ring-2 ring-orange-100"
              : "border-gray-200 hover:border-orange-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Categories</p>

              <p className="text-2xl font-bold text-gray-900 mt-1">
                {categoryCounts.all}
              </p>
            </div>

            <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
              <FiGrid className="text-orange-500" size={20} />
            </div>
          </div>
        </button>

        {/* ACTIVE */}

        <button
          type="button"
          onClick={() => setStatusFilter("Active")}
          className={`text-left bg-white rounded-xl border p-5 transition-all ${
            statusFilter === "Active"
              ? "border-green-500 ring-2 ring-green-100"
              : "border-gray-200 hover:border-green-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Categories</p>

              <p className="text-2xl font-bold text-gray-900 mt-1">
                {categoryCounts.active}
              </p>
            </div>

            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
              <FiCheckCircle className="text-green-500" size={20} />
            </div>
          </div>
        </button>

        {/* INACTIVE */}

        <button
          type="button"
          onClick={() => setStatusFilter("Inactive")}
          className={`text-left bg-white rounded-xl border p-5 transition-all ${
            statusFilter === "Inactive"
              ? "border-red-500 ring-2 ring-red-100"
              : "border-gray-200 hover:border-red-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Inactive Categories</p>

              <p className="text-2xl font-bold text-gray-900 mt-1">
                {categoryCounts.inactive}
              </p>
            </div>

            <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
              <FiXCircle className="text-red-500" size={20} />
            </div>
          </div>
        </button>
      </div>

      {/* =================================================
          SEARCH + FILTER
      ================================================== */}

      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-5">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* SEARCH */}

          <div className="relative flex-1">
            <FiSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search category name, slug or description..."
              className="w-full h-11 pl-10 pr-4 border border-gray-200 rounded-lg outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 text-sm"
            />
          </div>

          {/* FILTER */}

          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`h-11 px-5 rounded-lg border flex items-center justify-center gap-2 text-sm font-medium transition ${
              showFilters
                ? "bg-orange-500 text-white border-orange-500"
                : "bg-white text-gray-700 border-gray-200 hover:border-orange-400"
            }`}
          >
            <FiFilter size={17} />
            Filters
          </button>
        </div>

        {/* FILTER OPTIONS */}

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-64">
              <label className="block text-xs font-medium text-gray-600 mb-2">
                Category Status
              </label>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full h-10 px-3 border border-gray-200 rounded-lg bg-white outline-none focus:border-orange-500 text-sm"
              >
                <option value="All">All Status</option>

                <option value="Active">Active</option>

                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* =================================================
          RESULT HEADER
      ================================================== */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            {statusFilter === "All"
              ? "All Categories"
              : `${statusFilter} Categories`}
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Showing {filteredCategories.length === 0 ? 0 : startIndex + 1} -{" "}
            {Math.min(endIndex, filteredCategories.length)} of{" "}
            {filteredCategories.length} categories
          </p>
        </div>

        {(search || statusFilter !== "All") && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-sm text-orange-500 hover:text-orange-600 font-medium"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* =================================================
          CATEGORY TABLE
      ================================================== */}

      {currentCategories.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <FiGrid className="mx-auto text-gray-300" size={45} />

          <h3 className="text-lg font-semibold text-gray-800 mt-4">
            No categories found
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            Try changing your search or filters.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase">
                    Category
                  </th>

                  <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase">
                    Slug
                  </th>

                  <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase">
                    Description
                  </th>

                  <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase">
                    Status
                  </th>

                  <th className="text-center px-5 py-4 text-xs font-semibold text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {currentCategories.map((category) => (
                  <tr
                    key={category._id}
                    className="hover:bg-gray-50 transition"
                  >
                    {/* CATEGORY */}

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {category.image ? (
                          <img
                            src={category.image}
                            alt={category.name}
                            className="w-11 h-11 object-cover rounded-lg border border-gray-200"
                          />
                        ) : (
                          <div className="w-11 h-11 bg-gray-100 rounded-lg flex items-center justify-center">
                            <FiGrid className="text-gray-400" />
                          </div>
                        )}

                        <div>
                          <p className="font-semibold text-gray-800 text-sm">
                            {category.name}
                          </p>

                          <p className="text-xs text-gray-400 mt-0.5">
                            ID: {category._id.slice(-6)}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* SLUG */}

                    <td className="px-5 py-4">
                      <span className="text-sm text-gray-600">
                        {category.slug}
                      </span>
                    </td>

                    {/* DESCRIPTION */}

                    <td className="px-5 py-4 max-w-[280px]">
                      <p
                        className="text-sm text-gray-600 truncate"
                        title={category.description || ""}
                      >
                        {category.description || "-"}
                      </p>
                    </td>

                    {/* STATUS */}

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium ${
                          category.isActive
                            ? "bg-green-50 text-green-600 border-green-200"
                            : "bg-red-50 text-red-600 border-red-200"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            category.isActive ? "bg-green-500" : "bg-red-500"
                          }`}
                        ></span>

                        {category.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    {/* ACTIONS */}

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {/* EDIT */}

                        <button
                          type="button"
                          title="Edit Category"
                          onClick={() => handleEdit(category)}
                          className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:text-blue-500 hover:border-blue-300 hover:bg-blue-50 transition"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="1em"
                            height="1em"
                            viewBox="0 0 24 24"
                          >
                            <path d="M0 0h24v24H0z" fill="none" />
                            <g class="edit-outline">
                              <g
                                fill="currentColor"
                                fill-rule="evenodd"
                                class="Vector"
                                clip-rule="evenodd"
                              >
                                <path d="M2 6.857A4.857 4.857 0 0 1 6.857 2H12a1 1 0 1 1 0 2H6.857A2.857 2.857 0 0 0 4 6.857v10.286A2.857 2.857 0 0 0 6.857 20h10.286A2.857 2.857 0 0 0 20 17.143V12a1 1 0 1 1 2 0v5.143A4.857 4.857 0 0 1 17.143 22H6.857A4.857 4.857 0 0 1 2 17.143z" />
                                <path d="m15.137 13.219l-2.205 1.33l-1.033-1.713l2.205-1.33l.003-.002a1.2 1.2 0 0 0 .232-.182l5.01-5.036a3 3 0 0 0 .145-.157c.331-.386.821-1.15.228-1.746c-.501-.504-1.219-.028-1.684.381a6 6 0 0 0-.36.345l-.034.034l-4.94 4.965a1.2 1.2 0 0 0-.27.41l-.824 2.073a.2.2 0 0 0 .29.245l1.032 1.713c-1.805 1.088-3.96-.74-3.18-2.698l.825-2.072a3.2 3.2 0 0 1 .71-1.081l4.939-4.966l.029-.029c.147-.15.641-.656 1.24-1.02c.327-.197.849-.458 1.494-.508c.74-.059 1.53.174 2.15.797a2.9 2.9 0 0 1 .845 1.75a3.15 3.15 0 0 1-.23 1.517c-.29.717-.774 1.244-.987 1.457l-5.01 5.036q-.28.281-.62.487m4.453-7.126s-.004.003-.013.006z" />
                              </g>
                            </g>
                          </svg>
                        </button>

                        {/* ACTIVATE / DEACTIVATE */}

                        <button
                          type="button"
                          disabled={updatingId === category._id}
                          onClick={() => handleStatusChange(category)}
                          title={
                            category.isActive
                              ? "Deactivate Category"
                              : "Activate Category"
                          }
                          className={`px-3 h-9 rounded-lg border text-xs font-medium transition ${
                            category.isActive
                              ? "text-red-600 border-red-200 hover:bg-red-50"
                              : "text-green-600 border-green-200 hover:bg-green-50"
                          }`}
                        >
                          {category.isActive ? "Deactivate" : "Activate"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =================================================
          PAGINATION
      ================================================== */}

      {filteredCategories.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-5">
          <p className="text-sm text-gray-500">
            Page {currentPage} of {totalPages || 1}
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="w-9 h-9 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:border-orange-400 hover:text-orange-500 transition"
            >
              <FiChevronLeft size={18} />
            </button>

            {Array.from({ length: totalPages }, (_, index) => index + 1)
              .slice(
                Math.max(0, currentPage - 2),
                Math.min(totalPages, currentPage + 1),
              )
              .map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition ${
                    currentPage === page
                      ? "bg-orange-500 text-white"
                      : "bg-white border border-gray-200 text-gray-600 hover:border-orange-400 hover:text-orange-500"
                  }`}
                >
                  {page}
                </button>
              ))}

            <button
              type="button"
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              className="w-9 h-9 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:border-orange-400 hover:text-orange-500 transition"
            >
              <FiChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* =================================================
          ADD / EDIT CATEGORY MODAL
      ================================================== */}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}

          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => {
              if (!saving) {
                resetForm();
              }
            }}
          ></div>

          {/* Modal */}

          <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-xl">
            {/* Header */}

            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {editingId ? "Edit Category" : "Add Category"}
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  {editingId
                    ? "Update category information"
                    : "Create a new product category"}
                </p>
              </div>

              <button
                type="button"
                disabled={saving}
                onClick={resetForm}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 disabled:opacity-50"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* FORM */}

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* NAME */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Example: Smartphones"
                  required
                  className="w-full h-11 px-4 border border-gray-200 rounded-lg outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 text-sm"
                />
              </div>

              {/* SLUG */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug
                </label>

                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="Example: smartphones"
                  required
                  className="w-full h-11 px-4 border border-gray-200 rounded-lg outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 text-sm"
                />
              </div>

              {/* IMAGE */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL
                </label>

                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full h-11 px-4 border border-gray-200 rounded-lg outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 text-sm"
                />
              </div>

              {/* DESCRIPTION */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter category description..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none resize-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 text-sm"
                />
              </div>

              {/* BUTTONS */}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  disabled={saving}
                  onClick={resetForm}
                  className="px-5 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Update Category"
                      : "Add Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminCategories;
