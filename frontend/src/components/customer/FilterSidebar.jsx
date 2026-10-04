import React from "react";
import { FiFilter, FiX } from "react-icons/fi";
import FilterSection from "./FilterSection";
import FilterCheckbox from "./FilterCheckbox";
import FilterRadio from "./FilterRadio";
import PriceRange from "./PriceRange";

const FilterSidebar = ({
  filters = {},
  brands = [],
  categories = [],
  ramOptions = [],
  storageOptions = [],
  networkOptions = [],
  ratingOptions = [],
  onChange,
  onClear,
  mobileOpen = false,
  onClose,
}) => {
  const updateFilter = (key, value) => {
    if (onChange) {
      onChange(key, value);
    }
  };

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[300px] overflow-y-auto bg-[var(--bg-card)] p-5 shadow-xl transition-transform duration-300 lg:static lg:z-auto lg:w-full lg:translate-x-0 lg:rounded-2xl lg:border lg:border-[var(--border-color)] lg:shadow-none ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FiFilter className="text-orange-500" />

            <h2 className="font-bold text-[var(--text-primary)]">Filters</h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-[var(--text-secondary)] hover:bg-[var(--bg-primary)] lg:hidden"
          >
            <FiX size={20} />
          </button>
        </div>

        {onClear && (
          <button
            type="button"
            onClick={onClear}
            className="mb-5 w-full rounded-lg border border-orange-500 px-4 py-2 text-sm font-semibold text-orange-500 transition hover:bg-orange-50 dark:hover:bg-orange-500/10"
          >
            Clear All Filters
          </button>
        )}

        <div className="space-y-1">
          <FilterSection title="Category" defaultOpen>
            <div className="space-y-2">
              {categories.map((category) => (
                <FilterCheckbox
                  key={category._id || category.id || category.name}
                  label={category.name}
                  checked={filters.category === (category._id || category.id)}
                  onChange={() =>
                    updateFilter("category", category._id || category.id)
                  }
                />
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Brand" defaultOpen>
            <div className="space-y-2">
              {brands.map((brand) => (
                <FilterCheckbox
                  key={brand._id || brand.id || brand.name}
                  label={brand.name}
                  checked={filters.brand === (brand._id || brand.id)}
                  onChange={() => updateFilter("brand", brand._id || brand.id)}
                />
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Price" defaultOpen>
            <PriceRange
              min={filters.minPrice || 0}
              max={filters.maxPrice || 200000}
              onChange={(range) => {
                updateFilter("minPrice", range.min);
                updateFilter("maxPrice", range.max);
              }}
            />
          </FilterSection>

          <FilterSection title="RAM">
            <div className="space-y-2">
              {ramOptions.map((option) => (
                <FilterRadio
                  key={option}
                  label={option}
                  name="ram"
                  value={option}
                  checked={filters.ram === option}
                  onChange={() => updateFilter("ram", option)}
                />
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Storage">
            <div className="space-y-2">
              {storageOptions.map((option) => (
                <FilterRadio
                  key={option}
                  label={option}
                  name="storage"
                  value={option}
                  checked={filters.storage === option}
                  onChange={() => updateFilter("storage", option)}
                />
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Network">
            <div className="space-y-2">
              {networkOptions.map((option) => (
                <FilterRadio
                  key={option}
                  label={option}
                  name="network"
                  value={option}
                  checked={filters.network === option}
                  onChange={() => updateFilter("network", option)}
                />
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Rating">
            <div className="space-y-2">
              {ratingOptions.map((option) => (
                <FilterRadio
                  key={option}
                  label={`${option} & above`}
                  name="rating"
                  value={option}
                  checked={filters.rating === option}
                  onChange={() => updateFilter("rating", option)}
                />
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Availability">
            <FilterCheckbox
              label="In Stock"
              checked={filters.inStock === true}
              onChange={() => updateFilter("inStock", !filters.inStock)}
            />
          </FilterSection>
        </div>
      </aside>
    </>
  );
};

export default FilterSidebar;
