import { FiTag } from "react-icons/fi";

const OfferBadge = ({
  children,
  variant = "orange",
  icon = true,
  className = "",
}) => {
  const variants = {
    orange:
      "bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400",

    green:
      "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400",

    blue: "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",

    purple:
      "bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400",

    red: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold ${
        variants[variant] || variants.orange
      } ${className}`}
    >
      {icon && <FiTag size={13} />}

      <span>{children}</span>
    </span>
  );
};

export default OfferBadge;
