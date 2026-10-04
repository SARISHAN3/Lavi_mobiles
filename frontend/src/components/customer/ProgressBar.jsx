import React from "react";

const ProgressBar = ({
  value = 0,
  max = 100,
  label,
  showValue = false,
  size = "md",
}) => {
  const percentage = Math.min(
    100,
    Math.max(0, (Number(value) / Number(max || 1)) * 100),
  );

  const sizes = {
    sm: "h-1.5",
    md: "h-2",
    lg: "h-3",
  };

  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="mb-2 flex items-center justify-between">
          {label && (
            <span className="text-sm font-medium text-[var(--text-primary)]">
              {label}
            </span>
          )}

          {showValue && (
            <span className="text-xs text-[var(--text-secondary)]">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}

      <div
        className={`w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700 ${sizes[size] || sizes.md}`}
      >
        <div
          className="h-full rounded-full bg-orange-500 transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
