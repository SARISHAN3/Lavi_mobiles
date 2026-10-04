import React from "react";

const StatusBadge = ({ status = "", variant }) => {
  const statusKey = String(status).toLowerCase();

  const variants = {
    success:
      "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400",
    danger: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
    warning:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400",
    info: "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
    orange:
      "bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400",
    gray: "bg-gray-100 text-gray-700 dark:bg-gray-500/10 dark:text-gray-400",
  };

  const statusVariants = {
    pending: "warning",
    confirmed: "info",
    processing: "orange",
    shipped: "info",
    delivered: "success",
    cancelled: "danger",
    active: "success",
    inactive: "gray",
    approved: "success",
    rejected: "danger",
    outofstock: "danger",
    "out of stock": "danger",
  };

  const selectedVariant = variant || statusVariants[statusKey] || "gray";

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        variants[selectedVariant] || variants.gray
      }`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
