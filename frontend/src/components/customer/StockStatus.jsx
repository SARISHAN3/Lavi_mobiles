import { FiCheckCircle, FiClock, FiXCircle } from "react-icons/fi";

const StockStatus = ({
  stock = 0,
  lowStockLimit = 5,
  showQuantity = false,
}) => {
  const quantity = Number(stock) || 0;
  const lowLimit = Number(lowStockLimit) || 5;

  let status = "out";

  if (quantity > lowLimit) {
    status = "available";
  } else if (quantity > 0) {
    status = "low";
  }

  const config = {
    available: {
      icon: FiCheckCircle,
      text: "In Stock",
      quantityText: `${quantity} available`,
      className: "text-green-600 dark:text-green-400",
    },
    low: {
      icon: FiClock,
      text: "Only a few left",
      quantityText: `${quantity} left`,
      className: "text-orange-600 dark:text-orange-400",
    },
    out: {
      icon: FiXCircle,
      text: "Out of Stock",
      quantityText: "Currently unavailable",
      className: "text-red-600 dark:text-red-400",
    },
  };

  const current = config[status];
  const Icon = current.icon;

  return (
    <div
      className={`flex items-center gap-1.5 text-sm font-semibold ${current.className}`}
    >
      <Icon size={16} />

      <span>{current.text}</span>

      {showQuantity && (
        <span className="font-normal text-[var(--text-muted)]">
          ({current.quantityText})
        </span>
      )}
    </div>
  );
};

export default StockStatus;
