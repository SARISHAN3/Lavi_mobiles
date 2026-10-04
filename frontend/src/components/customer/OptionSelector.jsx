const OptionSelector = ({
  label,
  options = [],
  value = "",
  onChange,
  disabled = false,
  columns = "auto",
}) => {
  if (!options || options.length === 0) {
    return null;
  }

  const columnClasses = {
    auto: "grid-cols-2 sm:grid-cols-3",
    two: "grid-cols-2",
    three: "grid-cols-2 sm:grid-cols-3",
    four: "grid-cols-2 sm:grid-cols-4",
  };

  const getOptionValue = (option) => {
    if (typeof option === "string" || typeof option === "number") {
      return String(option);
    }

    return String(option?.value ?? option?.name ?? option?.label ?? "");
  };

  const getOptionLabel = (option) => {
    if (typeof option === "string" || typeof option === "number") {
      return String(option);
    }

    return String(option?.label ?? option?.name ?? option?.value ?? "");
  };

  const isOptionDisabled = (option) => {
    return Boolean(typeof option === "object" && option?.disabled);
  };

  return (
    <div>
      {label && (
        <h3 className="mb-3 text-sm font-semibold text-[var(--text-primary)]">
          {label}
        </h3>
      )}

      <div
        className={`grid gap-2 ${columnClasses[columns] || columnClasses.auto}`}
      >
        {options.map((option, index) => {
          const optionValue = getOptionValue(option);
          const optionLabel = getOptionLabel(option);

          const selected = value === optionValue;
          const optionDisabled = disabled || isOptionDisabled(option);

          return (
            <button
              key={`${optionValue}-${index}`}
              type="button"
              onClick={() => onChange?.(optionValue)}
              disabled={optionDisabled}
              aria-pressed={selected}
              className={`min-h-10 rounded-lg border px-3 py-2 text-sm font-medium transition ${
                selected
                  ? "border-orange-500 bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400"
                  : "border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:border-orange-400 hover:text-orange-500"
              } ${
                optionDisabled
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer"
              }`}
            >
              {optionLabel}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default OptionSelector;
