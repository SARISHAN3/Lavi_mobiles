import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { MdAddPhotoAlternate, MdDelete, MdArrowBack } from "react-icons/md";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    model: "",
    mrp: "",
    discount: "",

    ram: "",
    storage: "",
    operatingSystem: "",
    network: "5G",
    screenSize: "",
    battery: "",
    processor: "",
    camera: "",

    stock: "",
    lowStockLimit: "5",

    category: "Mobile Phones",
    categoryId: "",

    description: "",

    connectivity: "",
    compatibility: "",
    waterResistance: "",
    batteryLife: "",

    isFeatured: false,
    isActive: true,
  });

  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const sellingPrice =
    Number(formData.mrp || 0) - Number(formData.discount || 0);

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

          mrp: product.mrp || "",
          discount: product.discount || "",

          ram: product.ram || "",
          storage: product.storage || "",
          operatingSystem: product.operatingSystem || "",
          network: product.network || "5G",
          screenSize: product.screenSize || "",
          battery: product.battery || "",
          processor: product.processor || "",
          camera: product.camera || "",

          stock: product.stock !== undefined ? product.stock : "",
          lowStockLimit:
            product.lowStockLimit !== undefined ? product.lowStockLimit : 5,

          category: product.category || "Mobile Phones",
          categoryId: product.categoryId || "",

          description: product.description || "",

          connectivity: product.connectivity || "",
          compatibility: product.compatibility || "",
          waterResistance: product.waterResistance || "",
          batteryLife: product.batteryLife || "",

          isFeatured: product.isFeatured || false,
          isActive: product.isActive !== undefined ? product.isActive : true,
        });

        setExistingImages(product.images || []);
      } catch (error) {
        console.error(
          "Failed to load product:",
          error.response?.data || error.message,
        );

        alert("Failed to load product");
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

  const handleNewImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (!files.length) {
      return;
    }

    const totalImages = existingImages.length + newImages.length;

    const remainingSlots = 10 - totalImages;

    if (remainingSlots <= 0) {
      alert("You can add a maximum of 10 images.");
      e.target.value = "";
      return;
    }

    const selectedFiles = files.slice(0, remainingSlots);

    setNewImages((prev) => [...prev, ...selectedFiles]);

    e.target.value = "";
  };

  const handleRemoveExistingImage = (index) => {
    setExistingImages((prev) =>
      prev.filter((_, imageIndex) => imageIndex !== index),
    );
  };

  const handleRemoveNewImage = (index) => {
    setNewImages((prev) =>
      prev.filter((_, imageIndex) => imageIndex !== index),
    );
  };

  const getImageUrl = (image) => {
    if (image.startsWith("http")) {
      return image;
    }

    return `http://localhost:5000${image}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Number(formData.discount) > Number(formData.mrp)) {
      alert("Discount cannot be greater than MRP.");
      return;
    }

    if (sellingPrice < 0) {
      alert("Selling price cannot be negative.");
      return;
    }

    if (Number(formData.stock) < 0) {
      alert("Stock cannot be negative.");
      return;
    }

    if (Number(formData.lowStockLimit) < 0) {
      alert("Low stock limit cannot be negative.");
      return;
    }

    const totalImages = existingImages.length + newImages.length;

    if (totalImages > 10) {
      alert("You can have a maximum of 10 images.");
      return;
    }

    try {
      setSaving(true);

      const token = localStorage.getItem("token");

      const data = new FormData();

      data.append("name", formData.name);
      data.append("brand", formData.brand);
      data.append("model", formData.model);

      data.append("mrp", formData.mrp);
      data.append("discount", formData.discount);

      // Automatically calculated selling price
      data.append("price", sellingPrice);

      data.append("ram", formData.ram);
      data.append("storage", formData.storage);
      data.append("operatingSystem", formData.operatingSystem);
      data.append("network", formData.network);
      data.append("screenSize", formData.screenSize);
      data.append("battery", formData.battery);
      data.append("processor", formData.processor);
      data.append("camera", formData.camera);

      data.append("stock", formData.stock);
      data.append("lowStockLimit", formData.lowStockLimit);

      data.append("category", formData.category);
      data.append("categoryId", formData.categoryId);

      data.append("description", formData.description);

      data.append("connectivity", formData.connectivity);
      data.append("compatibility", formData.compatibility);
      data.append("waterResistance", formData.waterResistance);
      data.append("batteryLife", formData.batteryLife);

      data.append("isFeatured", formData.isFeatured);
      data.append("isActive", formData.isActive);

      // Existing images that were not removed
      data.append("existingImages", JSON.stringify(existingImages));

      // New images
      newImages.forEach((image) => {
        data.append("images", image);
      });

      await axios.put(`http://localhost:5000/api/products/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-500">Loading product...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          type="button"
          onClick={() => navigate("/admin/products")}
          className="w-10 h-10 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:bg-gray-50 transition"
        >
          <MdArrowBack className="text-xl" />
        </button>

        <div>
          <h1 className="text-2xl font-bold text-gray-800">Edit Product</h1>

          <p className="text-gray-500 mt-1">Update product information</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Product Images */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-gray-800">
              Product Images
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Manage up to 10 product images
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            {/* Existing Images */}
            {existingImages.map((image, index) => (
              <div
                key={`existing-${index}`}
                className="relative w-32 h-32 rounded-xl border border-gray-200 overflow-hidden bg-gray-50 group"
              >
                <img
                  src={getImageUrl(image)}
                  alt={`Product ${index + 1}`}
                  className="w-full h-full object-contain"
                />

                <button
                  type="button"
                  onClick={() => handleRemoveExistingImage(index)}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition hover:bg-red-600"
                  title="Remove image"
                >
                  <MdDelete />
                </button>

                {index === 0 && (
                  <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs text-center py-1">
                    Main Image
                  </span>
                )}
              </div>
            ))}

            {/* New Images */}
            {newImages.map((image, index) => (
              <div
                key={`new-${index}`}
                className="relative w-32 h-32 rounded-xl border border-orange-200 overflow-hidden bg-orange-50 group"
              >
                <img
                  src={URL.createObjectURL(image)}
                  alt={`New product ${index + 1}`}
                  className="w-full h-full object-contain"
                />

                <button
                  type="button"
                  onClick={() => handleRemoveNewImage(index)}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition hover:bg-red-600"
                  title="Remove image"
                >
                  <MdDelete />
                </button>

                <span className="absolute bottom-0 left-0 right-0 bg-orange-500/80 text-white text-xs text-center py-1">
                  New Image
                </span>
              </div>
            ))}

            {/* Add Image */}
            {existingImages.length + newImages.length < 10 && (
              <label className="w-32 h-32 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition">
                <MdAddPhotoAlternate className="text-3xl text-gray-400" />

                <span className="text-sm text-gray-500 mt-2">Add Image</span>

                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  multiple
                  onChange={handleNewImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <p className="text-xs text-gray-400">
              JPG, JPEG, PNG or WEBP • Maximum 500KB per image
            </p>

            <p className="text-sm font-medium text-gray-600">
              {existingImages.length + newImages.length}
              /10 images
            </p>
          </div>
        </div>

        {/* Basic Information */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-gray-800">
              Basic Information
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Update the main product details
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InputField
              name="name"
              label="Product Name"
              placeholder="Samsung Galaxy S25"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <InputField
              name="brand"
              label="Brand"
              placeholder="Samsung"
              value={formData.brand}
              onChange={handleChange}
              required
            />

            <InputField
              name="model"
              label="Model"
              placeholder="Galaxy S25"
              value={formData.model}
              onChange={handleChange}
            />

            <InputField
              name="category"
              label="Category"
              placeholder="Mobile Phones"
              value={formData.category}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-gray-800">Pricing</h2>

            <p className="text-sm text-gray-500 mt-1">
              Update MRP and discount. Selling price is calculated
              automatically.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* MRP */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                MRP
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  ₹
                </span>

                <input
                  type="number"
                  name="mrp"
                  value={formData.mrp}
                  onChange={handleChange}
                  min="0"
                  required
                  className="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>
            </div>

            {/* Discount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount Amount
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  ₹
                </span>

                <input
                  type="number"
                  name="discount"
                  value={formData.discount}
                  onChange={handleChange}
                  min="0"
                  className="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>
            </div>

            {/* Selling Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selling Price
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500 font-semibold">
                  ₹
                </span>

                <input
                  type="text"
                  value={
                    sellingPrice > 0
                      ? sellingPrice.toLocaleString("en-IN")
                      : "0"
                  }
                  readOnly
                  className="w-full border border-orange-200 rounded-lg bg-orange-50 pl-9 pr-4 py-3 text-orange-600 font-semibold outline-none"
                />
              </div>

              {Number(formData.discount) > 0 && Number(formData.mrp) > 0 && (
                <p className="text-xs text-green-600 mt-2">
                  You save ₹{Number(formData.discount).toLocaleString("en-IN")}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-gray-800">
              Specifications
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Update the technical specifications
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InputField
              name="ram"
              label="RAM"
              placeholder="8GB"
              value={formData.ram}
              onChange={handleChange}
            />

            <InputField
              name="storage"
              label="Storage"
              placeholder="256GB"
              value={formData.storage}
              onChange={handleChange}
            />

            <InputField
              name="operatingSystem"
              label="Operating System"
              placeholder="Android 15"
              value={formData.operatingSystem}
              onChange={handleChange}
            />

            <InputField
              name="network"
              label="Network"
              placeholder="5G"
              value={formData.network}
              onChange={handleChange}
            />

            <InputField
              name="screenSize"
              label="Screen Size"
              placeholder="6.2 inches"
              value={formData.screenSize}
              onChange={handleChange}
            />

            <InputField
              name="battery"
              label="Battery"
              placeholder="4000mAh"
              value={formData.battery}
              onChange={handleChange}
            />

            <InputField
              name="processor"
              label="Processor"
              placeholder="Snapdragon 8 Elite"
              value={formData.processor}
              onChange={handleChange}
            />

            <InputField
              name="camera"
              label="Camera"
              placeholder="50MP"
              value={formData.camera}
              onChange={handleChange}
            />

            <InputField
              name="connectivity"
              label="Connectivity"
              placeholder="Bluetooth 5.3 / Wi-Fi"
              value={formData.connectivity}
              onChange={handleChange}
            />

            <InputField
              name="compatibility"
              label="Compatibility"
              placeholder="Android / iOS"
              value={formData.compatibility}
              onChange={handleChange}
            />

            <InputField
              name="waterResistance"
              label="Water Resistance"
              placeholder="IP68"
              value={formData.waterResistance}
              onChange={handleChange}
            />

            <InputField
              name="batteryLife"
              label="Battery Life"
              placeholder="Up to 7 days"
              value={formData.batteryLife}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Inventory */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-gray-800">Inventory</h2>

            <p className="text-sm text-gray-500 mt-1">
              Manage product stock levels
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Stock */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock Quantity
              </label>

              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                required
                className="w-full border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            {/* Low Stock Limit */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Low Stock Limit
              </label>

              <input
                type="number"
                name="lowStockLimit"
                value={formData.lowStockLimit}
                onChange={handleChange}
                min="0"
                required
                className="w-full border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />

              <p className="text-xs text-gray-400 mt-2">
                Product becomes low stock when stock reaches this limit.
              </p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-gray-800">Description</h2>

            <p className="text-sm text-gray-500 mt-1">
              Update the product description
            </p>
          </div>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="6"
            placeholder="Enter product description..."
            className="w-full border border-gray-200 rounded-lg px-4 py-3 outline-none resize-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
          />
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            className="px-6 py-3 rounded-lg border border-gray-200 bg-white text-gray-700 font-medium hover:bg-gray-50 transition"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="px-7 py-3 rounded-lg bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-medium transition"
          >
            {saving ? "Saving Product..." : "Update Product"}
          </button>
        </div>
      </form>
    </div>
  );
}

/* Reusable Input */

function InputField({
  name,
  label,
  placeholder,
  value,
  onChange,
  required = false,
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
      />
    </div>
  );
}

export default EditProduct;
