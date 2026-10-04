import React from "react";
import { FiCheckCircle, FiMapPin, FiRefreshCw, FiTruck } from "react-icons/fi";

const DeliveryInfo = ({
  deliveryDate = "3-5 business days",
  returnPolicy = "Easy returns available",
  seller = "Lavi Mobile",
}) => {
  const items = [
    {
      icon: FiTruck,
      title: "Fast Delivery",
      description: deliveryDate,
    },
    {
      icon: FiRefreshCw,
      title: "Easy Returns",
      description: returnPolicy,
    },
    {
      icon: FiCheckCircle,
      title: "Genuine Product",
      description: `Sold by ${seller}`,
    },
    {
      icon: FiMapPin,
      title: "Delivery Available",
      description: "Check your pincode for availability",
    },
  ];

  return (
    <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5">
      <h2 className="mb-4 text-lg font-bold text-[var(--text-primary)]">
        Delivery & Services
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.title} className="flex items-start gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-500 dark:bg-orange-500/10">
                <Icon size={19} />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                  {item.title}
                </h3>

                <p className="mt-1 text-xs text-[var(--text-secondary)]">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DeliveryInfo;
