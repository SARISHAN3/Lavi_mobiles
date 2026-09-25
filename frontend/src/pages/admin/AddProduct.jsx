import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AddProduct() {
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
    network: "5G",
    screenSize: "",
    battery: "",
    processor: "",
    camera: "",
    stock: "",
    category: "Mobile Phones",
    description: "",
    images: "",
  });

  const [saving, setSaving] = useState(false);

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

      await axios.post(
        "http://localhost:5000/api/products",
        {
          ...formData,
          images: formData.images ? [formData.images] : [],
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

      alert("Product added successfully");

      navigate("/admin/products");
    } catch (error) {
      console.error(
        "Add product error:",
        error.response?.data || error.message,
      );

      alert(error.response?.data?.message || "Failed to add product");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Add Product</h1>

        <p className="text-gray-500 mt-1">Add a new mobile phone</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            ["name", "Product Name", "Samsung Galaxy S25"],
            ["brand", "Brand", "Samsung"],
            ["model", "Model", "Galaxy S25"],
            ["price", "Price", "74999"],
            ["mrp", "MRP", "79999"],
            ["discount", "Discount", "5000"],
            ["ram", "RAM", "8GB"],
            ["storage", "Storage", "256GB"],
            ["operatingSystem", "Operating System", "Android"],
            ["network", "Network", "5G"],
            ["screenSize", "Screen Size", "6.2 inches"],
            ["battery", "Battery", "4000mAh"],
            ["processor", "Processor", "Snapdragon"],
            ["camera", "Camera", "50MP"],
            ["stock", "Stock", "25"],
            ["category", "Category", "Mobile Phones"],
          ].map(([name, label, placeholder]) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
              </label>

              <input
                type={
                  ["price", "mrp", "discount", "stock"].includes(name)
                    ? "number"
                    : "text"
                }
                name={name}
                value={formData[name]}
                onChange={handleChange}
                placeholder={placeholder}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-orange-500"
                required={["name", "brand", "price", "mrp"].includes(name)}
              />
            </div>
          ))}

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              placeholder="Enter product description"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-orange-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Image URL
            </label>

            <input
              type="url"
              name="images"
              value={formData.images}
              onChange={handleChange}
              placeholder="https://example.com/product-image.jpg"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-orange-500"
            />

            <p className="text-sm text-gray-500 mt-2">
              Enter an image URL for the product.
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            type="submit"
            disabled={saving}
            className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white px-6 py-3 rounded-lg font-medium"
          >
            {saving ? "Adding..." : "Add Product"}
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

export default AddProduct;
