import React from "react";
import { FiSearch, FiX } from "react-icons/fi";

const SearchResultsHeader = ({ searchTerm = "", resultCount = 0, onClear }) => {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        {searchTerm ? (
          <div className="flex flex-wrap items-center gap-2">
            <FiSearch className="text-[var(--text-secondary)]" />

            <h1 className="text-lg font-bold text-[var(--text-primary)] sm:text-xl">
              Search results for "{searchTerm}"
            </h1>

            {onClear && (
              <button
                type="button"
                onClick={onClear}
                className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-red-500 transition hover:bg-red-50 dark:hover:bg-red-500/10"
              >
                <FiX size={14} />
                Clear
              </button>
            )}
          </div>
        ) : (
          <h1 className="text-lg font-bold text-[var(--text-primary)] sm:text-xl">
            All Mobile Phones
          </h1>
        )}

        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          {resultCount} {resultCount === 1 ? "product" : "products"} found
        </p>
      </div>
    </div>
  );
};

export default SearchResultsHeader;
