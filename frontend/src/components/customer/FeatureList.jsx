import { FiAward, FiCheck, FiShield, FiTruck, FiZap } from "react-icons/fi";

const FeatureList = ({ items = [], columns = "default" }) => {
  const defaultItems = [
    {
      icon: FiTruck,
      title: "Fast Delivery",
      description: "Quick and reliable delivery",
    },
    {
      icon: FiShield,
      title: "Secure Payment",
      description: "Safe and trusted checkout",
    },
    {
      icon: FiAward,
      title: "Genuine Products",
      description: "100% authentic products",
    },
    {
      icon: FiCheck,
      title: "Easy Returns",
      description: "Simple return process",
    },
  ];

  const list = items.length > 0 ? items : defaultItems;

  const columnClasses = {
    default: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
    two: "grid-cols-1 sm:grid-cols-2",
    three: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    four: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div
      className={`grid gap-4 ${
        columnClasses[columns] || columnClasses.default
      }`}
    >
      {list.map((item, index) => {
        const Icon = item.icon || FiZap;

        return (
          <div
            key={`${item.title || "feature"}-${index}`}
            className="flex items-start gap-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
              <Icon size={19} />
            </div>

            <div className="min-w-0">
              <h3 className="text-sm font-bold text-[var(--text-primary)]">
                {item.title}
              </h3>

              {item.description && (
                <p className="mt-1 text-xs leading-5 text-[var(--text-secondary)]">
                  {item.description}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FeatureList;
