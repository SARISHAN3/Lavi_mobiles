import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useSearchParams } from "react-router-dom";
import { FiHeart } from "react-icons/fi";
import Navbar from "../../components/customer/Navbar";

function Products() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Get search value directly from URL
  const search = searchParams.get("search") || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(search);
  const [brands, setBrands] = useState([]);
  const [wishlistProducts, setWishlistProducts] = useState([]);

  const [brand, setBrand] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [priceRange, setPriceRange] = useState("");

  const [sort, setSort] = useState("");
  const [ram, setRam] = useState("");
  const [storage, setStorage] = useState("");
  const [network, setNetwork] = useState("");
  const [availability, setAvailability] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handleWishlist = async (productId) => {
    const token = localStorage.getItem("token");

    // User is not logged in
    if (!token) {
      alert("Please login to add products to wishlist.");
      return;
    }

    const isWishlisted = wishlistProducts.includes(productId);

    try {
      if (isWishlisted) {
        // Remove from wishlist
        await axios.delete(
          `http://localhost:5000/api/wishlist/remove/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setWishlistProducts((prev) => prev.filter((id) => id !== productId));
      } else {
        // Add to wishlist
        await axios.post(
          "http://localhost:5000/api/wishlist/add",
          { productId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setWishlistProducts((prev) => [...prev, productId]);
      }
    } catch (error) {
      console.error("Wishlist error:", error.response?.data || error.message);

      alert(
        error.response?.data?.message || "Something went wrong with wishlist.",
      );
    }
  };

  const clearFilters = () => {
    setSearchParams({});
    setBrand("");
    setMinPrice("");
    setMaxPrice("");
    setPriceRange("");
    setRam("");
    setStorage("");
    setNetwork("");
    setAvailability("");
    setSort("");
    setPage(1);
  };

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  useEffect(() => {
    const value = searchInput.trim();

    if (value) {
      setSearchParams({ search: value });
    } else {
      setSearchParams({});
    }

    setPage(1);
  }, [searchInput, setSearchParams]);

  useEffect(() => {
    const getWishlist = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setWishlistProducts([]);
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/api/wishlist", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const products = response.data.wishlist?.products || [];

        setWishlistProducts(products.map((product) => product._id));
      } catch (error) {
        console.error(
          "Failed to load wishlist:",
          error.response?.data || error.message,
        );
      }
    };

    getWishlist();

    const getBrands = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/brands");

        setBrands(response.data.brands);
      } catch (error) {
        console.error(
          "Failed to load brands:",
          error.response?.data || error.message,
        );
      }
    };

    getBrands();
  }, []);

  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);

        const response = await axios.get("http://localhost:5000/api/products", {
          params: {
            search,
            brand,
            minPrice,
            maxPrice,
            ram,
            storage,
            network,
            availability,
            sort,
            page,
            limit: 8,
          },
        });

        setProducts(response.data.products);
        setTotalPages(response.data.pagination.totalPages);
      } catch (error) {
        console.error(
          "Failed to load products:",
          error.response?.data || error.message,
        );
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, [
    search,
    brand,
    minPrice,
    maxPrice,
    ram,
    storage,
    network,
    availability,
    sort,
    page,
  ]);

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header and Filters */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Mobile Phones</h1>

          <p className="text-gray-500 mt-2">Explore our latest smartphones</p>

          <div className="mt-6">
            {/* Search */}
            <input
              type="text"
              // value={search}
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
              }}
              // onChange={(e) => {
              //   const value = e.target.value;

              //   if (value) {
              //     setSearchParams({ search: value });
              //   } else {
              //     setSearchParams({});
              //   }

              //   setPage(1);
              // }}
              placeholder="Search mobile phones..."
              className="w-full md:w-96 border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-orange-500"
            />

            {/* Brand */}
            <select
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="mt-4 w-full md:w-64 border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-orange-500"
            >
              <option value="">All Brands</option>

              {brands
                .filter((brandItem) => brandItem.isActive)
                .map((brandItem) => (
                  <option key={brandItem._id} value={brandItem.name}>
                    {brandItem.name}
                  </option>
                ))}
            </select>

            {/* RAM */}
            <select
              value={ram}
              onChange={(e) => setRam(e.target.value)}
              className="mt-4 w-full sm:w-48 border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-orange-500"
            >
              <option value="">All RAM</option>
              <option value="4GB">4GB</option>
              <option value="6GB">6GB</option>
              <option value="8GB">8GB</option>
              <option value="12GB">12GB</option>
              <option value="16GB">16GB</option>
            </select>

            {/* Storage */}
            <select
              value={storage}
              onChange={(e) => setStorage(e.target.value)}
              className="mt-4 w-full sm:w-48 border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-orange-500"
            >
              <option value="">All Storage</option>
              <option value="64GB">64GB</option>
              <option value="128GB">128GB</option>
              <option value="256GB">256GB</option>
              <option value="512GB">512GB</option>
              <option value="1TB">1TB</option>
            </select>

            {/* Network */}
            <select
              value={network}
              onChange={(e) => setNetwork(e.target.value)}
              className="mt-4 w-full sm:w-48 border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-orange-500"
            >
              <option value="">All Networks</option>
              <option value="5G">5G</option>
              <option value="4G">4G</option>
            </select>

            <select
              value={availability}
              onChange={(e) => {
                setAvailability(e.target.value);
                setPage(1);
              }}
              className="mt-4 w-full sm:w-48 border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-orange-500"
            >
              <option value="">All Products</option>
              <option value="in-stock">In Stock</option>
              <option value="out-of-stock">Out of Stock</option>
            </select>

            {/* Clear Filters */}
            <button
              onClick={clearFilters}
              className="mt-4 bg-gray-800 hover:bg-gray-900 text-white px-5 py-3 rounded-lg font-medium"
            >
              Clear Filters
            </button>

            {/* Price */}
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="Min Price"
                className="w-full sm:w-48 border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-orange-500"
              />

              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Max Price"
                className="w-full sm:w-48 border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-orange-500"
              />
            </div>

            <select
              value={priceRange}
              onChange={(e) => {
                const value = e.target.value;

                setPriceRange(value);

                if (value === "") {
                  setMinPrice("");
                  setMaxPrice("");
                }

                if (value === "under-20000") {
                  setMinPrice("");
                  setMaxPrice("20000");
                }

                if (value === "20000-40000") {
                  setMinPrice("20000");
                  setMaxPrice("40000");
                }

                if (value === "40000-60000") {
                  setMinPrice("40000");
                  setMaxPrice("60000");
                }

                if (value === "60000-100000") {
                  setMinPrice("60000");
                  setMaxPrice("100000");
                }

                if (value === "above-100000") {
                  setMinPrice("100000");
                  setMaxPrice("");
                }

                setPage(1);
              }}
              className="w-full sm:w-64 border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-orange-500"
            >
              <option value="">All Prices</option>
              <option value="under-20000">Under ₹20,000</option>
              <option value="20000-40000">₹20,000 - ₹40,000</option>
              <option value="40000-60000">₹40,000 - ₹60,000</option>
              <option value="60000-100000">₹60,000 - ₹1,00,000</option>
              <option value="above-100000">Above ₹1,00,000</option>
            </select>

            {/* Sort */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="mt-4 w-full sm:w-64 border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-orange-500"
            >
              <option value="">Sort By</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest</option>
              <option value="rating">Rating</option>
            </select>
          </div>
        </div>

        {/* Products */}
        {loading ? (
          <div className="bg-white rounded-xl p-10 text-center">
            <p className="text-gray-500">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-xl p-10 text-center">
            <p className="text-gray-500">No products available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden"
              >
                <div className="relative h-56 bg-gray-50 flex items-center justify-center p-5">
                  {/* Discount Badge */}
                  {product.mrp > product.price && (
                    <span className="absolute top-3 left-3 z-10 bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded">
                      {Math.round(
                        ((product.mrp - product.price) / product.mrp) * 100,
                      )}
                      % OFF
                    </span>
                  )}

                  {/* Wishlist Button */}
                  <button
                    onClick={() => handleWishlist(product._id)}
                    className={`absolute top-3 right-3 z-10 bg-white shadow-sm p-2 rounded-full transition ${
                      wishlistProducts.includes(product._id)
                        ? "text-red-500"
                        : "text-gray-600 hover:bg-orange-50 hover:text-orange-500"
                    }`}
                    title={
                      wishlistProducts.includes(product._id)
                        ? "Remove from Wishlist"
                        : "Add to Wishlist"
                    }
                  >
                    <FiHeart
                      size={18}
                      fill={
                        wishlistProducts.includes(product._id)
                          ? "currentColor"
                          : "none"
                      }
                    />
                  </button>

                  {/* Product Image */}
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="relative z-0 h-full w-full object-contain transition-transform duration-300 hover:scale-105"
                    />
                  ) : (
                    <span className="text-gray-400">No Image</span>
                  )}
                </div>

                {/* Product Details */}
                <div className="p-5">
                  <p className="text-sm text-orange-500 font-medium">
                    {product.brand}
                  </p>

                  <h2 className="font-semibold text-gray-800 mt-1 line-clamp-2">
                    {product.name}
                  </h2>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mt-2">
                    <span className="bg-green-600 text-white text-xs font-medium px-2 py-1 rounded">
                      ★ {product.rating || 0}
                    </span>

                    <span className="text-sm text-gray-500">
                      {product.reviewCount || 0}{" "}
                      {product.reviewCount === 1 ? "review" : "reviews"}
                    </span>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {product.ram && (
                      <span className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-md">
                        {product.ram} RAM
                      </span>
                    )}

                    {product.storage && (
                      <span className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-md">
                        {product.storage}
                      </span>
                    )}

                    {product.network && (
                      <span className="bg-orange-50 text-orange-600 text-xs px-2.5 py-1 rounded-md">
                        {product.network}
                      </span>
                    )}
                  </div>

                  {/* Stock Status */}
                  <div className="mt-3">
                    {product.stock <= 0 ? (
                      <span className="text-sm font-medium text-red-600">
                        Out of Stock
                      </span>
                    ) : product.stock <= 5 ? (
                      <span className="text-sm font-medium text-orange-600">
                        Only {product.stock} left
                      </span>
                    ) : (
                      <span className="text-sm font-medium text-green-600">
                        In Stock
                      </span>
                    )}
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2 mt-4">
                    <span className="text-xl font-bold text-gray-900">
                      ₹{product.price.toLocaleString("en-IN")}
                    </span>

                    {product.mrp > product.price && (
                      <>
                        <span className="text-sm text-gray-400 line-through">
                          ₹{product.mrp.toLocaleString("en-IN")}
                        </span>

                        <span className="text-xs font-semibold text-green-600">
                          {Math.round(
                            ((product.mrp - product.price) / product.mrp) * 100,
                          )}
                          % OFF
                        </span>
                      </>
                    )}
                  </div>

                  {/* Details Button */}
                  <Link
                    to={`/product/${product._id}`}
                    className="block text-center mt-5 bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-lg font-medium"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-10">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="px-4 py-2 border rounded-lg disabled:opacity-40 hover:bg-gray-100"
            >
              Previous
            </button>

            <span className="px-4 py-2 font-medium">
              Page {page} of {totalPages}
            </span>

            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className="px-4 py-2 border rounded-lg disabled:opacity-40 hover:bg-gray-100"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;
