import React from "react";

const Divider = ({ label = "", className = "" }) => {
  if (!label) {
    return (
      <div className={`h-px w-full bg-[var(--border-color)] ${className}`} />
    );
  }

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <div className="h-px flex-1 bg-[var(--border-color)]" />

      <span className="text-xs font-medium text-[var(--text-muted)]">
        {label}
      </span>

      <div className="h-px flex-1 bg-[var(--border-color)]" />
    </div>
  );
};

export default Divider;
