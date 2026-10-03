import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  FiArrowRight,
  FiChevronLeft,
  FiChevronRight,
  FiTruck,
  FiShield,
  FiTag,
  FiHeart,
} from "react-icons/fi";

import Navbar from "../../components/customer/Navbar";

import mobileBanner from "../../assets/mobile-banner.jpg";
import iphoneBanner from "../../assets/iphone-banner.jpg";
import samsungS26ultraBanner from "../../assets/samsung-s26ultra-banner.jpg";
import iphone18ProMaxBanner from "../../assets/iphone-18promax-banner.jpg";

/* =========================================================
   CONSTANTS
========================================================= */

const API_URL = "http://localhost:5000";

/* =========================================================
   IMAGE URL HELPER
========================================================= */

const getImageUrl = (image) => {
  if (!image) {
    return "";
  }

  if (image.startsWith("http")) {
    return image;
  }

  if (image.startsWith("/")) {
    return `${API_URL}${image}`;
  }

  return `${API_URL}/${image}`;
};

/* =========================================================
   PRICE FORMAT
========================================================= */

const formatPrice = (price) => {
  return `₹${Number(price || 0).toLocaleString("en-IN")}`;
};

/* =========================================================
   PRODUCT CARD
========================================================= */

function ProductCard({ product, showRating = false }) {
  return (
    <div
      className="
        lavi-card
        group
        min-w-[180px]
        sm:min-w-[200px]
        md:min-w-[215px]
        rounded-xl
        overflow-hidden
        p-3
        sm:p-4
      "
    >
      {/* Image */}

      <Link
        to={`/product/${product._id}`}
        className="
          block
          h-[180px]
          sm:h-[200px]
          rounded-lg
          overflow-hidden
          bg-gray-50
          dark:bg-[#17191c]
        "
      >
        {product.images?.[0] ? (
          <img
            src={getImageUrl(product.images[0])}
            alt={product.name}
            className="
              w-full
              h-full
              object-contain
              p-3
              group-hover:scale-105
              transition-transform
              duration-300
            "
          />
        ) : (
          <div
            className="
              w-full
              h-full
              flex
              items-center
              justify-center
              lavi-muted
              text-sm
            "
          >
            No Image
          </div>
        )}
      </Link>

      {/* Brand */}

      <p className="lavi-muted text-xs mt-3">{product.brand}</p>

      {/* Product name */}

      <Link to={`/product/${product._id}`}>
        <h3
          className="
            lavi-heading
            font-semibold
            text-sm
            mt-1
            line-clamp-2
            min-h-[40px]
            hover:text-orange-500
            transition
          "
        >
          {product.name}
        </h3>
      </Link>

      {/* Rating */}

      {showRating && (
        <div className="flex items-center gap-2 mt-2">
          <span
            className="
              bg-green-600
              text-white
              text-[11px]
              px-2
              py-1
              rounded
            "
          >
            ★ {Number(product.rating || 0).toFixed(1)}
          </span>

          <span className="lavi-muted text-xs">
            {product.reviewCount || 0} Reviews
          </span>
        </div>
      )}

      {/* Price */}

      <div className="mt-3">
        <span className="lavi-heading font-bold text-base sm:text-lg">
          {formatPrice(product.price)}
        </span>

        {Number(product.mrp) > Number(product.price) && (
          <span className="lavi-muted text-xs line-through ml-2">
            {formatPrice(product.mrp)}
          </span>
        )}
      </div>

      {/* Button */}

      <Link
        to={`/product/${product._id}`}
        className="
          lavi-button
          mt-3
          w-full
          flex
          items-center
          justify-center
          gap-2
          py-2
          rounded-lg
          text-sm
          font-medium
        "
      >
        View Details
        <FiArrowRight size={14} />
      </Link>
    </div>
  );
}

/* =========================================================
   SECTION HEADER
========================================================= */

function SectionHeader({ title, subtitle, viewAll = true, dark = false }) {
  return (
    <div className="flex items-end justify-between gap-4 mb-5">
      <div>
        {subtitle && (
          <p
            className={
              dark
                ? "text-orange-400 text-xs sm:text-sm font-medium mb-1"
                : "text-orange-500 text-xs sm:text-sm font-medium mb-1"
            }
          >
            {subtitle}
          </p>
        )}

        <h2
          className={
            dark
              ? "text-white text-xl sm:text-2xl font-bold"
              : "lavi-heading text-xl sm:text-2xl font-bold"
          }
        >
          {title}
        </h2>
      </div>

      {viewAll && (
        <Link
          to="/products"
          className="
            shrink-0
            text-orange-500
            hover:text-orange-600
            text-sm
            font-medium
            flex
            items-center
            gap-1
          "
        >
          View All
          <FiArrowRight size={15} />
        </Link>
      )}
    </div>
  );
}

/* =========================================================
   HORIZONTAL PRODUCT SECTION
========================================================= */

function ProductSlider({ products, sliderRef, showRating = false }) {
  const scroll = (direction) => {
    if (!sliderRef.current) {
      return;
    }

    sliderRef.current.scrollBy({
      left: direction === "left" ? -500 : 500,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative">
      {/* Left */}

      <button
        type="button"
        onClick={() => scroll("left")}
        className="
          absolute
          left-[-10px]
          sm:left-[-18px]
          top-1/2
          -translate-y-1/2
          z-20
          w-9
          h-9
          rounded-full
          lavi-card
          flex
          items-center
          justify-center
          lavi-heading
          hover:bg-orange-500
          hover:text-white
          transition
        "
      >
        <FiChevronLeft size={20} />
      </button>

      {/* Products */}

      <div
        ref={sliderRef}
        className="
          flex
          gap-4
          overflow-x-auto
          scroll-smooth
          pb-3
          px-1
          hide-scrollbar
        "
      >
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            showRating={showRating}
          />
        ))}
      </div>

      {/* Right */}

      <button
        type="button"
        onClick={() => scroll("right")}
        className="
          absolute
          right-[-10px]
          sm:right-[-18px]
          top-1/2
          -translate-y-1/2
          z-20
          w-9
          h-9
          rounded-full
          lavi-card
          flex
          items-center
          justify-center
          lavi-heading
          hover:bg-orange-500
          hover:text-white
          transition
        "
      >
        <FiChevronRight size={20} />
      </button>
    </div>
  );
}

/* =========================================================
   BRAND CARD
========================================================= */

function BrandCard({ brand }) {
  return (
    <Link
      to={`/products?search=${encodeURIComponent(brand.name)}`}
      className="
        lavi-card
        group
        min-w-[170px]
        sm:min-w-[210px]
        h-[125px]
        sm:h-[145px]
        rounded-xl
        overflow-hidden
        relative
        flex
        items-center
        justify-center
        p-5
        hover:border-orange-500
        transition
      "
    >
      {brand.logo ? (
        <img
          src={getImageUrl(brand.logo)}
          alt={brand.name}
          className="
            max-w-[130px]
            max-h-[70px]
            object-contain
            group-hover:scale-105
            transition
          "
        />
      ) : (
        <span className="lavi-heading text-xl font-bold">{brand.name}</span>
      )}

      <div
        className="
          absolute
          bottom-0
          left-0
          right-0
          px-3
          py-2
          bg-black/60
          text-white
          text-center
          text-sm
          font-medium
        "
      >
        {brand.name}
      </div>
    </Link>
  );
}

/* =========================================================
   BUDGET CARD
========================================================= */

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
      className="
        group
        relative
        min-w-[230px]
        sm:min-w-[270px]
        md:min-w-[300px]
        h-[145px]
        sm:h-[165px]
        rounded-xl
        overflow-hidden
        border
        border-[var(--border-color)]
        bg-gray-100
        dark:bg-[#17191c]
        hover:border-orange-500
        transition
      "
    >
      {/* Product Image */}

      {image && (
        <img
          src={getImageUrl(image)}
          alt={price}
          className="
            absolute
            inset-0
            w-full
            h-full
            object-cover
            opacity-40
            group-hover:scale-105
            transition
            duration-500
          "
        />
      )}

      {/* Overlay */}

      <div
        className="
          absolute
          inset-0
          bg-gradient-to-r
          from-black/90
          via-black/60
          to-black/20
        "
      />

      {/* Content */}

      <div
        className="
          absolute
          inset-0
          p-5
          flex
          flex-col
          justify-center
        "
      >
        <p className="text-white text-sm sm:text-base">{title}</p>

        <h3 className="text-white text-2xl sm:text-3xl font-bold">{price}</h3>

        <span className="text-orange-400 text-xs sm:text-sm mt-2">
          Explore Mobiles →
        </span>
      </div>
    </Link>
  );
}

