import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    model: "",
    price: "",
    mrp: "",
    discount: "",
    ram: "",
    storage: "",
    operatingSystem: "",
    network: "",
    screenSize: "",
    battery: "",
    processor: "",
    camera: "",
    stock: "",
    category: "",
    description: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const getProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/products/${id}`,
        );

        const product = response.data.product;

        setFormData({
          name: product.name || "",
          brand: product.brand || "",
          model: product.model || "",
          price: product.price || "",
          mrp: product.mrp || "",
          discount: product.discount || "",
          ram: product.ram || "",
          storage: product.storage || "",
          operatingSystem: product.operatingSystem || "",
          network: product.network || "",
          screenSize: product.screenSize || "",
          battery: product.battery || "",
          processor: product.processor || "",
          camera: product.camera || "",
          stock: product.stock || "",
          category: product.category || "",
          description: product.description || "",
        });
      } catch (error) {
        console.error(
          "Failed to load product:",
          error.response?.data || error.message,
        );
      } finally {
        setLoading(false);
      }
    };

    getProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/products/${id}`,
        {
          ...formData,
          price: Number(formData.price),
          mrp: Number(formData.mrp),
          discount: Number(formData.discount),
          stock: Number(formData.stock),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("Product updated successfully");

      navigate("/admin/products");
    } catch (error) {
      console.error(
        "Update product error:",
        error.response?.data || error.message,
      );

      alert(error.response?.data?.message || "Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p>Loading product...</p>;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Edit Product</h1>

        <p className="text-gray-500 mt-1">Update product information</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Name
            </label>

            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Brand
            </label>

            <input
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Model
            </label>

            <input
              name="model"
              value={formData.model}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price
            </label>

            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              MRP
            </label>

            <input
              type="number"
              name="mrp"
              value={formData.mrp}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Discount
            </label>

            <input
              type="number"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              RAM
            </label>

            <input
              name="ram"
              value={formData.ram}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
              placeholder="8GB"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Storage
            </label>

            <input
              name="storage"
              value={formData.storage}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
              placeholder="256GB"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Operating System
            </label>

            <input
              name="operatingSystem"
              value={formData.operatingSystem}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
              placeholder="Android"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Network
            </label>

            <input
              name="network"
              value={formData.network}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
              placeholder="5G"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Screen Size
            </label>

            <input
              name="screenSize"
              value={formData.screenSize}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
              placeholder="6.2 inches"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Battery
            </label>

            <input
              name="battery"
              value={formData.battery}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
              placeholder="4000mAh"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Processor
            </label>

            <input
              name="processor"
              value={formData.processor}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
              placeholder="Snapdragon"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Camera
            </label>

            <input
              name="camera"
              value={formData.camera}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
              placeholder="50MP"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stock
            </label>

            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>

            <input
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            type="submit"
            disabled={saving}
            className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white px-6 py-3 rounded-lg font-medium"
          >
            {saving ? "Saving..." : "Update Product"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditProduct;
