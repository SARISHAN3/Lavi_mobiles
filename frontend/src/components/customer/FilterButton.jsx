import { FiFilter } from "react-icons/fi";

const FilterButton = ({
  onClick,
  activeCount = 0,
  label = "Filters",
  className = "",
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative inline-flex items-center justify-center gap-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] px-4 py-2.5 text-sm font-semibold text-[var(--text-primary)] transition hover:border-orange-500 hover:text-orange-500 ${className}`}
    >
      <FiFilter size={17} />

      <span>{label}</span>

      {activeCount > 0 && (
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1.5 text-[10px] font-bold text-white">
          {activeCount > 99 ? "99+" : activeCount}
        </span>
      )}
    </button>
  );
};

export default FilterButton;
