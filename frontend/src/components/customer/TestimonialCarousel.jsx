import { useRef } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import TestimonialCard from "./TestimonialCard";
import EmptyState from "./EmptyState";

const TestimonialCarousel = ({
  testimonials = [],
  title,
  subtitle,
  showControls = true,
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

  if (testimonials.length === 0) {
    return (
      <div className={className}>
        <EmptyState
          type="default"
          title="No testimonials yet"
          message="Customer testimonials will appear here."
        />
      </div>
    );
  }

  return (
    <section className={`relative ${className}`}>
      {(title || subtitle) && (
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            {title && (
              <h2 className="text-xl font-bold text-[var(--text-primary)] sm:text-2xl">
                {title}
              </h2>
            )}

            {subtitle && (
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                {subtitle}
              </p>
            )}
          </div>

          {showControls && testimonials.length > 1 && (
            <div className="hidden shrink-0 gap-2 sm:flex">
              <button
                type="button"
                onClick={() => scroll("left")}
                aria-label="Scroll testimonials left"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-secondary)] transition hover:border-orange-500 hover:text-orange-500"
              >
                <FiChevronLeft size={18} />
              </button>

              <button
                type="button"
                onClick={() => scroll("right")}
                aria-label="Scroll testimonials right"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-secondary)] transition hover:border-orange-500 hover:text-orange-500"
              >
                <FiChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      )}

      <div className="relative">
        {showControls && testimonials.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => scroll("left")}
              aria-label="Previous testimonials"
              className="absolute left-1 top-1/2 z-20 hidden h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-secondary)] shadow-md transition hover:border-orange-500 hover:text-orange-500 md:flex"
            >
              <FiChevronLeft size={18} />
            </button>

            <button
              type="button"
              onClick={() => scroll("right")}
              aria-label="Next testimonials"
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
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial._id || testimonial.id || `testimonial-${index}`}
              className="min-w-[280px] shrink-0 sm:min-w-[340px] lg:min-w-[380px]"
            >
              <TestimonialCard testimonial={testimonial} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialCarousel;
