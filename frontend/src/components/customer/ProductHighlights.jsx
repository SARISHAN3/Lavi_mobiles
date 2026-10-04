import React from "react";
import { FiCheckCircle } from "react-icons/fi";

const ProductHighlights = ({ highlights = [] }) => {
  const items = Array.isArray(highlights)
    ? highlights
    : typeof highlights === "string"
      ? highlights
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean)
      : [];

  if (items.length === 0) return null;

  return (
    <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5">
      <h2 className="mb-4 text-lg font-bold text-[var(--text-primary)]">
        Highlights
      </h2>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {items.map((item, index) => {
          const text =
            typeof item === "object"
              ? item.text || item.title || item.value
              : item;

          return (
            <div
              key={`${text}-${index}`}
              className="flex items-start gap-3 rounded-xl bg-[var(--bg-primary)] p-3"
            >
              <FiCheckCircle
                className="mt-0.5 flex-shrink-0 text-green-500"
                size={18}
              />

              <span className="text-sm text-[var(--text-secondary)]">
                {text}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductHighlights;
