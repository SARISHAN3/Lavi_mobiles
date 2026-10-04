import React, { useState } from "react";
import { FiChevronLeft, FiChevronRight, FiZoomIn } from "react-icons/fi";
import { getImageUrl } from "../../config/image";

const ProductGallery = ({ images = [], productName = "Product" }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const validImages = Array.isArray(images) ? images.filter(Boolean) : [];

  if (validImages.length === 0) {
    return (
      <div className="flex h-[400px] items-center justify-center rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)]">
        <span className="text-sm text-[var(--text-muted)]">
          No image available
        </span>
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
    <div className="space-y-4">
      <div className="relative flex min-h-[400px] items-center justify-center overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6">
        <img
          src={currentImage}
          alt={`${productName} ${selectedIndex + 1}`}
          className="max-h-[380px] max-w-full object-contain"
        />

        {validImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={previousImage}
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md transition hover:bg-gray-100 dark:bg-[#30343a] dark:hover:bg-[#3a4048]"
              aria-label="Previous image"
            >
              <FiChevronLeft size={20} />
            </button>

            <button
              type="button"
              onClick={nextImage}
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md transition hover:bg-gray-100 dark:bg-[#30343a] dark:hover:bg-[#3a4048]"
              aria-label="Next image"
            >
              <FiChevronRight size={20} />
            </button>
          </>
        )}

        <div className="absolute right-4 top-4 rounded-full bg-white/90 p-2 shadow dark:bg-[#30343a]/90">
          <FiZoomIn size={18} />
        </div>
      </div>

      {validImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {validImages.map((image, index) => (
            <button
              type="button"
              key={`${image}-${index}`}
              onClick={() => setSelectedIndex(index)}
              className={`h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 bg-[var(--bg-card)] p-1 transition ${
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

export default ProductGallery;
