import {
  FiCheckCircle,
  FiClock,
  FiShield,
  FiStar,
  FiTruck,
} from "react-icons/fi";

const TrustBadge = ({
  icon: Icon,
  title,
  description,
  variant = "orange",
  className = "",
}) => {
  const defaultIcons = {
    orange: FiCheckCircle,
    green: FiShield,
    blue: FiTruck,
    purple: FiStar,
    gray: FiClock,
  };

  const SelectedIcon = Icon || defaultIcons[variant] || FiCheckCircle;

  const variants = {
    orange: {
      wrapper: "border-orange-200 dark:border-orange-500/20",
      icon: "bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400",
    },
    green: {
      wrapper: "border-green-200 dark:border-green-500/20",
      icon: "bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-400",
    },
    blue: {
      wrapper: "border-blue-200 dark:border-blue-500/20",
      icon: "bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
    },
    purple: {
      wrapper: "border-purple-200 dark:border-purple-500/20",
      icon: "bg-purple-100 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400",
    },
    gray: {
      wrapper: "border-[var(--border-color)]",
      icon: "bg-[var(--bg-primary)] text-[var(--text-secondary)]",
    },
  };

  const selectedVariant = variants[variant] || variants.orange;

  return (
    <div
      className={`flex items-center gap-3 rounded-xl border bg-[var(--bg-card)] p-3 ${selectedVariant.wrapper} ${className}`}
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${selectedVariant.icon}`}
      >
        <SelectedIcon size={18} />
      </div>

      <div className="min-w-0">
        <h3 className="text-xs font-bold text-[var(--text-primary)] sm:text-sm">
          {title}
        </h3>

        {description && (
          <p className="mt-0.5 text-[11px] leading-4 text-[var(--text-secondary)] sm:text-xs">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

export default TrustBadge;
