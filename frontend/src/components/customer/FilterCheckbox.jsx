const FilterCheckbox = ({
  label,
  checked = false,
  onChange,
  count,
  disabled = false,
}) => {
  return (
    <label
      className={`flex cursor-pointer items-center justify-between gap-3 py-1.5 ${
        disabled ? "cursor-not-allowed opacity-50" : ""
      }`}
    >
      <span className="flex min-w-0 items-center gap-3">
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange?.(event.target.checked)}
          disabled={disabled}
          className="h-4 w-4 cursor-pointer rounded border-[var(--border-color)] accent-orange-500 disabled:cursor-not-allowed"
        />

        <span className="truncate text-sm text-[var(--text-secondary)]">
          {label}
        </span>
      </span>

      {count !== undefined && count !== null && (
        <span className="shrink-0 text-xs text-[var(--text-muted)]">
          ({count})
        </span>
      )}
    </label>
  );
};

export default FilterCheckbox;
