import { FiChevronDown, FiChevronUp } from "react-icons/fi";

const FilterSection = ({
  title,
  children,
  isOpen = true,
  onToggle,
  className = "",
}) => {
  const handleToggle = () => {
    onToggle?.();
  };

  return (
    <div
      className={`border-b border-[var(--border-color)] py-4 last:border-b-0 ${className}`}
    >
      <button
        type="button"
        onClick={handleToggle}
        className="flex w-full items-center justify-between gap-4 text-left"
        aria-expanded={isOpen}
      >
        <span className="text-sm font-bold text-[var(--text-primary)]">
          {title}
        </span>

        {isOpen ? (
          <FiChevronUp
            size={17}
            className="shrink-0 text-[var(--text-secondary)]"
          />
        ) : (
          <FiChevronDown
            size={17}
            className="shrink-0 text-[var(--text-secondary)]"
          />
        )}
      </button>

      {isOpen && <div className="mt-4">{children}</div>}
    </div>
  );
};

export default FilterSection;
