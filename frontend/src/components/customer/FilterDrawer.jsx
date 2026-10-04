import React from "react";
import { FiX } from "react-icons/fi";

const FilterDrawer = ({
  open = false,
  title = "Filters",
  children,
  onClose,
  onApply,
}) => {
  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col bg-[var(--bg-card)] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[var(--border-color)] p-5">
          <h2 className="text-lg font-bold text-[var(--text-primary)]">
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-[var(--text-secondary)] hover:bg-[var(--bg-primary)]"
          >
            <FiX size={21} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">{children}</div>

        <div className="border-t border-[var(--border-color)] p-5">
          <button
            type="button"
            onClick={onApply || onClose}
            className="w-full rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white transition hover:bg-orange-600"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </>
  );
};

export default FilterDrawer;
