import { FiArrowRight } from "react-icons/fi";

const InfoCard = ({
  icon: Icon,
  title,
  description,
  actionText,
  onAction,
  href,
  variant = "default",
  className = "",
}) => {
  const variants = {
    default: "border-[var(--border-color)] bg-[var(--bg-card)]",
    orange:
      "border-orange-200 bg-orange-50 dark:border-orange-500/20 dark:bg-orange-500/10",
    blue: "border-blue-200 bg-blue-50 dark:border-blue-500/20 dark:bg-blue-500/10",
    green:
      "border-green-200 bg-green-50 dark:border-green-500/20 dark:bg-green-500/10",
    purple:
      "border-purple-200 bg-purple-50 dark:border-purple-500/20 dark:bg-purple-500/10",
  };

  const iconVariants = {
    default: "bg-[var(--bg-primary)] text-[var(--text-secondary)]",
    orange:
      "bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400",
    blue: "bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
    green:
      "bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-400",
    purple:
      "bg-purple-100 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400",
  };

  const content = (
    <>
      {Icon && (
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
            iconVariants[variant] || iconVariants.default
          }`}
        >
          <Icon size={20} />
        </div>
      )}

      <div className="min-w-0 flex-1">
        {title && (
          <h3 className="text-sm font-bold text-[var(--text-primary)]">
            {title}
          </h3>
        )}

        {description && (
          <p className="mt-1 text-xs leading-5 text-[var(--text-secondary)]">
            {description}
          </p>
        )}

        {actionText && (
          <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-orange-500">
            {actionText}
            <FiArrowRight size={13} />
          </span>
        )}
      </div>
    </>
  );

  const cardClass = `flex items-start gap-3 rounded-xl border p-4 transition ${
    variants[variant] || variants.default
  } ${className}`;

  if (href) {
    return (
      <a
        href={href}
        className={`${cardClass} hover:-translate-y-0.5 hover:shadow-md`}
      >
        {content}
      </a>
    );
  }

  if (onAction) {
    return (
      <button
        type="button"
        onClick={onAction}
        className={`${cardClass} w-full text-left hover:-translate-y-0.5 hover:shadow-md`}
      >
        {content}
      </button>
    );
  }

  return <div className={cardClass}>{content}</div>;
};

export default InfoCard;
