import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/customer/Navbar";

// =========================================================
// BUDGET CARD
// =========================================================
// Displays one large price-range card.
// The first available product image is used as the background.
// =========================================================

function BudgetCard({ title, price, products = [], minPrice, maxPrice }) {
  const image = products?.[0]?.images?.[0];

  const query = new URLSearchParams();

  if (minPrice) {
    query.set("minPrice", minPrice);
  }

  if (maxPrice) {
    query.set("maxPrice", maxPrice);
  }

  return (
    <Link
      to={`/products?${query.toString()}`}
      className="group relative
                 min-w-[280px] md:min-w-[320px]
                 h-[170px] md:h-[195px]
                 rounded-xl overflow-hidden
                 bg-gradient-to-br
                 from-gray-800 to-gray-950
                 border border-gray-700
                 hover:border-orange-500
                 transition"
    >
      {/* Background Product Image */}
      {image && (
        <img
          src={image}
          alt={price}
          className="absolute inset-0
                     w-full h-full
                     object-cover
                     group-hover:scale-105
                     transition duration-500"
        />
      )}

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/55" />

      {/* Price Text */}
      <div className="absolute inset-0 p-5 md:p-6 flex flex-col justify-center">
        <p className="text-white text-lg md:text-xl font-medium">{title}</p>

        <h3 className="text-white text-3xl md:text-4xl font-bold">{price}</h3>

        <span className="text-orange-400 text-sm mt-3 font-medium">
          Explore Mobiles →
        </span>
      </div>
    </Link>
  );
}

