import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  MdSearch,
  MdFilterList,
  MdChevronLeft,
  MdChevronRight,
  MdClose,
} from "react-icons/md";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // Filters
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("");
  const [availability, setAvailability] = useState("");
  const [sort, setSort] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [showFilters, setShowFilters] = useState(false);

  const productsPerPage = 6;

  const getProducts = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const params = {
        page: currentPage,
        limit: productsPerPage,
      };

      if (search.trim()) {
        params.search = search.trim();
      }

      if (brand) {
        params.brand = brand;
      }

      if (availability) {
        params.availability = availability;
      }

      if (sort) {
        params.sort = sort;
      }

      if (minPrice) {
        params.minPrice = minPrice;
      }

      if (maxPrice) {
        params.maxPrice = maxPrice;
      }

      const response = await axios.get("http://localhost:5000/api/products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params,
      });

      setProducts(response.data.products || []);

      setTotalPages(response.data.pagination?.totalPages || 1);

      setTotalProducts(response.data.pagination?.totalProducts || 0);
    } catch (error) {
      console.error(
        "Failed to load products:",
        error.response?.data || error.message,
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, [currentPage, search, brand, availability, sort, minPrice, maxPrice]);

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

      setTotalProducts((prev) => Math.max(prev - 1, 0));

      alert("Product deleted successfully");
    } catch (error) {
      console.error(
        "Delete product error:",
        error.response?.data || error.message,
      );

      alert(error.response?.data?.message || "Failed to delete product");
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleBrandChange = (e) => {
    setBrand(e.target.value);
    setCurrentPage(1);
  };

  const handleAvailabilityChange = (e) => {
    setAvailability(e.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSort(e.target.value);
    setCurrentPage(1);
  };

  const handleMinPriceChange = (e) => {
    setMinPrice(e.target.value);
    setCurrentPage(1);
  };

  const handleMaxPriceChange = (e) => {
    setMaxPrice(e.target.value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearch("");
    setBrand("");
    setAvailability("");
    setSort("");
    setMinPrice("");
    setMaxPrice("");
    setCurrentPage(1);
  };

  const hasFilters =
    search || brand || availability || sort || minPrice || maxPrice;

  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Products</h1>

          <p className="text-gray-500 mt-1">Manage your Lavi Mobile products</p>
        </div>

        <Link
          to="/admin/products/add"
          className="inline-flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg font-medium transition"
        >
          + Add Product
        </Link>
      </div>

      {/* Search + Filter */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />

            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder="Search products or model..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            />
          </div>

          {/* Brand */}
          <select
            value={brand}
            onChange={handleBrandChange}
            className="px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-orange-500 bg-white"
          >
            <option value="">All Brands</option>
            <option value="Apple">Apple</option>
            <option value="Samsung">Samsung</option>
            <option value="OnePlus">OnePlus</option>
            <option value="Xiaomi">Xiaomi</option>
            <option value="Vivo">Vivo</option>
            <option value="Oppo">Oppo</option>
            <option value="Realme">Realme</option>
            <option value="Nothing">Nothing</option>
          </select>

          {/* Filter Button */}
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border transition ${
              showFilters
                ? "border-orange-500 text-orange-500 bg-orange-50"
                : "border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            <MdFilterList className="text-xl" />
            Filters
          </button>
        </div>

        {/* More Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Availability */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Availability
                </label>

                <select
                  value={availability}
                  onChange={handleAvailabilityChange}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-orange-500"
                >
                  <option value="">All</option>
                  <option value="in-stock">In Stock</option>
                  <option value="out-of-stock">Out of Stock</option>
                </select>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Sort By
                </label>

                <select
                  value={sort}
                  onChange={handleSortChange}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-orange-500"
                >
                  <option value="">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rating</option>
                </select>
              </div>

              {/* Min Price */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Minimum Price
                </label>

                <input
                  type="number"
                  value={minPrice}
                  onChange={handleMinPriceChange}
                  placeholder="₹ Minimum"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-orange-500"
                />
              </div>

              {/* Max Price */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Maximum Price
                </label>

                <input
                  type="number"
                  value={maxPrice}
                  onChange={handleMaxPriceChange}
                  placeholder="₹ Maximum"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-orange-500"
                />
              </div>
            </div>

            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-4 inline-flex items-center gap-1 text-sm text-red-500 hover:text-red-600"
              >
                <MdClose />
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Product Count */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">
          Showing{" "}
          <span className="font-semibold text-gray-700">{products.length}</span>{" "}
          of{" "}
          <span className="font-semibold text-gray-700">{totalProducts}</span>{" "}
          products
        </p>
      </div>

      {/* Products Table */}
      {loading ? (
        <div className="bg-white rounded-xl border border-gray-100 p-10 text-center">
          <p className="text-gray-500">Loading products...</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                    Product
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                    Brand
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                    Price
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                    Stock
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                    Status
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                    Rating
                  </th>

                  <th className="text-center px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr
                    key={product._id}
                    className="border-b last:border-b-0 hover:bg-gray-50 transition"
                  >
                    {/* Product */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {product.images?.[0] ? (
                          <img
                            src={
                              product.images[0].startsWith("http")
                                ? product.images[0]
                                : `http://localhost:5000${product.images[0]}`
                            }
                            alt={product.name}
                            className="w-12 h-12 object-contain rounded-lg border border-gray-100 bg-white"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-400">
                            No Image
                          </div>
                        )}

                        <div className="min-w-0">
                          <p className="font-medium text-gray-800 truncate max-w-[220px]">
                            {product.name}
                          </p>

                          <p className="text-sm text-gray-400">
                            {product.model || "No model"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Brand */}
                    <td className="px-6 py-4">
                      <span className="text-gray-700">{product.brand}</span>
                    </td>

                    {/* Price */}
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-800">
                        ₹{product.price.toLocaleString("en-IN")}
                      </p>

                      {product.mrp > product.price && (
                        <p className="text-xs text-gray-400 line-through">
                          ₹{product.mrp.toLocaleString("en-IN")}
                        </p>
                      )}
                    </td>

                    {/* Stock */}
                    <td className="px-6 py-4">{product.stock}</td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      {product.stock === 0 ? (
                        <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">
                          Out of stock
                        </span>
                      ) : product.stock <= (product.lowStockLimit || 5) ? (
                        <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-600">
                          Low stock
                        </span>
                      ) : (
                        <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
                          in stock
                        </span>
                      )}
                    </td>

                    {/* Rating */}
                    <td className="px-6 py-4">
                      <span className="text-gray-700">
                        ⭐ {product.rating || 0}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          to={`/admin/products/edit/${product._id}`}
                          title="Edit product"
                          className="w-9 h-9 flex items-center justify-center rounded-lg text-blue-600 hover:bg-blue-100 transition"
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
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleDelete(product._id)}
                          title="Delete product"
                          className="w-9 h-9 flex items-center justify-center rounded-lg text-red-500 hover:bg-red-100 transition"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="1em"
                            height="1em"
                            viewBox="0 0 24 24"
                          >
                            <path d="M0 0h24v24H0z" fill="none" />
                            <path
                              fill="currentColor"
                              d="M7 21q-.825 0-1.412-.587T5 19V6q-.425 0-.712-.288T4 5t.288-.712T5 4h4q0-.425.288-.712T10 3h4q.425 0 .713.288T15 4h4q.425 0 .713.288T20 5t-.288.713T19 6v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zM7 6v13zm5 7.9l1.9 1.9q.275.275.7.275t.7-.275t.275-.7t-.275-.7l-1.9-1.9l1.9-1.9q.275-.275.275-.7t-.275-.7t-.7-.275t-.7.275L12 11.1l-1.9-1.9q-.275-.275-.7-.275t-.7.275t-.275.7t.275.7l1.9 1.9l-1.9 1.9q-.275.275-.275.7t.275.7t.7.275t.7-.275z"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {products.length === 0 && (
            <div className="p-10 text-center">
              <p className="text-gray-500">No products found.</p>

              {hasFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-3 text-sm text-orange-500 hover:text-orange-600"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}

          {/* Pagination */}
          {totalProducts > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                Page{" "}
                <span className="font-medium text-gray-700">{currentPage}</span>{" "}
                of{" "}
                <span className="font-medium text-gray-700">{totalPages}</span>
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <MdChevronLeft className="text-xl" />
                  Previous
                </button>

                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  className="flex items-center gap-1 px-3 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next
                  <MdChevronRight className="text-xl" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminProducts;
