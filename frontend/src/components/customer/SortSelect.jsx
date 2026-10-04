import { FiChevronDown } from "react-icons/fi";

const SortSelect = ({
  value = "",
  onChange,
  options = [],
  label = "Sort by",
  disabled = false,
}) => {
  return (
    <div className="flex items-center gap-2">
      {label && (
        <span className="hidden whitespace-nowrap text-sm font-medium text-[var(--text-secondary)] sm:block">
          {label}
        </span>
      )}

      <div className="relative">
        <select
          value={value}
          onChange={(event) => onChange?.(event.target.value)}
          disabled={disabled}
          aria-label={label}
          className="h-10 min-w-40 appearance-none rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] py-2 pl-3 pr-9 text-sm font-medium text-[var(--text-primary)] outline-none transition focus:border-orange-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <FiChevronDown
          size={16}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
        />
      </div>
    </div>
  );
};

export default SortSelect;
