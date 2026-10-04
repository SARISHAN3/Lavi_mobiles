import React from "react";

const IconButton = ({
  icon,
  onClick,
  label,
  variant = "default",
  size = "md",
  disabled = false,
  type = "button",
}) => {
  const variants = {
    default:
      "border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--bg-primary)]",
    orange: "border-orange-500 bg-orange-500 text-white hover:bg-orange-600",
    danger:
      "border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10",
    ghost:
      "border-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-primary)] hover:text-[var(--text-primary)]",
  };

  const sizes = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={`inline-flex items-center justify-center rounded-xl border transition disabled:cursor-not-allowed disabled:opacity-50 ${
        sizes[size] || sizes.md
      } ${variants[variant] || variants.default}`}
    >
      {icon}
    </button>
  );
};

export default IconButton;
