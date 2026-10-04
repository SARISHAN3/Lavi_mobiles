import { useState } from "react";
import { FiChevronLeft, FiChevronRight, FiZoomIn } from "react-icons/fi";
import { getImageUrl } from "../../config/image";

const ProductImageGallery = ({
  images = [],
  productName = "Product",
  className = "",
}) => {
  const validImages = Array.isArray(images)
    ? images.filter(Boolean)
    : images
      ? [images]
      : [];

  const [selectedIndex, setSelectedIndex] = useState(0);

  if (validImages.length === 0) {
    return (
      <div
        className={`flex aspect-square items-center justify-center rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] ${className}`}
      >
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-2xl bg-[var(--bg-primary)] text-3xl text-[var(--text-muted)]">
            📱
          </div>
          <p className="text-sm text-[var(--text-muted)]">
            No product image available
          </p>
        </div>
      </div>
    );
  }

  const currentImage = getImageUrl(validImages[selectedIndex]);

  const previousImage = () => {
    setSelectedIndex((current) =>
      current === 0 ? validImages.length - 1 : current - 1,
    );
  };

  const nextImage = () => {
    setSelectedIndex((current) =>
      current === validImages.length - 1 ? 0 : current + 1,
    );
  };

  return (
    <div className={className}>
      <div className="relative overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)]">
        <div className="aspect-square p-5 sm:p-8">
          <img
            src={currentImage}
            alt={`${productName} ${selectedIndex + 1}`}
            className="h-full w-full object-contain"
          />
        </div>

        {validImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={previousImage}
              aria-label="Previous product image"
              className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-secondary)] shadow-md transition hover:text-orange-500"
            >
              <FiChevronLeft size={18} />
            </button>

            <button
              type="button"
              onClick={nextImage}
              aria-label="Next product image"
              className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-secondary)] shadow-md transition hover:text-orange-500"
            >
              <FiChevronRight size={18} />
            </button>
          </>
        )}

        <div className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white">
          <FiZoomIn size={17} />
        </div>
      </div>

      {validImages.length > 1 && (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
          {validImages.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setSelectedIndex(index)}
              className={`h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 bg-[var(--bg-card)] p-1 transition ${
                selectedIndex === index
                  ? "border-orange-500"
                  : "border-[var(--border-color)] hover:border-orange-300"
              }`}
            >
              <img
                src={getImageUrl(image)}
                alt={`${productName} thumbnail ${index + 1}`}
                className="h-full w-full object-contain"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;
