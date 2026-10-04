import { FiShield, FiCheckCircle } from "react-icons/fi";

const ProductWarranty = ({
  warranty,
  title = "Warranty & Protection",
  className = "",
}) => {
  const warrantyText =
    typeof warranty === "string"
      ? warranty
      : warranty?.description || warranty?.title || warranty?.period || "";

  if (!warrantyText) {
    return null;
  }

  const items =
    typeof warranty === "object" && Array.isArray(warranty?.features)
      ? warranty.features
      : [];

  return (
    <section
      className={`rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5 ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
          <FiShield size={21} />
        </div>

        <div>
          <h2 className="text-lg font-bold text-[var(--text-primary)]">
            {title}
          </h2>

          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            {warrantyText}
          </p>
        </div>
      </div>

      {items.length > 0 && (
        <div className="mt-4 space-y-2">
          {items.map((item, index) => (
            <div
              key={`${item}-${index}`}
              className="flex items-center gap-2 text-sm text-[var(--text-secondary)]"
            >
              <FiCheckCircle className="shrink-0 text-green-500" size={16} />
              <span>{item}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default ProductWarranty;
