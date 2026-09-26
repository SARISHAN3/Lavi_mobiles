import { useEffect, useMemo, useState } from "react";
import axios from "axios";

import {
  MdAdd,
  MdEdit,
  MdPowerSettingsNew,
  MdRefresh,
  MdSearch,
  MdLabel,
  MdChevronLeft,
  MdChevronRight,
  MdCloudUpload,
  MdDelete,
} from "react-icons/md";

function AdminBrands() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
  });

  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");

  const [editingId, setEditingId] = useState(null);

  // =========================================================
  // GET BRANDS
  // =========================================================

  const getBrands = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await axios.get("http://localhost:5000/api/brands", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBrands(response.data.brands || []);
    } catch (error) {
      console.error(
        "Failed to load brands:",
        error.response?.data || error.message,
      );

      setBrands([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBrands();
  }, []);

  // =========================================================
  // FORM CHANGE
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // LOGO CHANGE
  // =========================================================

  const handleLogoChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      alert("Only JPG, JPEG, PNG and WEBP images are allowed.");
      return;
    }

    // 500 KB limit
    if (file.size > 500 * 1024) {
      alert("Logo image must be less than 500KB.");
      return;
    }

    setLogo(file);

    const previewUrl = URL.createObjectURL(file);
    setLogoPreview(previewUrl);
  };

  // =========================================================
  // REMOVE LOGO
  // =========================================================

  const handleRemoveLogo = () => {
    setLogo(null);
    setLogoPreview("");
  };

  // =========================================================
  // RESET FORM
  // =========================================================

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
    });

    setLogo(null);
    setLogoPreview("");
    setEditingId(null);
  };

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const token = localStorage.getItem("token");

      const data = new FormData();

      data.append("name", formData.name);
      data.append("slug", formData.slug);
      data.append("description", formData.description);

      if (logo) {
        data.append("logo", logo);
      }

      if (editingId) {
        await axios.put(`http://localhost:5000/api/brands/${editingId}`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        alert("Brand updated successfully.");
      } else {
        await axios.post("http://localhost:5000/api/brands", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        alert("Brand created successfully.");
      }

      resetForm();
      await getBrands();
    } catch (error) {
      console.error("Brand save error:", error.response?.data || error.message);

      alert(error.response?.data?.message || "Failed to save brand.");
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // EDIT
  // =========================================================

  const handleEdit = (brand) => {
    setEditingId(brand._id);

    setFormData({
      name: brand.name || "",
      slug: brand.slug || "",
      description: brand.description || "",
    });

    setLogo(null);
    setLogoPreview(brand.logo || "");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================================================
  // STATUS CHANGE
  // =========================================================

  const handleStatusChange = async (brand) => {
    const action = brand.isActive ? "deactivate" : "activate";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} this brand?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/brands/${brand._id}`,
        {
          isActive: !brand.isActive,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert(
        brand.isActive
          ? "Brand deactivated successfully."
          : "Brand activated successfully.",
      );

      await getBrands();
    } catch (error) {
      console.error(
        "Brand status error:",
        error.response?.data || error.message,
      );

      alert(error.response?.data?.message || "Failed to update brand status.");
    }
  };

  // =========================================================
  // FILTER
  // =========================================================

  const filteredBrands = useMemo(() => {
    return brands.filter((brand) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        brand.name?.toLowerCase().includes(searchText) ||
        brand.slug?.toLowerCase().includes(searchText) ||
        brand.description?.toLowerCase().includes(searchText);

      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Active" && brand.isActive) ||
        (statusFilter === "Inactive" && !brand.isActive);

      return matchesSearch && matchesStatus;
    });
  }, [brands, search, statusFilter]);

  // =========================================================
  // PAGINATION
  // =========================================================

  const totalPages = Math.ceil(filteredBrands.length / itemsPerPage);

  const paginatedBrands = filteredBrands.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  // =========================================================
  // COUNTS
  // =========================================================

  const totalBrands = brands.length;

  const activeBrands = brands.filter((brand) => brand.isActive).length;

  const inactiveBrands = brands.filter((brand) => !brand.isActive).length;

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-gray-500">Loading brands...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}

      <div>
        <h1 className="text-3xl font-bold text-slate-800">Brands</h1>

        <p className="mt-1 text-slate-500">Manage mobile brands</p>
      </div>

      {/* =====================================================
          ADD / EDIT BRAND
      ===================================================== */}

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-orange-500 flex items-center justify-center text-white">
              {editingId ? <MdEdit size={22} /> : <MdLabel size={22} />}
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-800">
                {editingId ? "Edit Brand" : "Add Brand"}
              </h2>

              <p className="text-sm text-slate-500 mt-0.5">
                Fill in the details below to add a new brand or edit an existing
                one.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* BRAND NAME */}

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Brand Name
                <span className="text-red-500 ml-1">*</span>
              </label>

              <div className="relative">
                <MdLabel
                  size={20}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter brand name"
                  required
                  className="w-full h-11 pl-11 pr-4 border border-slate-200 rounded-lg outline-none text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>
            </div>

            {/* SLUG */}

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Slug
                <span className="text-red-500 ml-1">*</span>
              </label>

              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                placeholder="Enter slug (e.g. samsung)"
                required
                className="w-full h-11 px-4 border border-slate-200 rounded-lg outline-none text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            {/* LOGO UPLOAD */}

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Brand Logo
              </label>

              <div className="flex items-center gap-3">
                <label className="flex-1 h-11 px-4 border border-dashed border-slate-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 cursor-pointer transition flex items-center gap-3">
                  <MdCloudUpload size={22} className="text-orange-500" />

                  <span className="text-sm text-slate-500 truncate">
                    {logo ? logo.name : "Choose logo from device"}
                  </span>

                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleLogoChange}
                    className="hidden"
                  />
                </label>

                {logoPreview && (
                  <div className="relative w-14 h-11 border border-slate-200 rounded-lg bg-white flex items-center justify-center">
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="max-w-full max-h-full object-contain p-1"
                    />

                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600"
                    >
                      <MdDelete size={13} />
                    </button>
                  </div>
                )}
              </div>

              <p className="text-xs text-slate-400 mt-2">
                JPG, PNG or WEBP • Maximum 500KB
              </p>
            </div>

            {/* DESCRIPTION */}

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Description
              </label>

              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter description"
                className="w-full h-11 px-4 border border-slate-200 rounded-lg outline-none text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />
            </div>
          </div>

          {/* BUTTONS */}

          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button
              type="submit"
              disabled={saving}
              className="h-11 px-8 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white rounded-lg font-semibold text-sm flex items-center justify-center gap-2"
            >
              {editingId ? <MdEdit size={19} /> : <MdAdd size={20} />}

              {saving ? "Saving..." : editingId ? "Update Brand" : "Add Brand"}
            </button>

            <button
              type="button"
              onClick={resetForm}
              className="h-11 px-6 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg font-semibold text-sm flex items-center justify-center gap-2"
            >
              <MdRefresh size={19} />
              {editingId ? "Cancel" : "Reset"}
            </button>
          </div>
        </form>
      </div>

      {/* =====================================================
          BRANDS LIST
      ===================================================== */}

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-orange-500 flex items-center justify-center text-white">
                <MdLabel size={22} />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-slate-800">
                  Brands List
                </h2>

                <p className="text-sm text-slate-500">
                  Manage all mobile brands
                </p>
              </div>
            </div>

            <div className="px-4 py-2 bg-slate-50 rounded-lg">
              <span className="text-sm font-semibold text-slate-700">
                Total Brands: {totalBrands}
              </span>
            </div>
          </div>

          {/* SEARCH */}

          <div className="flex flex-col md:flex-row gap-3 mt-5">
            <div className="relative flex-1">
              <MdSearch
                size={21}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search brands..."
                className="w-full h-11 pl-11 pr-4 border border-slate-200 rounded-lg outline-none text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-11 px-4 border border-slate-200 rounded-lg outline-none text-sm text-slate-600 focus:border-orange-500 bg-white"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* COUNTS */}

          <div className="flex flex-wrap gap-5 mt-4">
            <p className="text-sm text-slate-500">
              Total:
              <span className="font-semibold text-slate-700 ml-1">
                {totalBrands}
              </span>
            </p>

            <p className="text-sm text-slate-500">
              Active:
              <span className="font-semibold text-green-600 ml-1">
                {activeBrands}
              </span>
            </p>

            <p className="text-sm text-slate-500">
              Inactive:
              <span className="font-semibold text-red-500 ml-1">
                {inactiveBrands}
              </span>
            </p>
          </div>
        </div>

        {/* TABLE */}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="bg-slate-50">
                <th className="text-left px-6 py-4 text-xs font-bold text-slate-600 uppercase">
                  Brand
                </th>

                <th className="text-left px-6 py-4 text-xs font-bold text-slate-600 uppercase">
                  Slug
                </th>

                <th className="text-left px-6 py-4 text-xs font-bold text-slate-600 uppercase">
                  Status
                </th>

                <th className="text-left px-6 py-4 text-xs font-bold text-slate-600 uppercase">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {paginatedBrands.length > 0 ? (
                paginatedBrands.map((brand) => (
                  <tr key={brand._id} className="hover:bg-slate-50 transition">
                    {/* BRAND */}

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-lg bg-white border border-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                          {brand.logo ? (
                            <img
                              src={`http://localhost:5000${brand.logo}`}
                              alt={brand.name}
                              className="w-full h-full object-contain p-2"
                            />
                          ) : (
                            <span className="text-xs text-slate-400">
                              No Logo
                            </span>
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="font-semibold text-slate-800">
                            {brand.name}
                          </p>

                          <p className="text-sm text-slate-400 truncate max-w-[300px]">
                            {brand.description || "No description"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* SLUG */}

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {brand.slug}
                    </td>

                    {/* STATUS */}

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${
                          brand.isActive
                            ? "bg-green-50 text-green-600"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            brand.isActive ? "bg-green-500" : "bg-red-500"
                          }`}
                        />

                        {brand.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    {/* ACTIONS */}

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(brand)}
                          className="h-9 w-9 rounded-lg text-blue-500 hover:bg-blue-100 text-sm font-semibold flex items-center justify-center gap-1.5 border-1 border-blue-300"
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

                        <button
                          onClick={() => handleStatusChange(brand)}
                          className={`h-9 px-4 rounded-lg text-sm font-semibold flex items-center gap-1.5 border-1 ${
                            brand.isActive
                              ? "text-red-500 hover:bg-red-100 border-red-300"
                              : "text-green-500 hover:bg-green-100 border-green-300"
                          }`}
                        >
                          {brand.isActive ? "Deactivate" : "Activate"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-16 text-center">
                    <p className="font-semibold text-slate-700">
                      No brands found
                    </p>

                    <p className="text-sm text-slate-400 mt-1">
                      Try changing your search or filter.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}

        {filteredBrands.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-700">
                {(currentPage - 1) * itemsPerPage + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-slate-700">
                {Math.min(currentPage * itemsPerPage, filteredBrands.length)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-700">
                {filteredBrands.length}
              </span>{" "}
              brands
            </p>

            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-40"
              >
                <MdChevronLeft size={20} />
              </button>

              <div className="px-4 h-9 rounded-lg bg-orange-500 text-white flex items-center justify-center text-sm font-semibold">
                {currentPage}
              </div>

              <button
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-40"
              >
                <MdChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminBrands;
