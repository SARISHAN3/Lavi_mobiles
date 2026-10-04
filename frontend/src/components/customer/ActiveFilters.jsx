import React from "react";
import { FiX } from "react-icons/fi";

const ActiveFilters = ({ filters = [], onRemove, onClear }) => {
  if (!filters.length) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-sm font-medium text-[var(--text-secondary)]">
        Filters:
      </span>

      {filters.map((filter) => (
        <button
          type="button"
          key={`${filter.key}-${filter.value}`}
          onClick={() => onRemove?.(filter)}
          className="flex items-center gap-1 rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-medium text-orange-600 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-400"
        >
          {filter.label || filter.value}
          <FiX size={13} />
        </button>
      ))}

      {onClear && filters.length > 1 && (
        <button
          type="button"
          onClick={onClear}
          className="ml-1 text-xs font-semibold text-red-500 hover:underline"
        >
          Clear all
        </button>
      )}
    </div>
  );
};

export default ActiveFilters;