/* =========================================================
   CATEGORY SHORTCUT
========================================================= */

function CategoryCard({ icon, title, description, link }) {
  return (
    <Link
      to={link}
      className="
        lavi-card
        group
        rounded-xl
        p-5
        text-center
        hover:-translate-y-1
        hover:border-orange-500
        transition
      "
    >
      <div
        className="
          w-12
          h-12
          mx-auto
          rounded-full
          bg-orange-100
          dark:bg-orange-500/10
          text-orange-500
          flex
          items-center
          justify-center
          text-2xl
          group-hover:bg-orange-500
          group-hover:text-white
          transition
        "
      >
        {icon}
      </div>

      <h3 className="lavi-heading font-semibold mt-4">{title}</h3>

      <p className="lavi-text text-xs mt-1">{description}</p>
    </Link>
  );
}

/* =========================================================
   HOME
========================================================= */

function Home() {
  /* =========================================================
     DATA
  ========================================================= */

  const [allProducts, setAllProducts] = useState([]);

  const [featuredProducts, setFeaturedProducts] = useState([]);

  const [newProducts, setNewProducts] = useState([]);

  const [bestSellers, setBestSellers] = useState([]);

  const [brands, setBrands] = useState([]);

  const [dealsOfWeek, setDealsOfWeek] = useState([]);

  const [budgetProducts, setBudgetProducts] = useState({});

  const [premiumPhones, setPremiumPhones] = useState([]);

  const [smartWatches, setSmartWatches] = useState([]);

  const [accessories, setAccessories] = useState([]);

  const [appleProducts, setAppleProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  /* =========================================================
     SLIDER REFS
  ========================================================= */

  const latestSliderRef = useRef(null);

  const appleSliderRef = useRef(null);

  const watchSliderRef = useRef(null);

  const accessoriesSliderRef = useRef(null);

  const brandSliderRef = useRef(null);

  const budgetSliderRef = useRef(null);

  /* =========================================================
     BUDGET SECTIONS
  ========================================================= */

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

  /* =========================================================
     LOAD DATA
  ========================================================= */

  useEffect(() => {
    const loadHomePageData = async () => {
      try {
        setLoading(true);

        /* -----------------------------------------------
           PRODUCTS
        ------------------------------------------------ */

        const productsResponse = await axios.get(`${API_URL}/api/products`, {
          params: {
            limit: 100,
            sort: "createdAt",
          },
        });

        const products = productsResponse.data.products || [];

        setAllProducts(products);

        /* -----------------------------------------------
           FEATURED
        ------------------------------------------------ */

        const featured = products
          .filter((product) => product.isFeatured === true)
          .slice(0, 8);

        setFeaturedProducts(featured);

        /* -----------------------------------------------
           NEW ARRIVALS
        ------------------------------------------------ */

        const newest = [...products]
          .sort(
            (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
          )
          .slice(0, 8);

        setNewProducts(newest);

        /* -----------------------------------------------
           TOP RATED / POPULAR
        ------------------------------------------------ */

        const popular = [...products]
          .sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0))
          .slice(0, 8);

        setBestSellers(popular);

        /* -----------------------------------------------
           APPLE
        ------------------------------------------------ */

        const apple = products
          .filter((product) => product.brand?.toLowerCase() === "apple")
          .slice(0, 8);

        setAppleProducts(apple);

        /* -----------------------------------------------
           SMART WATCHES
        ------------------------------------------------ */

        const watches = products.filter((product) => {
          const value = `${product.category || ""} ${
            product.name || ""
          }`.toLowerCase();

          return value.includes("watch") || value.includes("smartwatch");
        });

        setSmartWatches(watches.slice(0, 8));

        /* -----------------------------------------------
           ACCESSORIES
        ------------------------------------------------ */

        const accessoryProducts = products.filter((product) => {
          const value = `${product.category || ""} ${
            product.name || ""
          }`.toLowerCase();

          return (
            value.includes("accessor") ||
            value.includes("charger") ||
            value.includes("case") ||
            value.includes("earphone") ||
            value.includes("earbuds") ||
            value.includes("power bank")
          );
        });

        setAccessories(accessoryProducts.slice(0, 8));

        /* -----------------------------------------------
           BRANDS
        ------------------------------------------------ */

        const brandsResponse = await axios.get(`${API_URL}/api/brands`);

        setBrands(brandsResponse.data.brands || []);

        /* -----------------------------------------------
           DEALS
        ------------------------------------------------ */

        try {
          const dealsResponse = await axios.get(
            `${API_URL}/api/dashboard/deals-of-week`,
          );

          setDealsOfWeek(dealsResponse.data.products || []);
        } catch (error) {
          console.error("Failed to load deals:", error);
        }

        /* -----------------------------------------------
           BUDGET PRODUCTS
        ------------------------------------------------ */

        const budgetRequests = budgetSections.map((section) =>
          axios.get(`${API_URL}/api/products`, {
            params: {
              minPrice: section.minPrice,
              maxPrice: section.maxPrice,
              limit: 4,
              sort: "price-low",
            },
          }),
        );

        const budgetResponses = await Promise.all(budgetRequests);

        const budgetData = {};

        budgetSections.forEach((section, index) => {
          budgetData[section.id] = budgetResponses[index]?.data?.products || [];
        });

        setBudgetProducts(budgetData);

        /* -----------------------------------------------
           PREMIUM
        ------------------------------------------------ */

        const premiumResponse = await axios.get(`${API_URL}/api/products`, {
          params: {
            minPrice: 50001,
            limit: 4,
            sort: "price-high",
          },
        });

        setPremiumPhones(premiumResponse.data.products || []);
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

  /* =========================================================
     SLIDER HELPER
  ========================================================= */

  const scrollSlider = (ref, direction, amount = 500) => {
    if (!ref.current) {
      return;
    }

    ref.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="lavi-page">
      <Navbar />

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="w-full overflow-hidden">
        <div className="relative h-[240px] sm:h-[320px] md:h-[420px]">
          <img
            src={mobileBanner}
            alt="Lavi Mobile"
            className="
              absolute
              inset-0
              w-full
              h-full
              object-cover
            "
          />

          <div
            className="
              absolute
              inset-0
              bg-gradient-to-r
              from-black/80
              via-black/40
              to-transparent
            "
          />

          <div
            className="
              relative
              max-w-7xl
              mx-auto
              h-full
              px-5
              sm:px-6
              flex
              items-center
            "
          >
            <div className="max-w-xl text-white">
              <p className="text-orange-400 font-semibold text-sm sm:text-base">
                Welcome to Lavi Mobile
              </p>

              <h1
                className="
                  text-3xl
                  sm:text-4xl
                  md:text-5xl
                  font-bold
                  leading-tight
                  mt-2
                "
              >
                Latest Smartphones.
                <br />
                Best Prices.
              </h1>

              <p className="text-gray-200 text-sm sm:text-base mt-4 max-w-md">
                Discover the latest smartphones from your favourite brands at
                great prices.
              </p>

              <Link
                to="/products"
                className="
                  inline-flex
                  items-center
                  gap-2
                  mt-5
                  bg-orange-500
                  hover:bg-orange-600
                  text-white
                  px-5
                  py-2.5
                  rounded-lg
                  text-sm
                  font-semibold
                  transition
                "
              >
                Shop Now
                <FiArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          QUICK CATEGORIES
      ===================================================== */}

      <section className="max-w-7xl mx-auto px-5 sm:px-6 py-8">
        <SectionHeader
          title="Shop by Category"
          subtitle="Explore our collection"
          viewAll={false}
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <CategoryCard
            icon="📱"
            title="Budget Phones"
            description="Affordable smartphones"
            link="/products?minPrice=10001&maxPrice=30000"
          />

          <CategoryCard
            icon="📶"
            title="5G Phones"
            description="Fast & powerful"
            link="/products?network=5G"
          />

          <CategoryCard
            icon="💎"
            title="Premium Phones"
            description="Flagship smartphones"
            link="/products?minPrice=50000"
          />

          <CategoryCard
            icon="🎮"
            title="Gaming Phones"
            description="Built for gaming"
            link="/products?search=gaming"
          />
        </div>
      </section>

      {/* =====================================================
          LATEST MOBILE PHONES
      ===================================================== */}

      <section className="max-w-7xl mx-auto px-5 sm:px-6 py-8">
        <SectionHeader
          title="Latest Mobile Phones"
          subtitle="Newly added smartphones"
        />

        {loading ? (
          <div className="lavi-card rounded-xl p-8 text-center lavi-text">
            Loading products...
          </div>
        ) : newProducts.length === 0 ? (
          <div className="lavi-card rounded-xl p-8 text-center lavi-text">
            No mobile phones available.
          </div>
        ) : (
          <ProductSlider products={newProducts} sliderRef={latestSliderRef} />
        )}
      </section>

      {/* =====================================================
          FEATURED PRODUCTS
      ===================================================== */}

      {featuredProducts.length > 0 && (
        <section className="lavi-card border-x-0 rounded-none">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 py-8">
            <SectionHeader
              title="Featured Products"
              subtitle="Handpicked for you"
            />

            <ProductSlider
              products={featuredProducts}
              sliderRef={appleSliderRef}
              showRating
            />
          </div>
        </section>
      )}

      {/* =====================================================
          APPLE PRODUCTS
      ===================================================== */}

      {appleProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-5 sm:px-6 py-8">
          <SectionHeader
            title="Apple Products"
            subtitle="Explore Apple smartphones"
          />

          <ProductSlider
            products={appleProducts}
            sliderRef={watchSliderRef}
            showRating
          />
        </section>
      )}

      {/* =====================================================
          DEALS OF THE WEEK
      ===================================================== */}

      {dealsOfWeek.length > 0 && (
        <section className="lavi-card border-x-0 rounded-none">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 py-8">
            <SectionHeader
              title="Deals of the Week"
              subtitle="Popular picks this week"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {dealsOfWeek.slice(0, 4).map((product) => (
                <div key={product._id} className="relative">
                  <div
                    className="
                        absolute
                        top-2
                        left-2
                        z-10
                        bg-orange-500
                        text-white
                        text-[10px]
                        font-semibold
                        px-2.5
                        py-1
                        rounded-full
                      "
                  >
                    {product.totalSold} sold
                  </div>

                  <ProductCard product={product} showRating />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =====================================================
          SMART WATCH
      ===================================================== */}

      {smartWatches.length > 0 && (
        <section className="max-w-7xl mx-auto px-5 sm:px-6 py-8">
          <SectionHeader
            title="Smart Watch"
            subtitle="Smart technology for your wrist"
          />

          <ProductSlider
            products={smartWatches}
            sliderRef={accessoriesSliderRef}
            showRating
          />
        </section>
      )}

      {/* =====================================================
          ACCESSORIES
      ===================================================== */}

      {accessories.length > 0 && (
        <section className="lavi-card border-x-0 rounded-none">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 py-8">
            <SectionHeader
              title="Accessories"
              subtitle="Complete your mobile experience"
            />

            <ProductSlider products={accessories} sliderRef={brandSliderRef} />
          </div>
        </section>
      )}

      {/* =====================================================
          POPULAR BRANDS
      ===================================================== */}

      <section className="max-w-7xl mx-auto px-5 sm:px-6 py-8">
        <SectionHeader
          title="Popular Brands"
          subtitle="Choose your favourite smartphone brand"
        />

        <div className="relative">
          <button
            type="button"
            onClick={() => scrollSlider(brandSliderRef, "left", 450)}
            className="
              absolute
              left-[-10px]
              sm:left-[-18px]
              top-1/2
              -translate-y-1/2
              z-20
              w-9
              h-9
              rounded-full
              lavi-card
              lavi-heading
              flex
              items-center
              justify-center
              hover:bg-orange-500
              hover:text-white
              transition
            "
          >
            <FiChevronLeft size={19} />
          </button>

          <div
            ref={brandSliderRef}
            className="
              flex
              gap-4
              overflow-x-auto
              hide-scrollbar
              scroll-smooth
              pb-3
              px-1
            "
          >
            {brands.map((brand) => (
              <BrandCard key={brand._id} brand={brand} />
            ))}
          </div>

          <button
            type="button"
            onClick={() => scrollSlider(brandSliderRef, "right", 450)}
            className="
              absolute
              right-[-10px]
              sm:right-[-18px]
              top-1/2
              -translate-y-1/2
              z-20
              w-9
              h-9
              rounded-full
              lavi-card
              lavi-heading
              flex
              items-center
              justify-center
              hover:bg-orange-500
              hover:text-white
              transition
            "
          >
            <FiChevronRight size={19} />
          </button>
        </div>
      </section>

      {/* =====================================================
          DEAL BANNER
      ===================================================== */}

      <section className="max-w-7xl mx-auto px-5 sm:px-6 py-8">
        <div
          className="
            rounded-2xl
            overflow-hidden
            bg-gradient-to-r
            from-orange-600
            to-orange-400
            text-white
          "
        >
          <div className="grid md:grid-cols-2 items-center">
            <div className="p-7 sm:p-10">
              <p className="text-orange-100 text-sm font-medium">
                Limited Time Offers
              </p>

              <h2 className="text-2xl sm:text-3xl font-bold mt-2">
                Upgrade Your Smartphone
              </h2>

              <p className="text-orange-50 text-sm mt-3 max-w-md">
                Find exciting deals on the latest smartphones from top brands.
              </p>

              <Link
                to="/products"
                className="
                  inline-flex
                  items-center
                  gap-2
                  mt-5
                  bg-white
                  text-orange-600
                  px-5
                  py-2.5
                  rounded-lg
                  text-sm
                  font-semibold
                  hover:bg-orange-50
                  transition
                "
              >
                Explore Deals
                <FiArrowRight size={16} />
              </Link>
            </div>

            <div className="hidden md:flex justify-center items-center">
              <img
                src={iphoneBanner}
                alt="Smartphone deal"
                className="
                  w-full
                  max-w-[480px]
                  h-[230px]
                  object-cover
                  object-center
                "
              />
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          POPULAR MOBILES
      ===================================================== */}

      <section className="lavi-card border-x-0 rounded-none">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 py-8">
          <SectionHeader
            title="Popular Mobiles"
            subtitle="Top rated smartphones"
          />

          {bestSellers.length === 0 ? (
            <div className="text-center lavi-text py-8">
              No products available.
            </div>
          ) : (
            <ProductSlider
              products={bestSellers}
              sliderRef={latestSliderRef}
              showRating
            />
          )}
        </div>
      </section>

      {/* =====================================================
          FOR YOUR BUDGET
      ===================================================== */}

      <section className="max-w-7xl mx-auto px-5 sm:px-6 py-8">
        <SectionHeader
          title="For Your Budget"
          subtitle="Find a smartphone within your budget"
          viewAll={false}
        />

        <div className="relative">
          <button
            type="button"
            onClick={() => scrollSlider(budgetSliderRef, "left", 600)}
            className="
              absolute
              left-[-10px]
              sm:left-[-18px]
              top-1/2
              -translate-y-1/2
              z-20
              w-9
              h-9
              rounded-full
              lavi-card
              lavi-heading
              flex
              items-center
              justify-center
              hover:bg-orange-500
              hover:text-white
              transition
            "
          >
            <FiChevronLeft size={19} />
          </button>

          <div
            ref={budgetSliderRef}
            className="
              flex
              gap-4
              overflow-x-auto
              hide-scrollbar
              scroll-smooth
              pb-3
              px-1
            "
          >
            <BudgetCard
              title="₹10,001 to"
              price="₹20,000"
              products={budgetProducts["10k-20k"]}
              minPrice="10001"
              maxPrice="20000"
            />

            <BudgetCard
              title="₹20,001 to"
              price="₹30,000"
              products={budgetProducts["20k-30k"]}
              minPrice="20001"
              maxPrice="30000"
            />

            <BudgetCard
              title="₹30,001 to"
              price="₹50,000"
              products={budgetProducts["30k-50k"]}
              minPrice="30001"
              maxPrice="50000"
            />

            <BudgetCard
              title="Above"
              price="₹50,000"
              products={premiumPhones}
              minPrice="50001"
            />
          </div>

          <button
            type="button"
            onClick={() => scrollSlider(budgetSliderRef, "right", 600)}
            className="
              absolute
              right-[-10px]
              sm:right-[-18px]
              top-1/2
              -translate-y-1/2
              z-20
              w-9
              h-9
              rounded-full
              lavi-card
              lavi-heading
              flex
              items-center
              justify-center
              hover:bg-orange-500
              hover:text-white
              transition
            "
          >
            <FiChevronRight size={19} />
          </button>
        </div>
      </section>

      {/* =====================================================
          WHY LAVI MOBILE
      ===================================================== */}

      <section className="lavi-card border-x-0 rounded-none">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 py-10">
          <SectionHeader
            title="Why Shop With Lavi Mobile?"
            subtitle="A better way to shop smartphones"
            viewAll={false}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Delivery */}

            <div
              className="
                lavi-card
                rounded-xl
                p-5
              "
            >
              <div
                className="
                  w-11
                  h-11
                  rounded-full
                  bg-orange-100
                  dark:bg-orange-500/10
                  text-orange-500
                  flex
                  items-center
                  justify-center
                "
              >
                <FiTruck size={21} />
              </div>

              <h3 className="lavi-heading font-semibold mt-4">Fast Delivery</h3>

              <p className="lavi-text text-sm mt-2">
                Get your smartphone delivered quickly and safely.
              </p>
            </div>

            {/* Secure */}

            <div
              className="
                lavi-card
                rounded-xl
                p-5
              "
            >
              <div
                className="
                  w-11
                  h-11
                  rounded-full
                  bg-orange-100
                  dark:bg-orange-500/10
                  text-orange-500
                  flex
                  items-center
                  justify-center
                "
              >
                <FiShield size={21} />
              </div>

              <h3 className="lavi-heading font-semibold mt-4">
                Secure Shopping
              </h3>

              <p className="lavi-text text-sm mt-2">
                Your account and orders are protected.
              </p>
            </div>

            {/* Deals */}

            <div
              className="
                lavi-card
                rounded-xl
                p-5
              "
            >
              <div
                className="
                  w-11
                  h-11
                  rounded-full
                  bg-orange-100
                  dark:bg-orange-500/10
                  text-orange-500
                  flex
                  items-center
                  justify-center
                "
              >
                <FiTag size={21} />
              </div>

              <h3 className="lavi-heading font-semibold mt-4">Great Deals</h3>

              <p className="lavi-text text-sm mt-2">
                Find smartphones at competitive prices.
              </p>
            </div>

            {/* Support */}

            <div
              className="
                lavi-card
                rounded-xl
                p-5
              "
            >
              <div
                className="
                  w-11
                  h-11
                  rounded-full
                  bg-orange-100
                  dark:bg-orange-500/10
                  text-orange-500
                  flex
                  items-center
                  justify-center
                "
              >
                <FiHeart size={21} />
              </div>

              <h3 className="lavi-heading font-semibold mt-4">
                Customer First
              </h3>

              <p className="lavi-text text-sm mt-2">
                We make your shopping experience simple and reliable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer
        className="
          bg-[#17191c]
          text-gray-300
          mt-8
        "
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-6 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand */}

            <div>
              <h2 className="text-white text-xl font-bold">Lavi Mobile</h2>

              <p className="text-gray-400 text-sm leading-6 mt-3 max-w-sm">
                Your destination for the latest smartphones, great deals and
                reliable mobile products.
              </p>
            </div>

            {/* Categories */}

            <div>
              <h3 className="text-white font-semibold mb-4">Categories</h3>

              <div className="space-y-2 text-sm">
                <Link to="/products" className="block hover:text-orange-400">
                  Mobile Phones
                </Link>

                <Link
                  to="/products?network=5G"
                  className="block hover:text-orange-400"
                >
                  5G Phones
                </Link>

                <Link
                  to="/products?minPrice=50000"
                  className="block hover:text-orange-400"
                >
                  Premium Phones
                </Link>

                <Link
                  to="/products?minPrice=10001&maxPrice=30000"
                  className="block hover:text-orange-400"
                >
                  Budget Phones
                </Link>
              </div>
            </div>

            {/* Information */}

            <div>
              <h3 className="text-white font-semibold mb-4">Information</h3>

              <div className="space-y-2 text-sm">
                <Link to="/products" className="block hover:text-orange-400">
                  Shop
                </Link>

                <Link to="/orders" className="block hover:text-orange-400">
                  My Orders
                </Link>

                <Link to="/wishlist" className="block hover:text-orange-400">
                  Wishlist
                </Link>

                <Link to="/profile" className="block hover:text-orange-400">
                  My Profile
                </Link>
              </div>
            </div>

            {/* Contact */}

            <div>
              <h3 className="text-white font-semibold mb-4">Contact</h3>

              <p className="text-gray-400 text-sm leading-6">
                Lavi Mobile
                <br />
                Chennai, Tamil Nadu
                <br />
                India
              </p>
            </div>
          </div>

          <div
            className="
              border-t
              border-gray-700
              mt-8
              pt-5
              flex
              flex-col
              sm:flex-row
              justify-between
              gap-3
              text-xs
              text-gray-500
            "
          >
            <p>
              © {new Date().getFullYear()} Lavi Mobile. All rights reserved.
            </p>

            <p>Built with React, Node.js & MongoDB</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;

// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import axios from "axios";

// import Navbar from "../../components/customer/Navbar";

// import iphoneBanner from "../../assets/iphone-banner.jpg";

// /* =========================================================
//    IMAGE URL HELPER
// ========================================================= */

// const getImageUrl = (image) => {
//   if (!image) {
//     return "";
//   }

//   if (image.startsWith("http")) {
//     return image;
//   }

//   if (image.startsWith("/")) {
//     return `http://localhost:5000${image}`;
//   }

//   return `http://localhost:5000/${image}`;
// };

// /* =========================================================
//    PRODUCT CARD
//    Figma-style compact product card
// ========================================================= */

// function ProductCard({ product }) {
//   return (
//     <Link
//       to={`/product/${product._id}`}
//       className="
//         group min-w-0 rounded-xl
//         border border-gray-200 bg-white
//         p-3 shadow-sm
//         transition duration-300
//         hover:-translate-y-1 hover:shadow-lg
//         dark:border-[#2b3038] dark:bg-[#181b20]
//       "
//     >
//       <div
//         className="
//           flex h-36 items-center justify-center
//           rounded-lg bg-[#f5f6fa]
//           overflow-hidden
//           dark:bg-[#111419]
//         "
//       >
//         {product.images?.[0] ? (
//           <img
//             src={getImageUrl(product.images[0])}
//             alt={product.name}
//             className="
//               h-full w-full object-contain p-3
//               transition duration-300
//               group-hover:scale-105
//             "
//           />
//         ) : (
//           <span className="text-xs text-gray-400">No Image</span>
//         )}
//       </div>

//       <p className="mt-3 line-clamp-1 text-[10px] font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
//         {product.brand || "Mobile"}
//       </p>

//       <h3 className="mt-1 line-clamp-2 min-h-[30px] text-[11px] font-semibold leading-4 text-gray-800 dark:text-gray-100">
//         {product.name}
//       </h3>

//       <div className="mt-2">
//         <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
//           ₹{Number(product.price || 0).toLocaleString("en-IN")}
//         </span>

//         {product.mrp > product.price && (
//           <span className="ml-1 text-[10px] text-gray-400 line-through">
//             ₹{Number(product.mrp).toLocaleString("en-IN")}
//           </span>
//         )}
//       </div>
//     </Link>
//   );
// }

// /* =========================================================
//    SECTION
// ========================================================= */

// function ProductSection({ title, products, loading }) {
//   return (
//     <section className="py-7">
//       <div className="mb-4 flex items-center justify-between">
//         <h2 className="text-base font-bold uppercase tracking-wide text-gray-900 dark:text-white md:text-lg">
//           {title}
//         </h2>

//         <Link
//           to="/products"
//           className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
//         >
//           View All →
//         </Link>
//       </div>

//       {loading ? (
//         <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
//           {[1, 2, 3, 4, 5].map((item) => (
//             <div
//               key={item}
//               className="h-56 animate-pulse rounded-xl bg-gray-200 dark:bg-[#20242b]"
//             />
//           ))}
//         </div>
//       ) : products.length === 0 ? (
//         <div className="rounded-xl border border-dashed border-gray-300 py-10 text-center text-sm text-gray-500 dark:border-[#303640] dark:text-gray-400">
//           No products available.
//         </div>
//       ) : (
//         <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
//           {products.slice(0, 5).map((product) => (
//             <ProductCard key={product._id} product={product} />
//           ))}
//         </div>
//       )}
//     </section>
//   );
// }

// /* =========================================================
//    HOME
// ========================================================= */

// function Home() {
//   const [products, setProducts] = useState([]);
//   const [appleProducts, setAppleProducts] = useState([]);
//   const [watchProducts, setWatchProducts] = useState([]);
//   const [accessories, setAccessories] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const loadHomePageData = async () => {
//       try {
//         setLoading(true);

//         const response = await axios.get("http://localhost:5000/api/products", {
//           params: {
//             limit: 100,
//             sort: "createdAt",
//           },
//         });

//         const allProducts = response.data.products || [];

//         const latest = [...allProducts]
//           .sort(
//             (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
//           )
//           .slice(0, 10);

//         setProducts(latest);

//         const apple = allProducts.filter((product) =>
//           String(product.brand || "")
//             .toLowerCase()
//             .includes("apple"),
//         );

//         setAppleProducts(apple.slice(0, 10));

//         const watches = allProducts.filter((product) => {
//           const text = `${product.name || ""} ${
//             product.category?.name || product.category || ""
//           }`.toLowerCase();

//           return (
//             text.includes("watch") ||
//             text.includes("smart watch") ||
//             text.includes("smartwatch")
//           );
//         });

//         setWatchProducts(watches.slice(0, 10));

//         const accessoryProducts = allProducts.filter((product) => {
//           const text = `${product.name || ""} ${
//             product.category?.name || product.category || ""
//           }`.toLowerCase();

//           return (
//             text.includes("accessor") ||
//             text.includes("charger") ||
//             text.includes("case") ||
//             text.includes("cable") ||
//             text.includes("power bank") ||
//             text.includes("earphone") ||
//             text.includes("earbud")
//           );
//         });

//         setAccessories(accessoryProducts.slice(0, 10));
//       } catch (error) {
//         console.error(
//           "Failed to load homepage data:",
//           error.response?.data || error.message,
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadHomePageData();
//   }, []);

//   return (
//     <div className="min-h-screen bg-[#f5f6f8] text-gray-900 transition-colors duration-300 dark:bg-[#0e1013] dark:text-white">
//       <Navbar />

//       {/* =====================================================
//           HERO - LEGION STYLE
//       ===================================================== */}

//       <main className="mx-auto w-full max-w-[1180px] px-3 sm:px-5">
//         <section className="pt-4">
//           <div className="relative min-h-[280px] overflow-hidden rounded-xl bg-[#dce5ff] dark:bg-[#182238] md:min-h-[360px]">
//             {/* Background glow */}
//             <div className="absolute -left-20 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-blue-400/20 blur-3xl" />
//             <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-indigo-400/20 blur-3xl" />

//             <div className="relative z-10 grid min-h-[280px] items-center md:min-h-[360px] md:grid-cols-2">
//               <div className="px-7 py-10 sm:px-10 md:px-12">
//                 <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400">
//                   Lavi Mobile
//                 </p>

//                 <h1 className="text-4xl font-extrabold tracking-tight text-[#18326b] dark:text-white sm:text-5xl md:text-6xl">
//                   iPhone
//                   <br />
//                   <span className="text-blue-600 dark:text-blue-400">
//                     16 Series
//                   </span>
//                 </h1>

//                 <p className="mt-4 max-w-md text-sm leading-6 text-gray-600 dark:text-gray-300">
//                   Discover the latest smartphones, smart watches and mobile
//                   accessories at Lavi Mobile.
//                 </p>

//                 <Link
//                   to="/products"
//                   className="
//                     mt-6 inline-flex items-center rounded-md
//                     bg-blue-600 px-5 py-2.5
//                     text-xs font-bold text-white
//                     shadow-md transition
//                     hover:bg-blue-700
//                   "
//                 >
//                   Shop Now →
//                 </Link>
//               </div>

//               <div className="flex h-full items-center justify-center px-4 pb-7 md:justify-end md:px-8 md:pb-0">
//                 <img
//                   src={iphoneBanner}
//                   alt="Latest iPhone"
//                   className="
//                     max-h-[235px] w-full max-w-[500px]
//                     object-contain mix-blend-multiply
//                     dark:mix-blend-normal
//                   "
//                 />
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* =====================================================
//             CATEGORY NAVIGATION - LEGION STYLE
//         ===================================================== */}

//         <section className="py-5">
//           <div className="flex flex-wrap items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white p-2 shadow-sm dark:border-[#292e36] dark:bg-[#171a1f]">
//             <Link
//               to="/products"
//               className="rounded-md bg-blue-600 px-4 py-2 text-[11px] font-semibold text-white"
//             >
//               All Mobiles
//             </Link>

//             <Link
//               to="/products?search=Apple"
//               className="rounded-md px-4 py-2 text-[11px] font-semibold text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-[#242932]"
//             >
//               Apple
//             </Link>

//             <Link
//               to="/products?search=Samsung"
//               className="rounded-md px-4 py-2 text-[11px] font-semibold text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-[#242932]"
//             >
//               Samsung
//             </Link>

//             <Link
//               to="/products?search=OnePlus"
//               className="rounded-md px-4 py-2 text-[11px] font-semibold text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-[#242932]"
//             >
//               OnePlus
//             </Link>

//             <Link
//               to="/products?search=Google"
//               className="rounded-md px-4 py-2 text-[11px] font-semibold text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-[#242932]"
//             >
//               Google
//             </Link>

//             <Link
//               to="/products?search=Watch"
//               className="rounded-md px-4 py-2 text-[11px] font-semibold text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-[#242932]"
//             >
//               Smart Watch
//             </Link>

//             <Link
//               to="/products?search=accessories"
//               className="rounded-md px-4 py-2 text-[11px] font-semibold text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-[#242932]"
//             >
//               Accessories
//             </Link>
//           </div>
//         </section>

//         {/* =====================================================
//             PRODUCT SECTIONS
//         ===================================================== */}

//         <div className="divide-y divide-gray-200 dark:divide-[#282d35]">
//           <ProductSection
//             title="Latest Mobile Phones"
//             products={products}
//             loading={loading}
//           />

//           <ProductSection
//             title="Apple Product"
//             products={appleProducts}
//             loading={loading}
//           />

//           <ProductSection
//             title="Smart Watch"
//             products={watchProducts}
//             loading={loading}
//           />

//           <ProductSection
//             title="Accessories"
//             products={accessories}
//             loading={loading}
//           />
//         </div>

//         {/* =====================================================
//             BLUE PROMO STRIP
//         ===================================================== */}

//         <section className="py-8">
//           <div className="flex flex-col items-center justify-between gap-4 rounded-xl bg-blue-600 px-6 py-7 text-center text-white sm:flex-row sm:text-left">
//             <div>
//               <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-200">
//                 Lavi Mobile
//               </p>

//               <h2 className="mt-1 text-xl font-bold">
//                 Find the smartphone that fits you.
//               </h2>

//               <p className="mt-1 text-xs text-blue-100">
//                 Latest mobiles • Smart watches • Accessories
//               </p>
//             </div>

//             <Link
//               to="/products"
//               className="rounded-md bg-white px-5 py-2.5 text-xs font-bold text-blue-600 transition hover:bg-blue-50"
//             >
//               Explore Products →
//             </Link>
//           </div>
//         </section>
//       </main>

//       {/* =====================================================
//           FOOTER - LEGION STYLE
//       ===================================================== */}

//       <footer className="border-t border-gray-200 bg-white dark:border-[#292e36] dark:bg-[#171a1f]">
//         <div className="mx-auto grid max-w-[1180px] gap-8 px-5 py-8 sm:grid-cols-2 md:grid-cols-4">
//           <div>
//             <h3 className="text-lg font-extrabold text-blue-600 dark:text-blue-400">
//               LAVI
//             </h3>
//             <p className="mt-2 text-xs leading-5 text-gray-500 dark:text-gray-400">
//               Your destination for smartphones, smart watches and mobile
//               accessories.
//             </p>
//           </div>

//           <div>
//             <h4 className="text-xs font-bold uppercase tracking-wide text-gray-900 dark:text-white">
//               Categories
//             </h4>

//             <div className="mt-3 space-y-2 text-xs text-gray-500 dark:text-gray-400">
//               <Link className="block hover:text-blue-600" to="/products">
//                 Mobiles
//               </Link>
//               <Link className="block hover:text-blue-600" to="/products">
//                 Smart Watches
//               </Link>
//               <Link className="block hover:text-blue-600" to="/products">
//                 Accessories
//               </Link>
//             </div>
//           </div>

//           <div>
//             <h4 className="text-xs font-bold uppercase tracking-wide text-gray-900 dark:text-white">
//               Information
//             </h4>

//             <div className="mt-3 space-y-2 text-xs text-gray-500 dark:text-gray-400">
//               <Link className="block hover:text-blue-600" to="/products">
//                 Shop
//               </Link>
//               <Link className="block hover:text-blue-600" to="/orders">
//                 My Orders
//               </Link>
//               <Link className="block hover:text-blue-600" to="/cart">
//                 Cart
//               </Link>
//             </div>
//           </div>

//           <div>
//             <h4 className="text-xs font-bold uppercase tracking-wide text-gray-900 dark:text-white">
//               Lavi Mobile
//             </h4>

//             <p className="mt-3 text-xs leading-5 text-gray-500 dark:text-gray-400">
//               Quality smartphones and accessories with a simple shopping
//               experience.
//             </p>
//           </div>
//         </div>

//         <div className="border-t border-gray-200 py-4 text-center text-[10px] text-gray-400 dark:border-[#292e36]">
//           © {new Date().getFullYear()} Lavi Mobile. All rights reserved.
//         </div>
//       </footer>
//     </div>
//   );
// }

// export default Home;

// ------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------

// import { useEffect, useRef, useState } from "react";
// import { Link } from "react-router-dom";
// import axios from "axios";

// import Navbar from "../../components/customer/Navbar";

// import mobileBanner from "../../assets/mobile-banner.jpg";
// import iphoneBanner from "../../assets/iphone-banner.jpg";
// import samsungS26ultraBanner from "../../assets/samsung-s26ultra-banner.jpg";
// import iphone18ProMaxBanner from "../../assets/iphone-18promax-banner.jpg";

// /* =========================================================
//    IMAGE URL HELPER
// ========================================================= */

// const getImageUrl = (image) => {
//   if (!image) {
//     return "";
//   }

//   if (image.startsWith("http")) {
//     return image;
//   }

//   if (image.startsWith("/")) {
//     return `http://localhost:5000${image}`;
//   }

//   return `http://localhost:5000/${image}`;
// };

// /* =========================================================
//    BUDGET CARD
// ========================================================= */

// function BudgetCard({ title, price, products = [], minPrice, maxPrice }) {
//   const image = products?.[0]?.images?.[0];

//   const query = new URLSearchParams();

//   if (minPrice) {
//     query.set("minPrice", minPrice);
//   }

//   if (maxPrice) {
//     query.set("maxPrice", maxPrice);
//   }

//   return (
//     <Link
//       to={`/products?${query.toString()}`}
//       className="group relative min-w-[280px] md:min-w-[320px]
//                  h-[170px] md:h-[195px]
//                  rounded-xl overflow-hidden
//                  bg-gradient-to-br from-gray-800 to-gray-950
//                  border border-gray-700
//                  hover:border-orange-500
//                  transition"
//     >
//       {/* Background Product Image */}
//       {image && (
//         <img
//           src={getImageUrl(image)}
//           alt={price}
//           className="absolute inset-0
//                      w-full h-full
//                      object-cover
//                      group-hover:scale-105
//                      transition duration-500"
//         />
//       )}

//       {/* Dark Overlay */}
//       <div className="absolute inset-0 bg-black/55" />

//       {/* Price Text */}
//       <div className="absolute inset-0 p-5 md:p-6 flex flex-col justify-center">
//         <p className="text-white text-lg md:text-xl font-medium">{title}</p>

//         <h3 className="text-white text-3xl md:text-4xl font-bold">{price}</h3>

//         <span className="text-orange-400 text-sm mt-3 font-medium">
//           Explore Mobiles →
//         </span>
//       </div>
//     </Link>
//   );
// }

// /* =========================================================
//    PRODUCT CARD
// ========================================================= */

// function ProductCard({ product, showRating = false }) {
//   return (
//     <div className="group bg-white dark:bg-[#1d2125] border border-gray-200 dark:border-[#2b3036] rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-4">
//       {/* Product Image */}
//       <div className="h-56 flex items-center justify-center bg-gray-50 dark:bg-[#15181b] rounded-xl overflow-hidden">
//         {product.images?.[0] ? (
//           <img
//             src={getImageUrl(product.images[0])}
//             alt={product.name}
//             className="w-full h-full object-contain p-4 group-hover:scale-105 transition duration-500"
//           />
//         ) : (
//           <span className="text-gray-400 dark:text-gray-500">No Image</span>
//         )}
//       </div>

//       {/* Brand */}
//       <p className="text-xs font-semibold uppercase tracking-wide text-orange-500 mt-4">
//         {product.brand}
//       </p>

//       {/* Product Name */}
//       <h3 className="font-semibold text-gray-900 dark:text-gray-100 mt-1 line-clamp-2">
//         {product.name}
//       </h3>

//       {/* Rating */}
//       {showRating && (
//         <div className="flex items-center gap-2 mt-2">
//           <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">
//             ★ {product.rating || 0}
//           </span>

//           <span className="text-sm text-gray-500 dark:text-gray-400">
//             {product.reviewCount || 0} Reviews
//           </span>
//         </div>
//       )}

//       {/* Price */}
//       <div className="mt-3">
//         <span className="text-xl font-bold text-gray-900 dark:text-white">
//           ₹{Number(product.price || 0).toLocaleString("en-IN")}
//         </span>

//         {product.mrp > product.price && (
//           <span className="ml-2 text-sm text-gray-400 line-through">
//             ₹{Number(product.mrp).toLocaleString("en-IN")}
//           </span>
//         )}
//       </div>

//       {/* View Details */}
//       <Link
//         to={`/product/${product._id}`}
//         className="block text-center mt-4 bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-lg font-medium transition"
//       >
//         View Details
//       </Link>
//     </div>
//   );
// }

// /* =========================================================
//    HOME
// ========================================================= */

// function Home() {
//   /* =========================================================
//      HOMEPAGE DATA
//   ========================================================= */

//   const [products, setProducts] = useState([]);
//   const [newProducts, setNewProducts] = useState([]);
//   const [bestSellers, setBestSellers] = useState([]);

//   const [brands, setBrands] = useState([]);

//   const [budgetProducts, setBudgetProducts] = useState({});

//   const [premiumPhones, setPremiumPhones] = useState([]);

//   const [dealsOfWeek, setDealsOfWeek] = useState([]);

//   const [loading, setLoading] = useState(true);

//   /* =========================================================
//      SLIDER REFERENCES
//   ========================================================= */

//   const brandSliderRef = useRef(null);
//   const budgetSliderRef = useRef(null);

//   /* =========================================================
//      BRAND SLIDER
//   ========================================================= */

//   const scrollBrands = (direction) => {
//     if (!brandSliderRef.current) {
//       return;
//     }

//     brandSliderRef.current.scrollBy({
//       left: direction === "left" ? -300 : 300,
//       behavior: "smooth",
//     });
//   };

//   /* =========================================================
//      BUDGET SLIDER
//   ========================================================= */

//   const scrollBudget = (direction) => {
//     if (!budgetSliderRef.current) {
//       return;
//     }

//     budgetSliderRef.current.scrollBy({
//       left: direction === "left" ? -350 : 350,
//       behavior: "smooth",
//     });
//   };

//   /* =========================================================
//      BUDGET PRICE RANGES
//   ========================================================= */

//   const budgetSections = [
//     {
//       id: "10k-20k",
//       title: "₹10,001 - ₹20,000",
//       minPrice: 10001,
//       maxPrice: 20000,
//     },
//     {
//       id: "20k-30k",
//       title: "₹20,001 - ₹30,000",
//       minPrice: 20001,
//       maxPrice: 30000,
//     },
//     {
//       id: "30k-50k",
//       title: "₹30,001 - ₹50,000",
//       minPrice: 30001,
//       maxPrice: 50000,
//     },
//     {
//       id: "50k-plus",
//       title: "Above ₹50,000",
//       minPrice: 50001,
//       maxPrice: "",
//     },
//   ];

//   /* =========================================================
//      LOAD HOMEPAGE DATA
//   ========================================================= */

//   useEffect(() => {
//     const loadHomePageData = async () => {
//       try {
//         setLoading(true);

//         /* -----------------------------------------------------
//            Load enough products for homepage sections
//         ----------------------------------------------------- */

//         const productsResponse = await axios.get(
//           "http://localhost:5000/api/products",
//           {
//             params: {
//               limit: 100,
//               sort: "createdAt",
//             },
//           },
//         );

//         const allProducts = productsResponse.data.products || [];

//         /* -----------------------------------------------------
//            Featured Products

//            Uses the actual isFeatured field.
//         ----------------------------------------------------- */

//         const featuredProducts = allProducts
//           .filter((product) => product.isFeatured === true)
//           .slice(0, 4);

//         setProducts(featuredProducts);

//         // deals of the week

//         const dealsResponse = await axios.get(
//           "http://localhost:5000/api/dashboard/deals-of-week",
//         );

//         setDealsOfWeek(dealsResponse.data.products || []);

//         /* -----------------------------------------------------
//            New Arrivals

//            Products are already returned newest first.
//         ----------------------------------------------------- */

//         const newestProducts = [...allProducts]
//           .sort(
//             (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
//           )
//           .slice(0, 4);

//         setNewProducts(newestProducts);

//         /* -----------------------------------------------------
//            Best Sellers

//            There is no salesCount in Product currently.
//            Rating is used as the current replacement.
//         ----------------------------------------------------- */

//         const highestRatedProducts = [...allProducts]
//           .sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0))
//           .slice(0, 4);

//         setBestSellers(highestRatedProducts);

//         /* -----------------------------------------------------
//            Brands
//         ----------------------------------------------------- */

//         const brandsResponse = await axios.get(
//           "http://localhost:5000/api/brands",
//         );

//         setBrands(brandsResponse.data.brands || []);

//         /* -----------------------------------------------------
//            Budget Products
//         ----------------------------------------------------- */

//         const budgetRequests = budgetSections.map((section) =>
//           axios.get("http://localhost:5000/api/products", {
//             params: {
//               minPrice: section.minPrice,
//               maxPrice: section.maxPrice,
//               limit: 4,
//               sort: "price-low",
//             },
//           }),
//         );

//         const budgetResponses = await Promise.all(budgetRequests);

//         const budgetData = {};

//         budgetSections.forEach((section, index) => {
//           budgetData[section.id] = budgetResponses[index]?.data?.products || [];
//         });

//         setBudgetProducts(budgetData);

//         /* -----------------------------------------------------
//            Premium Phones
//         ----------------------------------------------------- */

//         const premiumResponse = await axios.get(
//           "http://localhost:5000/api/products",
//           {
//             params: {
//               minPrice: 50000,
//               limit: 4,
//               sort: "price-high",
//             },
//           },
//         );

//         setPremiumPhones(premiumResponse.data.products || []);
//       } catch (error) {
//         console.error(
//           "Failed to load homepage data:",
//           error.response?.data || error.message,
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadHomePageData();
//   }, []);

//   return (
//     <div className="lavi-page">
//       <Navbar />

//       {/* =====================================================
//           HERO SECTION
//       ===================================================== */}

//       <section className="w-full overflow-hidden">
//         <div className="flex animate-lavi-slider w-[400%]">
//           {/* ================= FIRST SLIDE ================= */}

//           <div className="w-1/4 shrink-0 bg-orange-500 text-white">
//             <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 lg:py-20">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-center">
//                 {/* Content Left */}

//                 <div>
//                   <p className="text-orange-100 font-medium mb-3">
//                     Welcome to Lavi Mobile
//                   </p>

//                   <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
//                     Find Your Perfect Smartphone
//                   </h1>

//                   <p className="mt-5 text-orange-50 text-lg leading-7 max-w-xl">
//                     Explore the latest smartphones from top brands at great
//                     prices. Find powerful performance, amazing cameras, and the
//                     features you need.
//                   </p>

//                   <div className="flex flex-wrap gap-4 mt-8">
//                     <Link
//                       to="/products"
//                       className="bg-white text-orange-500 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
//                     >
//                       Shop Mobiles
//                     </Link>

//                     <Link
//                       to="/products"
//                       className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-orange-500 transition"
//                     >
//                       View Deals
//                     </Link>
//                   </div>
//                 </div>

//                 {/* Mobile Image Right */}

//                 <div className="flex justify-center md:justify-end">
//                   <div className="w-[220px] sm:w-[280px] md:w-[340px] lg:w-[400px]">
//                     <img
//                       src={mobileBanner}
//                       alt="Lavi Mobile"
//                       className="w-full h-auto object-contain"
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* ================= SECOND SLIDE ================= */}

//           <div className="w-1/4 shrink-0">
//             <img
//               src={iphoneBanner}
//               alt="iPhone"
//               className="w-full h-auto block"
//             />
//           </div>

//           {/* ================= THIRD SLIDE ================= */}

//           <div className="w-1/4 shrink-0">
//             <img
//               src={samsungS26ultraBanner}
//               alt="Samsung Galaxy S26 Ultra"
//               className="w-full h-auto block"
//             />
//           </div>

//           {/* ================= FOURTH SLIDE ================= */}

//           <div className="w-1/4 shrink-0">
//             <img
//               src={iphone18ProMaxBanner}
//               alt="iPhone 18 Pro Max"
//               className="w-full h-auto block"
//             />
//           </div>
//         </div>
//       </section>

//       {/* =====================================================
//           CATEGORIES
//       ===================================================== */}

//       <section className="max-w-7xl mx-auto px-6 py-12">
//         <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
//           Shop by Category
//         </h2>

//         <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-6">
//           {/* Budget */}

//           <Link
//             to="/products?minPrice=10001&maxPrice=30000"
//             className="bg-white dark:bg-[#1d2125] border border-gray-200 dark:border-[#2b3036] rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition text-center"
//           >
//             <div className="text-4xl mb-4">📱</div>

//             <h3 className="font-semibold text-gray-800">Budget Phones</h3>
//           </Link>

//           {/* 5G */}

//           <Link
//             to="/products?network=5G"
//             className="bg-white dark:bg-[#1d2125] border border-gray-200 dark:border-[#2b3036] rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition text-center"
//           >
//             <div className="text-4xl mb-4">📶</div>

//             <h3 className="font-semibold text-gray-800">5G Phones</h3>
//           </Link>

//           {/* Premium */}

//           <Link
//             to="/products?minPrice=50000"
//             className="bg-white dark:bg-[#1d2125] border border-gray-200 dark:border-[#2b3036] rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition text-center"
//           >
//             <div className="text-4xl mb-4">💎</div>

//             <h3 className="font-semibold text-gray-800">Premium Phones</h3>
//           </Link>

//           {/* Gaming */}

//           <Link
//             to="/products?search=gaming"
//             className="bg-white dark:bg-[#1d2125] border border-gray-200 dark:border-[#2b3036] rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition text-center"
//           >
//             <div className="text-4xl mb-4">🎮</div>

//             <h3 className="font-semibold text-gray-800">Gaming Phones</h3>
//           </Link>
//         </div>
//       </section>

//       {/* =====================================================
//     DEALS OF THE WEEK
// ===================================================== */}

//       <section className="max-w-7xl mx-auto px-6 py-12">
//         <div className="flex items-center justify-between">
//           <div>
//             <p className="text-orange-500 font-medium">
//               This Week's Popular Picks
//             </p>

//             <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
//               Deals of the Week
//             </h2>
//           </div>

//           <Link
//             to="/products"
//             className="text-orange-500 hover:text-orange-600 font-medium"
//           >
//             View All
//           </Link>
//         </div>

//         {loading ? (
//           <p className="text-gray-500 dark:text-gray-400 mt-6">
//             Loading deals...
//           </p>
//         ) : dealsOfWeek.length === 0 ? (
//           <p className="text-gray-500 dark:text-gray-400 mt-6">
//             No products have been sold this week.
//           </p>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
//             {dealsOfWeek.map((product) => (
//               <div key={product._id} className="relative">
//                 {/* Sold This Week Badge */}

//                 <div className="absolute top-3 left-3 z-10 bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
//                   {product.totalSold} sold this week
//                 </div>

//                 <ProductCard product={product} showRating />
//               </div>
//             ))}
//           </div>
//         )}
//       </section>

//       {/* =====================================================
//           POPULAR BRANDS
//       ===================================================== */}

//       <section className="bg-white dark:bg-[#17191c] border-y border-gray-200 dark:border-transparent">
//         <div className="max-w-7xl mx-auto px-6 py-12">
//           {/* Section Heading */}

//           <div className="flex items-center justify-between mb-6">
//             <div>
//               <p className="text-gray-400 text-sm">
//                 Choose from top smartphone brands
//               </p>

//               <h2 className="text-2xl md:text-3xl font-bold text-white mt-1">
//                 Pick Your Smartphone Brand
//               </h2>
//             </div>

//             <Link
//               to="/products"
//               className="text-orange-400 hover:text-orange-300 font-medium"
//             >
//               View All
//             </Link>
//           </div>

//           {/* Brand Slider */}

//           <div className="relative">
//             {/* Left Arrow */}

//             <button
//               onClick={() => scrollBrands("left")}
//               className="absolute left-[-15px] md:left-[-20px] top-1/2
//                          -translate-y-1/2 z-10
//                          w-10 h-10 rounded-full
//                          bg-[#171717] text-white
//                          flex items-center justify-center
//                          text-3xl
//                          hover:bg-orange-500
//                          transition"
//             >
//               ‹
//             </button>

//             {/* Brand Cards */}

//             <div
//               ref={brandSliderRef}
//               className="flex gap-4 md:gap-5 overflow-x-auto
//                          scroll-smooth
//                          px-2 md:px-4
//                          pb-3
//                          [scrollbar-width:none]
//                          [&::-webkit-scrollbar]:hidden"
//             >
//               {brands.length === 0 ? (
//                 <p className="text-gray-400 py-10">No brands available.</p>
//               ) : (
//                 brands.map((brand) => (
//                   <Link
//                     key={brand._id}
//                     to={`/products?search=${encodeURIComponent(brand.name)}`}
//                     className="group min-w-[220px] md:min-w-[300px]
//                                h-[150px] md:h-[195px]
//                                rounded-xl overflow-hidden
//                                relative
//                                bg-gradient-to-br
//                                from-gray-700
//                                to-gray-900
//                                border border-gray-700
//                                hover:border-orange-500
//                                transition"
//                   >
//                     {/* Brand Image */}

//                     {brand.logo ? (
//                       <img
//                         src={getImageUrl(brand.logo)}
//                         alt={brand.name}
//                         className="absolute inset-0
//                                    w-full h-full
//                                    object-contain
//                                    p-10
//                                    group-hover:scale-105
//                                    transition duration-300"
//                       />
//                     ) : (
//                       <div className="absolute inset-0 flex items-center justify-center">
//                         <span className="text-3xl md:text-4xl font-bold text-white">
//                           {brand.name}
//                         </span>
//                       </div>
//                     )}

//                     {/* Dark Overlay */}

//                     <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition" />

//                     {/* Brand Name */}

//                     <div
//                       className="absolute bottom-0 left-0 right-0
//                                  bg-black/60 backdrop-blur-sm
//                                  px-4 py-3"
//                     >
//                       <h3 className="text-white font-semibold text-lg">
//                         {brand.name}
//                       </h3>
//                     </div>
//                   </Link>
//                 ))
//               )}
//             </div>

//             {/* Right Arrow */}

//             <button
//               onClick={() => scrollBrands("right")}
//               className="absolute right-[-15px] md:right-[-20px] top-1/2
//                          -translate-y-1/2 z-10
//                          w-10 h-10 rounded-full
//                          bg-[#171717] text-white
//                          flex items-center justify-center
//                          text-3xl
//                          hover:bg-orange-500
//                          transition"
//             >
//               ›
//             </button>
//           </div>
//         </div>
//       </section>

//       {/* =====================================================
//           DEALS & OFFERS
//       ===================================================== */}

//       <section className="max-w-7xl mx-auto px-6 py-12">
//         <div className="bg-orange-500 rounded-2xl overflow-hidden">
//           <div className="grid grid-cols-1 md:grid-cols-2 items-center">
//             <div className="p-8 md:p-12 text-white">
//               <p className="text-orange-100 font-medium">Limited Time Offer</p>

//               <h2 className="text-3xl md:text-4xl font-bold mt-2">
//                 Great Deals on Smartphones
//               </h2>

//               <p className="mt-4 text-orange-50">
//                 Save more on the latest smartphones from popular brands. Don't
//                 miss our special offers.
//               </p>

//               <Link
//                 to="/products"
//                 className="inline-block mt-6 bg-white text-orange-500 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100"
//               >
//                 Explore Deals
//               </Link>
//             </div>

//             <div className="hidden md:flex items-center justify-center text-8xl py-12">
//               📱
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* =====================================================
//           NEW ARRIVALS
//       ===================================================== */}

//       <section className="max-w-7xl mx-auto px-6 py-12">
//         <div className="flex items-center justify-between">
//           <div>
//             <p className="text-orange-500 font-medium">Just Added</p>

//             <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
//               New Arrivals
//             </h2>
//           </div>

//           <Link
//             to="/products"
//             className="text-orange-500 hover:text-orange-600 font-medium"
//           >
//             View All
//           </Link>
//         </div>

//         {newProducts.length === 0 ? (
//           <p className="text-gray-500 dark:text-gray-400 mt-6">
//             No new products available.
//           </p>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
//             {newProducts.map((product) => (
//               <ProductCard key={product._id} product={product} />
//             ))}
//           </div>
//         )}
//       </section>

//       {/* =====================================================
//           BEST SELLERS
//       ===================================================== */}

//       <section className="bg-white dark:bg-[#15181b] border-y border-gray-200 dark:border-[#24282d]">
//         <div className="max-w-7xl mx-auto px-6 py-12">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-orange-500 font-medium">Top Rated</p>

//               <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
//                 Popular Mobiles
//               </h2>
//             </div>

//             <Link
//               to="/products"
//               className="text-orange-500 hover:text-orange-600 font-medium"
//             >
//               View All
//             </Link>
//           </div>

//           {bestSellers.length === 0 ? (
//             <p className="text-gray-500 dark:text-gray-400 mt-6">
//               No products available.
//             </p>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
//               {bestSellers.map((product) => (
//                 <ProductCard key={product._id} product={product} showRating />
//               ))}
//             </div>
//           )}
//         </div>
//       </section>

//       {/* =====================================================
//           FOR YOUR BUDGET
//       ===================================================== */}

//       <section className="bg-white dark:bg-[#17191c] border-y border-gray-200 dark:border-transparent">
//         {" "}
//         <div className="max-w-7xl mx-auto px-6 py-12">
//           {/* Section Heading */}

//           <div className="flex items-center justify-between mb-6">
//             <div>
//               <p className="text-gray-400 text-sm">
//                 Find a smartphone within your budget
//               </p>

//               <h2 className="text-2xl md:text-3xl font-bold text-white mt-1">
//                 For Your Budget
//               </h2>
//             </div>
//           </div>

//           {/* Budget Slider */}

//           <div className="relative">
//             {/* Left Arrow */}

//             <button
//               onClick={() => scrollBudget("left")}
//               className="absolute left-[-15px] md:left-[-20px] top-1/2
//                          -translate-y-1/2 z-10
//                          w-10 h-10 rounded-full
//                          bg-[#171717] text-white
//                          flex items-center justify-center
//                          text-3xl
//                          hover:bg-orange-500
//                          transition"
//             >
//               ‹
//             </button>

//             {/* Budget Cards */}

//             <div
//               ref={budgetSliderRef}
//               className="flex gap-4 md:gap-5 overflow-x-auto
//                          scroll-smooth
//                          px-2 md:px-4
//                          pb-3
//                          [scrollbar-width:none]
//                          [&::-webkit-scrollbar]:hidden"
//             >
//               <BudgetCard
//                 title="₹10,001 to"
//                 price="₹20,000"
//                 products={budgetProducts["10k-20k"]}
//                 minPrice="10001"
//                 maxPrice="20000"
//               />

//               <BudgetCard
//                 title="₹20,001 to"
//                 price="₹30,000"
//                 products={budgetProducts["20k-30k"]}
//                 minPrice="20001"
//                 maxPrice="30000"
//               />

//               <BudgetCard
//                 title="₹30,001 to"
//                 price="₹50,000"
//                 products={budgetProducts["30k-50k"]}
//                 minPrice="30001"
//                 maxPrice="50000"
//               />

//               <BudgetCard
//                 title="Above"
//                 price="₹50,000"
//                 products={premiumPhones}
//                 minPrice="50001"
//               />
//             </div>

//             {/* Right Arrow */}

//             <button
//               onClick={() => scrollBudget("right")}
//               className="absolute right-[-15px] md:right-[-20px] top-1/2
//                          -translate-y-1/2 z-10
//                          w-10 h-10 rounded-full
//                          bg-[#171717] text-white
//                          flex items-center justify-center
//                          text-3xl
//                          hover:bg-orange-500
//                          transition"
//             >
//               ›
//             </button>
//           </div>
//         </div>
//       </section>

//       {/* =====================================================
//           WHY SHOP WITH LAVI MOBILE
//       ===================================================== */}

//       <section className="bg-white dark:bg-[#15181b] border-y border-gray-200 dark:border-[#24282d]">
//         <div className="max-w-7xl mx-auto px-6 py-12">
//           <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
//             Why Shop With Lavi Mobile?
//           </h2>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
//             <div className="p-6 rounded-2xl border border-gray-200 dark:border-[#2b3036] bg-white dark:bg-[#1d2125]">
//               <div className="text-3xl">🚚</div>

//               <h3 className="font-semibold mt-4 text-gray-900 dark:text-white">
//                 Fast Delivery
//               </h3>

//               <p className="text-gray-500 dark:text-gray-400 mt-2">
//                 Get your smartphone delivered quickly and safely.
//               </p>
//             </div>

//             <div className="p-6 rounded-2xl border border-gray-200 dark:border-[#2b3036] bg-white dark:bg-[#1d2125]">
//               <div className="text-3xl">🔒</div>

//               <h3 className="font-semibold mt-4 text-gray-900 dark:text-white">
//                 Secure Shopping
//               </h3>

//               <p className="text-gray-500 dark:text-gray-400 mt-2">
//                 Your account and orders are protected.
//               </p>
//             </div>

//             <div className="p-6 rounded-2xl border border-gray-200 dark:border-[#2b3036] bg-white dark:bg-[#1d2125]">
//               <div className="text-3xl">💰</div>

//               <h3 className="font-semibold mt-4 text-gray-900 dark:text-white">
//                 Great Deals
//               </h3>

//               <p className="text-gray-500 dark:text-gray-400 mt-2">
//                 Find smartphones at competitive prices.
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }

// export default Home;
