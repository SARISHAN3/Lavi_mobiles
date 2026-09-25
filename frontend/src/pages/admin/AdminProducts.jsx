import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const getProducts = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get("http://localhost:5000/api/products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProducts(response.data.products || []);
    } catch (error) {
      console.error(
        "Failed to load products:",
        error.response?.data || error.message,
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?",
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:5000/api/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== productId),
      );

      alert("Product deleted successfully");
    } catch (error) {
      console.error(
        "Delete product error:",
        error.response?.data || error.message,
      );

      alert(error.response?.data?.message || "Failed to delete product");
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Products</h1>

          <p className="text-gray-500 mt-1">Manage Lavi Mobile products</p>
        </div>

        <Link
          to="/admin/products/add"
          className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg font-medium"
        >
          + Add Product
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading products...</p>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Product
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Brand
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Price
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Stock
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Rating
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr
                    key={product._id}
                    className="border-b last:border-b-0 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {product.images?.[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-12 h-12 object-contain rounded-lg border"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-400">
                            No Image
                          </div>
                        )}

                        <div>
                          <p className="font-medium text-gray-800">
                            {product.name}
                          </p>

                          <p className="text-sm text-gray-500">
                            {product.model}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-gray-700">{product.brand}</td>

                    <td className="px-6 py-4 font-medium text-gray-800">
                      ₹{product.price.toLocaleString("en-IN")}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={
                          product.stock > 0 ? "text-green-600" : "text-red-600"
                        }
                      >
                        {product.stock}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-gray-700">
                      ⭐ {product.rating}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/admin/products/edit/${product._id}`}
                          className="px-3 py-1.5 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200"
                        >
                          Edit
                        </Link>

                        <button
                          onClick={() => handleDelete(product._id)}
                          className="px-3 py-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-200"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {products.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No products found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminProducts;
