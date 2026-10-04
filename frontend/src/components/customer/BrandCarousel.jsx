import { useRef } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import BrandCard from "./BrandCard";
import BrandSkeleton from "./BrandSkeleton";
import EmptyState from "./EmptyState";

const BrandCarousel = ({
  brands = [],
  loading = false,
  skeletonCount = 6,
  title,
  emptyTitle = "No brands found",
  emptyMessage = "There are no brands available right now.",
  showControls = true,
  className = "",
}) => {
  const carouselRef = useRef(null);

  const scroll = (direction) => {
    if (!carouselRef.current) return;

    const amount = carouselRef.current.clientWidth * 0.75;

    carouselRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  if (!loading && brands.length === 0) {
    return (
      <div className={className}>
        <EmptyState type="default" title={emptyTitle} message={emptyMessage} />
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

          {showControls && !loading && brands.length > 1 && (
            <div className="hidden gap-2 sm:flex">
              <button
                type="button"
                onClick={() => scroll("left")}
                aria-label="Scroll brands left"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-secondary)] transition hover:border-orange-500 hover:text-orange-500"
              >
                <FiChevronLeft size={18} />
              </button>

              <button
                type="button"
                onClick={() => scroll("right")}
                aria-label="Scroll brands right"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-secondary)] transition hover:border-orange-500 hover:text-orange-500"
              >
                <FiChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      )}

      <div className="relative">
        {showControls && !loading && brands.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => scroll("left")}
              aria-label="Scroll brands left"
              className="absolute left-1 top-1/2 z-20 hidden h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-secondary)] shadow-md transition hover:border-orange-500 hover:text-orange-500 md:flex"
            >
              <FiChevronLeft size={18} />
            </button>

            <button
              type="button"
              onClick={() => scroll("right")}
              aria-label="Scroll brands right"
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
                  key={`brand-skeleton-${index}`}
                  className="min-w-[150px] shrink-0 sm:min-w-[180px] md:min-w-[200px]"
                >
                  <BrandSkeleton />
                </div>
              ))
            : brands.map((brand) => (
                <div
                  key={brand._id || brand.id}
                  className="min-w-[150px] shrink-0 sm:min-w-[180px] md:min-w-[200px]"
                >
                  <BrandCard brand={brand} />
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default BrandCarousel;
