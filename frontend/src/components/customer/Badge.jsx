const Badge = ({
  children,
  variant = "default",
  size = "md",
  className = "",
}) => {
  const variants = {
    default: "bg-[var(--bg-primary)] text-[var(--text-secondary)]",

    orange:
      "bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400",

    green:
      "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400",

    red: "bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400",

    yellow:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400",

    blue: "bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",

    purple:
      "bg-purple-100 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400",

    dark: "bg-gray-800 text-white dark:bg-gray-100 dark:text-gray-800",
  };

  const sizes = {
    sm: "px-1.5 py-0.5 text-[10px]",
    md: "px-2 py-1 text-xs",
    lg: "px-3 py-1.5 text-sm",
  };

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full font-semibold ${variants[variant] || variants.default} ${sizes[size] || sizes.md} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
