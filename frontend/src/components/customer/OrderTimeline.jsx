import { FiCheck, FiClock, FiPackage, FiTruck, FiX } from "react-icons/fi";

const OrderTimeline = ({
  currentStatus = "Pending",
  cancelled = false,
  className = "",
}) => {
  const statuses = [
    {
      key: "Pending",
      label: "Order Placed",
      description: "Your order has been received.",
      icon: FiClock,
    },
    {
      key: "Confirmed",
      label: "Confirmed",
      description: "Your order has been confirmed.",
      icon: FiCheck,
    },
    {
      key: "Processing",
      label: "Processing",
      description: "Your order is being prepared.",
      icon: FiPackage,
    },
    {
      key: "Shipped",
      label: "Shipped",
      description: "Your order is on the way.",
      icon: FiTruck,
    },
    {
      key: "Delivered",
      label: "Delivered",
      description: "Your order has been delivered.",
      icon: FiCheck,
    },
  ];

  const currentIndex = statuses.findIndex(
    (item) => item.key.toLowerCase() === String(currentStatus).toLowerCase(),
  );

  const activeIndex = currentIndex >= 0 ? currentIndex : 0;

  if (cancelled) {
    return (
      <div
        className={`rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-500/20 dark:bg-red-500/10 ${className}`}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400">
            <FiX size={20} />
          </div>

          <div>
            <p className="text-sm font-bold text-red-700 dark:text-red-400">
              Order Cancelled
            </p>

            <p className="mt-1 text-xs text-red-600/80 dark:text-red-400/80">
              This order has been cancelled.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5 sm:p-6 ${className}`}
    >
      <h2 className="text-lg font-bold text-[var(--text-primary)]">
        Order Status
      </h2>

      <div className="mt-6">
        {statuses.map((status, index) => {
          const Icon = status.icon;
          const completed = index <= activeIndex;
          const isLast = index === statuses.length - 1;

          return (
            <div key={status.key} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                    completed
                      ? "bg-orange-500 text-white"
                      : "border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-muted)]"
                  }`}
                >
                  <Icon size={17} />
                </div>

                {!isLast && (
                  <div
                    className={`my-1 w-0.5 flex-1 min-h-8 ${
                      index < activeIndex
                        ? "bg-orange-500"
                        : "bg-[var(--border-color)]"
                    }`}
                  />
                )}
              </div>

              <div className={`pb-7 ${isLast ? "pb-0" : ""}`}>
                <p
                  className={`text-sm font-bold ${
                    completed
                      ? "text-[var(--text-primary)]"
                      : "text-[var(--text-muted)]"
                  }`}
                >
                  {status.label}
                </p>

                <p className="mt-1 text-xs text-[var(--text-secondary)]">
                  {status.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderTimeline;