function Home() {
  // =========================================================
  // HOMEPAGE DATA STATES
  // =========================================================

  const [products, setProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);

  // Stores all brands from the database
  const [brands, setBrands] = useState([]);

  // Stores products for different budget ranges
  const [budgetProducts, setBudgetProducts] = useState({});

  // Premium phones
  const [premiumPhones, setPremiumPhones] = useState([]);

  // Single loading state for homepage products
  const [loading, setLoading] = useState(true);

  // =========================================================
  // BRAND SLIDER REFERENCE
  // =========================================================

  const brandSliderRef = useRef(null);
  const budgetSliderRef = useRef(null);

  // Move brand slider left/right
  const scrollBrands = (direction) => {
    if (!brandSliderRef.current) {
      return;
    }

    brandSliderRef.current.scrollBy({
      left: direction === "left" ? -300 : 300,
      behavior: "smooth",
    });
  };
  const scrollBudget = (direction) => {
    if (!budgetSliderRef.current) {
      return;
    }

    budgetSliderRef.current.scrollBy({
      left: direction === "left" ? -350 : 350,
      behavior: "smooth",
    });
  };

  // =========================================================
  // BUDGET PRICE RANGES
  // =========================================================
  // These ranges are used to request products from the backend.
  // You can add/remove ranges here later without changing the UI.
  // =========================================================

  const budgetSections = [
    {
      id: "10k-20k",
      title: "₹10,001 - ₹20,000",
      minPrice: 10001,
      maxPrice: 20000,
    },
    {
      id: "20k-30k",
      title: "₹20,001 - ₹30,000",
      minPrice: 20001,
      maxPrice: 30000,
    },
    {
      id: "30k-50k",
      title: "₹30,001 - ₹50,000",
      minPrice: 30001,
      maxPrice: 50000,
    },
    {
      id: "50k-plus",
      title: "Above ₹50,000",
      minPrice: 50001,
      maxPrice: "",
    },
  ];

  // =========================================================
  // LOAD ALL HOMEPAGE DATA
  // =========================================================
  // Instead of having many useEffect functions, we use only
  // one useEffect and load everything together.
  // =========================================================

  useEffect(() => {
    const loadHomePageData = async () => {
      try {
        // -----------------------------------------------------
        // Create API requests for budget price ranges
        // -----------------------------------------------------

        const budgetRequests = budgetSections.map((section) =>
          axios.get("http://localhost:5000/api/products", {
            params: {
              minPrice: section.minPrice,
              maxPrice: section.maxPrice,
              limit: 4,
              sort: "price-low",
            },
          }),
        );

        // -----------------------------------------------------
        // Run all homepage API requests at the same time
        // -----------------------------------------------------

        const [
          featuredResponse,
          newResponse,
          bestSellerResponse,
          brandsResponse,
          ...budgetResponses
        ] = await Promise.all([
          // Featured products
          axios.get("http://localhost:5000/api/products", {
            params: {
              limit: 4,
            },
          }),

          // New arrivals
          // Backend default sorting is newest first.
          axios.get("http://localhost:5000/api/products", {
            params: {
              limit: 4,
            },
          }),

          // Best sellers
          // Currently using rating because actual sales count
          // is not stored in the Product model.
          axios.get("http://localhost:5000/api/products", {
            params: {
              limit: 4,
              sort: "rating",
            },
          }),

          // Get all brands from MongoDB
          axios.get("http://localhost:5000/api/brands"),

          // All budget price-range requests
          ...budgetRequests,

          // Premium phones
          axios.get("http://localhost:5000/api/products", {
            params: {
              minPrice: 50000,
              limit: 4,
              sort: "price-high",
            },
          }),
        ]);

        // -----------------------------------------------------
        // Store Featured Products
        // -----------------------------------------------------

        setProducts(featuredResponse.data.products || []);

        // -----------------------------------------------------
        // Store New Arrivals
        // -----------------------------------------------------

        setNewProducts(newResponse.data.products || []);

        // -----------------------------------------------------
        // Store Best Sellers
        // -----------------------------------------------------

        setBestSellers(bestSellerResponse.data.products || []);

        // -----------------------------------------------------
        // Store Brands
        // -----------------------------------------------------

        setBrands(brandsResponse.data.brands || []);

        // -----------------------------------------------------
        // Store Budget Products
        // -----------------------------------------------------

        const budgetData = {};

        budgetSections.forEach((section, index) => {
          budgetData[section.id] = budgetResponses[index]?.data?.products || [];
        });

        setBudgetProducts(budgetData);

        // -----------------------------------------------------
        // Store Premium Products
        // -----------------------------------------------------

        const premiumResponse = budgetResponses[budgetResponses.length - 1];

        setPremiumPhones(premiumResponse?.data?.products || []);
      } catch (error) {
        console.error(
          "Failed to load homepage data:",
          error.response?.data || error.message,
        );
      } finally {
        setLoading(false);
      }
    };

    loadHomePageData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      {/* =====================================================
          HERO SECTION
      ===================================================== */}

      <section className="bg-orange-500 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            {/* Hero Content */}
            <div>
              <p className="text-orange-100 font-medium mb-3">
                Welcome to Lavi Mobile
              </p>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Find Your Perfect Smartphone
              </h1>

              <p className="mt-5 text-orange-50 text-lg leading-7 max-w-xl">
                Explore the latest smartphones from top brands at great prices.
                Find powerful performance, amazing cameras, and the features you
                need.
              </p>

              <div className="flex flex-wrap gap-4 mt-8">
                <Link
                  to="/products"
                  className="bg-white text-orange-500 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
                >
                  Shop Mobiles
                </Link>

                <Link
                  to="/products"
                  className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-orange-500 transition"
                >
                  View Deals
                </Link>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="flex justify-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 md:p-12">
                <div className="text-[120px] md:text-[160px] leading-none">
                  📱
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          CATEGORIES
      ===================================================== */}

      <section className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold text-gray-800">Shop by Category</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-6">
          {[
            { name: "Budget Phones", search: "budget" },
            { name: "5G Phones", search: "5G" },
            { name: "Premium Phones", search: "premium" },
            { name: "Gaming Phones", search: "gaming" },
          ].map((category) => (
            <Link
              key={category.name}
              to={`/products?search=${encodeURIComponent(category.search)}`}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition text-center"
            >
              <div className="text-4xl mb-4">📱</div>

              <h3 className="font-semibold text-gray-800">{category.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* =====================================================
          FEATURED PRODUCTS
      ===================================================== */}

      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Featured Mobiles</h2>

          <Link
            to="/products"
            className="text-orange-500 hover:text-orange-600 font-medium"
          >
            View All
          </Link>
        </div>

        {loading ? (
          <p className="text-gray-500 mt-6">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="text-gray-500 mt-6">No products available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-4"
              >
                <div className="h-56 flex items-center justify-center bg-gray-50 rounded-lg">
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-contain p-4"
                    />
                  ) : (
                    <span className="text-gray-400">No Image</span>
                  )}
                </div>

                <p className="text-sm text-gray-500 mt-4">{product.brand}</p>

                <h3 className="font-semibold text-gray-800 mt-1 line-clamp-2">
                  {product.name}
                </h3>

                <div className="flex items-center gap-2 mt-2">
                  <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">
                    ★ {product.rating}
                  </span>

                  <span className="text-sm text-gray-500">
                    {product.reviewCount} Reviews
                  </span>
                </div>

                <div className="mt-3">
                  <span className="text-xl font-bold text-gray-900">
                    ₹{product.price.toLocaleString("en-IN")}
                  </span>

                  {product.mrp > product.price && (
                    <span className="ml-2 text-sm text-gray-400 line-through">
                      ₹{product.mrp.toLocaleString("en-IN")}
                    </span>
                  )}
                </div>

                <Link
                  to={`/product/${product._id}`}
                  className="block text-center mt-4 bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-lg font-medium"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* =====================================================
    POPULAR BRANDS
===================================================== */}

      <section className="bg-[#171717]">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Section Heading */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-gray-400 text-sm">
                Choose from top smartphone brands
              </p>

              <h2 className="text-2xl md:text-3xl font-bold text-white mt-1">
                Pick Your Smartphone Brand
              </h2>
            </div>

            <Link
              to="/products"
              className="text-orange-400 hover:text-orange-300 font-medium"
            >
              View All
            </Link>
          </div>

          {/* Brand Slider */}
          <div className="relative">
            {/* Left Arrow */}
            <button
              onClick={() => scrollBrands("left")}
              className="absolute left-[-15px] md:left-[-20px] top-1/2
                   -translate-y-1/2 z-10
                   w-10 h-10 rounded-full
                   bg-[#171717] text-white
                   flex items-center justify-center
                   text-3xl
                   hover:bg-orange-500
                   transition"
            >
              ‹
            </button>

            {/* Brand Cards */}
            <div
              ref={brandSliderRef}
              className="flex gap-4 md:gap-5 overflow-x-auto
                   scroll-smooth
                   px-2 md:px-4
                   pb-3
                   [scrollbar-width:none]
                   [&::-webkit-scrollbar]:hidden"
            >
              {brands.length === 0 ? (
                <p className="text-gray-400 py-10">No brands available.</p>
              ) : (
                brands.map((brand) => (
                  <Link
                    key={brand._id}
                    to={`/products?search=${encodeURIComponent(brand.name)}`}
                    className="group min-w-[220px] md:min-w-[300px]
                         h-[150px] md:h-[195px]
                         rounded-xl overflow-hidden
                         relative
                         bg-gradient-to-br
                         from-gray-700
                         to-gray-900
                         border border-gray-700
                         hover:border-orange-500
                         transition"
                  >
                    {/* Brand Image */}
                    {brand.logo ? (
                      <img
                        src={brand.logo}
                        alt={brand.name}
                        className="absolute inset-0
                             w-full h-full
                             object-contain
                             p-10
                             group-hover:scale-105
                             transition duration-300"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl md:text-4xl font-bold text-white">
                          {brand.name}
                        </span>
                      </div>
                    )}

                    {/* Dark Overlay */}
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition" />

                    {/* Brand Name */}
                    <div
                      className="absolute bottom-0 left-0 right-0
                              bg-black/60 backdrop-blur-sm
                              px-4 py-3"
                    >
                      <h3 className="text-white font-semibold text-lg">
                        {brand.name}
                      </h3>
                    </div>
                  </Link>
                ))
              )}
            </div>

            {/* Right Arrow */}
            <button
              onClick={() => scrollBrands("right")}
              className="absolute right-[-15px] md:right-[-20px] top-1/2
                   -translate-y-1/2 z-10
                   w-10 h-10 rounded-full
                   bg-[#171717] text-white
                   flex items-center justify-center
                   text-3xl
                   hover:bg-orange-500
                   transition"
            >
              ›
            </button>
          </div>
        </div>
      </section>

      {/* =====================================================
          DEALS & OFFERS
      ===================================================== */}

      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-orange-500 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 items-center">
            <div className="p-8 md:p-12 text-white">
              <p className="text-orange-100 font-medium">Limited Time Offer</p>

              <h2 className="text-3xl md:text-4xl font-bold mt-2">
                Great Deals on Smartphones
              </h2>

              <p className="mt-4 text-orange-50">
                Save more on the latest smartphones from popular brands. Don't
                miss our special offers.
              </p>

              <Link
                to="/products"
                className="inline-block mt-6 bg-white text-orange-500 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100"
              >
                Explore Deals
              </Link>
            </div>

            <div className="hidden md:flex items-center justify-center text-8xl py-12">
              📱
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          NEW ARRIVALS
      ===================================================== */}

      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-orange-500 font-medium">Just Added</p>

            <h2 className="text-2xl font-bold text-gray-800 mt-1">
              New Arrivals
            </h2>
          </div>

          <Link
            to="/products"
            className="text-orange-500 hover:text-orange-600 font-medium"
          >
            View All
          </Link>
        </div>

        {newProducts.length === 0 ? (
          <p className="text-gray-500 mt-6">No new products available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            {newProducts.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-4"
              >
                <div className="h-56 flex items-center justify-center bg-gray-50 rounded-lg">
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-contain p-4"
                    />
                  ) : (
                    <span className="text-gray-400">No Image</span>
                  )}
                </div>

                <p className="text-sm text-gray-500 mt-4">{product.brand}</p>

                <h3 className="font-semibold text-gray-800 mt-1 line-clamp-2">
                  {product.name}
                </h3>

                <div className="mt-3">
                  <span className="text-xl font-bold text-gray-900">
                    ₹{product.price.toLocaleString("en-IN")}
                  </span>

                  {product.mrp > product.price && (
                    <span className="ml-2 text-sm text-gray-400 line-through">
                      ₹{product.mrp.toLocaleString("en-IN")}
                    </span>
                  )}
                </div>

                <Link
                  to={`/product/${product._id}`}
                  className="block text-center mt-4 bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-lg font-medium"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* =====================================================
          BEST SELLERS
      ===================================================== */}

      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-500 font-medium">Customer Favorites</p>

              <h2 className="text-2xl font-bold text-gray-800 mt-1">
                Best Sellers
              </h2>
            </div>

            <Link
              to="/products"
              className="text-orange-500 hover:text-orange-600 font-medium"
            >
              View All
            </Link>
          </div>

          {bestSellers.length === 0 ? (
            <p className="text-gray-500 mt-6">No products available.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
              {bestSellers.map((product) => (
                <div
                  key={product._id}
                  className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition"
                >
                  <div className="h-56 flex items-center justify-center bg-white rounded-lg">
                    {product.images?.[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-contain p-4"
                      />
                    ) : (
                      <span className="text-gray-400">No Image</span>
                    )}
                  </div>

                  <p className="text-sm text-gray-500 mt-4">{product.brand}</p>

                  <h3 className="font-semibold text-gray-800 mt-1 line-clamp-2">
                    {product.name}
                  </h3>

                  <div className="flex items-center gap-2 mt-2">
                    <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">
                      ★ {product.rating}
                    </span>

                    <span className="text-sm text-gray-500">
                      {product.reviewCount} Reviews
                    </span>
                  </div>

                  <div className="mt-3">
                    <span className="text-xl font-bold text-gray-900">
                      ₹{product.price.toLocaleString("en-IN")}
                    </span>

                    {product.mrp > product.price && (
                      <span className="ml-2 text-sm text-gray-400 line-through">
                        ₹{product.mrp.toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>

                  <Link
                    to={`/product/${product._id}`}
                    className="block text-center mt-4 bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-lg font-medium"
                  >
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      {/* =====================================================
    FOR YOUR BUDGET
===================================================== */}

      <section className="bg-[#171717]">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Section Heading */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-gray-400 text-sm">
                Find a smartphone within your budget
              </p>

              <h2 className="text-2xl md:text-3xl font-bold text-white mt-1">
                For Your Budget
              </h2>
            </div>
          </div>

          {/* Budget Slider */}
          <div className="relative">
            {/* Left Arrow */}
            <button
              onClick={() => scrollBudget("left")}
              className="absolute left-[-15px] md:left-[-20px] top-1/2
                   -translate-y-1/2 z-10
                   w-10 h-10 rounded-full
                   bg-[#171717] text-white
                   flex items-center justify-center
                   text-3xl
                   hover:bg-orange-500
                   transition"
            >
              ‹
            </button>

            {/* Budget Cards */}
            <div
              ref={budgetSliderRef}
              className="flex gap-4 md:gap-5 overflow-x-auto
                   scroll-smooth
                   px-2 md:px-4
                   pb-3
                   [scrollbar-width:none]
                   [&::-webkit-scrollbar]:hidden"
            >
              {/* ₹10,001 - ₹20,000 */}
              <BudgetCard
                title="₹10,001 to"
                price="₹20,000"
                products={budgetProducts["10k-20k"]}
                minPrice="10001"
                maxPrice="20000"
              />

              {/* ₹20,001 - ₹30,000 */}
              <BudgetCard
                title="₹20,001 to"
                price="₹30,000"
                products={budgetProducts["20k-30k"]}
                minPrice="20001"
                maxPrice="30000"
              />

              {/* ₹30,001 - ₹50,000 */}
              <BudgetCard
                title="₹30,001 to"
                price="₹50,000"
                products={budgetProducts["30k-50k"]}
                minPrice="30001"
                maxPrice="50000"
              />

              {/* Above ₹50,000 */}
              <BudgetCard
                title="Above"
                price="₹50,000"
                products={premiumPhones}
                minPrice="50001"
              />
            </div>

            {/* Right Arrow */}
            <button
              onClick={() => scrollBudget("right")}
              className="absolute right-[-15px] md:right-[-20px] top-1/2
                   -translate-y-1/2 z-10
                   w-10 h-10 rounded-full
                   bg-[#171717] text-white
                   flex items-center justify-center
                   text-3xl
                   hover:bg-orange-500
                   transition"
            >
              ›
            </button>
          </div>
        </div>
      </section>

      {/* =====================================================
          WHY SHOP WITH LAVI MOBILE
      ===================================================== */}

      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h2 className="text-2xl font-bold text-gray-800">
            Why Shop With Lavi Mobile?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="p-6 border rounded-xl">
              <div className="text-3xl">🚚</div>

              <h3 className="font-semibold mt-4">Fast Delivery</h3>

              <p className="text-gray-500 mt-2">
                Get your smartphone delivered quickly and safely.
              </p>
            </div>

            <div className="p-6 border rounded-xl">
              <div className="text-3xl">🔒</div>

              <h3 className="font-semibold mt-4">Secure Shopping</h3>

              <p className="text-gray-500 mt-2">
                Your account and orders are protected.
              </p>
            </div>

            <div className="p-6 border rounded-xl">
              <div className="text-3xl">💰</div>

              <h3 className="font-semibold mt-4">Great Deals</h3>

              <p className="text-gray-500 mt-2">
                Find smartphones at competitive prices.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
