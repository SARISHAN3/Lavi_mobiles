import {
  FiCheckCircle,
  FiClock,
  FiPackage,
  FiTruck,
  FiXCircle,
} from "react-icons/fi";

const OrderStatus = ({
  status = "Pending",
  showIcon = true,
  size = "sm",
  className = "",
}) => {
  const normalized = String(status)
    .toLowerCase()
    .replace(/[\s_-]+/g, "");

  const config = {
    pending: {
      label: "Pending",
      className:
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400",
      icon: FiClock,
    },
    confirmed: {
      label: "Confirmed",
      className:
        "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
      icon: FiCheckCircle,
    },
    processing: {
      label: "Processing",
      className:
        "bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400",
      icon: FiPackage,
    },
    shipped: {
      label: "Shipped",
      className:
        "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400",
      icon: FiTruck,
    },
    delivered: {
      label: "Delivered",
      className:
        "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400",
      icon: FiCheckCircle,
    },
    cancelled: {
      label: "Cancelled",
      className: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
      icon: FiXCircle,
    },
  };

  const current = config[normalized] || config.pending;

  const Icon = current.icon;

  const sizeClass =
    size === "lg"
      ? "px-3 py-1.5 text-sm"
      : size === "md"
        ? "px-2.5 py-1.5 text-xs"
        : "px-2 py-1 text-[11px]";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${current.className} ${sizeClass} ${className}`}
    >
      {showIcon && <Icon size={size === "lg" ? 16 : 14} />}

      {current.label}
    </span>
  );
};

export default OrderStatus;
