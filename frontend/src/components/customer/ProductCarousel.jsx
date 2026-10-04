import { useRef } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import ProductCard from "./ProductCard";
import EmptyState from "./EmptyState";
import ProductSkeleton from "./ProductSkeleton";

const ProductCarousel = ({
  products = [],
  loading = false,
  skeletonCount = 5,
  title,
  emptyTitle = "No products found",
  emptyMessage = "There are no products available right now.",
  showControls = true,
  cardWidth = "default",
  className = "",
}) => {
  const carouselRef = useRef(null);

  const scroll = (direction) => {
    if (!carouselRef.current) return;

    const amount = carouselRef.current.clientWidth * 0.8;

    carouselRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  const cardWidthClasses = {
    small: "min-w-[170px] sm:min-w-[190px] md:min-w-[210px] lg:min-w-[220px]",
    default: "min-w-[220px] sm:min-w-[240px] md:min-w-[250px] lg:min-w-[270px]",
    large: "min-w-[250px] sm:min-w-[280px] md:min-w-[300px] lg:min-w-[320px]",
  };

  if (!loading && products.length === 0) {
    return (
      <div className={className}>
        <EmptyState type="products" title={emptyTitle} message={emptyMessage} />
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {title && (
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[var(--text-primary)] sm:text-xl">
            {title}
          </h2>

          {showControls && !loading && products.length > 1 && (
            <div className="hidden gap-2 sm:flex">
              <button
                type="button"
                onClick={() => scroll("left")}
                aria-label="Scroll products left"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-secondary)] transition hover:border-orange-500 hover:text-orange-500"
              >
                <FiChevronLeft size={18} />
              </button>

              <button
                type="button"
                onClick={() => scroll("right")}
                aria-label="Scroll products right"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-secondary)] transition hover:border-orange-500 hover:text-orange-500"
              >
                <FiChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      )}

      <div className="relative">
        {showControls && !loading && products.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => scroll("left")}
              aria-label="Scroll products left"
              className="absolute left-1 top-1/2 z-20 hidden h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-secondary)] shadow-md transition hover:border-orange-500 hover:text-orange-500 md:flex"
            >
              <FiChevronLeft size={18} />
            </button>

            <button
              type="button"
              onClick={() => scroll("right")}
              aria-label="Scroll products right"
              className="absolute right-1 top-1/2 z-20 hidden h-9 w-9 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-secondary)] shadow-md transition hover:border-orange-500 hover:text-orange-500 md:flex"
            >
              <FiChevronRight size={18} />
            </button>
          </>
        )}

        <div
          ref={carouselRef}
          className="flex gap-4 overflow-x-auto scroll-smooth pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {loading
            ? Array.from({
                length: skeletonCount,
              }).map((_, index) => (
                <div
                  key={`product-skeleton-${index}`}
                  className={`shrink-0 ${cardWidthClasses[cardWidth] || cardWidthClasses.default}`}
                >
                  <ProductSkeleton />
                </div>
              ))
            : products.map((product) => (
                <div
                  key={product._id || product.id}
                  className={`shrink-0 ${cardWidthClasses[cardWidth] || cardWidthClasses.default}`}
                >
                  <ProductCard product={product} />
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default ProductCarousel;
