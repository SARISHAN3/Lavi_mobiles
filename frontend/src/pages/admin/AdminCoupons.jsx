import { useEffect, useState } from "react";
import axios from "axios";

function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    code: "",
    discountType: "percentage",
    discountValue: "",
    minimumAmount: "",
    maximumDiscount: "",
    startDate: "",
    expiryDate: "",
    usageLimit: "",
  });

  const [editingId, setEditingId] = useState(null);

  const getCoupons = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/coupons/admin/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setCoupons(response.data.coupons);
    } catch (error) {
      console.error(
        "Failed to load coupons:",
        error.response?.data || error.message,
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCoupons();
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
      code: "",
      discountType: "percentage",
      discountValue: "",
      minimumAmount: "",
      maximumDiscount: "",
      startDate: "",
      expiryDate: "",
      usageLimit: "",
    });

    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const data = {
        code: formData.code,
        discountType: formData.discountType,
        discountValue: Number(formData.discountValue),
        minimumAmount: Number(formData.minimumAmount || 0),
        maximumDiscount:
          formData.maximumDiscount === ""
            ? null
            : Number(formData.maximumDiscount),
        startDate: formData.startDate,
        expiryDate: formData.expiryDate,
        usageLimit: Number(formData.usageLimit || 0),
      };

      if (editingId) {
        await axios.put(
          `http://localhost:5000/api/coupons/${editingId}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        alert("Coupon updated successfully.");
      } else {
        await axios.post("http://localhost:5000/api/coupons", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        alert("Coupon created successfully.");
      }

      resetForm();
      getCoupons();
    } catch (error) {
      console.error(
        "Coupon save error:",
        error.response?.data || error.message,
      );

      alert(error.response?.data?.message || "Failed to save coupon.");
    }
  };

  const handleEdit = (coupon) => {
    setEditingId(coupon._id);

    setFormData({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minimumAmount: coupon.minimumAmount || "",
      maximumDiscount: coupon.maximumDiscount ?? "",
      startDate: coupon.startDate ? coupon.startDate.slice(0, 10) : "",
      expiryDate: coupon.expiryDate ? coupon.expiryDate.slice(0, 10) : "",
      usageLimit: coupon.usageLimit || "",
    });
  };

  const handleStatusChange = async (coupon) => {
    const action = coupon.isActive ? "deactivate" : "activate";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} this coupon?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/coupons/${coupon._id}`,
        {
          isActive: !coupon.isActive,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert(
        coupon.isActive
          ? "Coupon deactivated successfully."
          : "Coupon activated successfully.",
      );

      getCoupons();
    } catch (error) {
      console.error(
        "Coupon status error:",
        error.response?.data || error.message,
      );

      alert(error.response?.data?.message || "Failed to update coupon status.");
    }
  };

  if (loading) {
    return <p>Loading coupons...</p>;
  }

  return (
    <div>
      {/* Header */}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Coupons</h1>

        <p className="text-gray-500 mt-1">Manage discount coupons</p>
      </div>

      {/* Add / Edit Form */}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          {editingId ? "Edit Coupon" : "Add Coupon"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5"
        >
          <input
            type="text"
            name="code"
            value={formData.code}
            onChange={handleChange}
            placeholder="Coupon Code"
            required
            className="border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-orange-500 uppercase"
          />

          <select
            name="discountType"
            value={formData.discountType}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-orange-500"
          >
            <option value="percentage">Percentage</option>

            <option value="fixed">Fixed Amount</option>
          </select>

          <input
            type="number"
            name="discountValue"
            value={formData.discountValue}
            onChange={handleChange}
            placeholder="Discount Value"
            min="0"
            required
            className="border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-orange-500"
          />

          <input
            type="number"
            name="minimumAmount"
            value={formData.minimumAmount}
            onChange={handleChange}
            placeholder="Minimum Order Amount"
            min="0"
            className="border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-orange-500"
          />

          <input
            type="number"
            name="maximumDiscount"
            value={formData.maximumDiscount}
            onChange={handleChange}
            placeholder="Maximum Discount"
            min="0"
            className="border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-orange-500"
          />

          <input
            type="number"
            name="usageLimit"
            value={formData.usageLimit}
            onChange={handleChange}
            placeholder="Usage Limit (0 = Unlimited)"
            min="0"
            className="border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-orange-500"
          />

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Start Date
            </label>

            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Expiry Date
            </label>

            <input
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-orange-500"
            />
          </div>

          <div className="md:col-span-2 lg:col-span-3 flex gap-3">
            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium"
            >
              {editingId ? "Update Coupon" : "Add Coupon"}
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

      {/* Coupons Table */}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                  Code
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                  Discount
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                  Minimum
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                  Validity
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                  Usage
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
              {coupons.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-gray-500">
                    No coupons found.
                  </td>
                </tr>
              ) : (
                coupons.map((coupon) => (
                  <tr key={coupon._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <span className="font-semibold text-orange-600">
                        {coupon.code}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-gray-700">
                      {coupon.discountType === "percentage"
                        ? `${coupon.discountValue}%`
                        : `₹${coupon.discountValue}`}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      ₹{coupon.minimumAmount || 0}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div>
                        {new Date(coupon.startDate).toLocaleDateString()}
                      </div>

                      <div>
                        to {new Date(coupon.expiryDate).toLocaleDateString()}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {coupon.usedCount} /{" "}
                      {coupon.usageLimit === 0 ? "∞" : coupon.usageLimit}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          coupon.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {coupon.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(coupon)}
                          className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1.5 rounded-lg text-sm"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleStatusChange(coupon)}
                          className={`px-3 py-1.5 rounded-lg text-sm ${
                            coupon.isActive
                              ? "bg-red-100 text-red-700 hover:bg-red-200"
                              : "bg-green-100 text-green-700 hover:bg-green-200"
                          }`}
                        >
                          {coupon.isActive ? "Deactivate" : "Activate"}
                        </button>
                      </div>
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

export default AdminCoupons;
