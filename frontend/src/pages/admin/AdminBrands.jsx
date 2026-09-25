import { useEffect, useState } from "react";
import axios from "axios";

function AdminBrands() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    logo: "",
    description: "",
  });

  const [editingId, setEditingId] = useState(null);

  const getBrands = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get("http://localhost:5000/api/brands", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBrands(response.data.brands);
    } catch (error) {
      console.error(
        "Failed to load brands:",
        error.response?.data || error.message,
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBrands();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      logo: "",
      description: "",
    });

    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      if (editingId) {
        await axios.put(
          `http://localhost:5000/api/brands/${editingId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        alert("Brand updated successfully.");
      } else {
        await axios.post("http://localhost:5000/api/brands", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        alert("Brand created successfully.");
      }

      resetForm();
      getBrands();
    } catch (error) {
      console.error("Brand save error:", error.response?.data || error.message);

      alert(error.response?.data?.message || "Failed to save brand.");
    }
  };

  const handleEdit = (brand) => {
    setEditingId(brand._id);

    setFormData({
      name: brand.name,
      slug: brand.slug,
      logo: brand.logo || "",
      description: brand.description || "",
    });
  };

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

      getBrands();
    } catch (error) {
      console.error(
        "Brand status error:",
        error.response?.data || error.message,
      );

      alert(error.response?.data?.message || "Failed to update brand status.");
    }
  };

  if (loading) {
    return <p>Loading brands...</p>;
  }

  return (
    <div>
      {/* Header */}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Brands</h1>

        <p className="text-gray-500 mt-1">Manage mobile brands</p>
      </div>

      {/* Add / Edit Form */}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          {editingId ? "Edit Brand" : "Add Brand"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5"
        >
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Brand Name"
            required
            className="border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-orange-500"
          />

          <input
            type="text"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            placeholder="Slug"
            required
            className="border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-orange-500"
          />

          <input
            type="url"
            name="logo"
            value={formData.logo}
            onChange={handleChange}
            placeholder="Logo URL"
            className="border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-orange-500"
          />

          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            className="border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-orange-500"
          />

          <div className="md:col-span-2 flex gap-3">
            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium"
            >
              {editingId ? "Update Brand" : "Add Brand"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Brands Table */}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                  Brand
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                  Slug
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                  Status
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {brands.map((brand) => (
                <tr key={brand._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {brand.logo ? (
                        <img
                          src={brand.logo}
                          alt={brand.name}
                          className="w-12 h-12 object-contain rounded-lg border p-1"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-400">
                          No Logo
                        </div>
                      )}

                      <div>
                        <p className="font-medium text-gray-800">
                          {brand.name}
                        </p>

                        <p className="text-sm text-gray-500">
                          {brand.description || "-"}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-gray-600">{brand.slug}</td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        brand.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {brand.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(brand)}
                        className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1.5 rounded-lg text-sm"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleStatusChange(brand)}
                        className={`px-3 py-1.5 rounded-lg text-sm ${
                          brand.isActive
                            ? "bg-red-100 text-red-700 hover:bg-red-200"
                            : "bg-green-100 text-green-700 hover:bg-green-200"
                        }`}
                      >
                        {brand.isActive ? "Deactivate" : "Activate"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminBrands;
