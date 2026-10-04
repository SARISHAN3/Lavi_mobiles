import { FiEdit2, FiMapPin, FiPhone, FiTrash2 } from "react-icons/fi";

const AddressCard = ({
  address,
  onEdit,
  onDelete,
  selected = false,
  onSelect,
  showActions = true,
  className = "",
}) => {
  if (!address) return null;

  return (
    <article
      className={`relative rounded-2xl border bg-[var(--bg-card)] p-4 transition ${
        selected
          ? "border-orange-500 ring-1 ring-orange-500"
          : "border-[var(--border-color)]"
      } ${className}`}
    >
      {onSelect && (
        <button
          type="button"
          onClick={() => onSelect(address)}
          className="absolute inset-0 z-0"
          aria-label={`Select address for ${address.name || "delivery"}`}
        />
      )}

      <div className="relative z-10 pointer-events-none">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
            <FiMapPin size={18} />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-bold text-[var(--text-primary)]">
                {address.name || "Delivery Address"}
              </h3>

              {address.type && (
                <span className="rounded-full bg-[var(--bg-primary)] px-2 py-0.5 text-[10px] font-semibold text-[var(--text-muted)]">
                  {address.type}
                </span>
              )}

              {selected && (
                <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-semibold text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
                  Selected
                </span>
              )}
            </div>

            <p className="mt-2 text-sm leading-5 text-[var(--text-secondary)]">
              {address.street}
            </p>

            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              {[address.city, address.state, address.pincode]
                .filter(Boolean)
                .join(", ")}
            </p>

            {address.phone && (
              <div className="mt-2 flex items-center gap-2 text-xs text-[var(--text-muted)]">
                <FiPhone size={13} />
                {address.phone}
              </div>
            )}
          </div>
        </div>

        {showActions && (
          <div className="pointer-events-auto mt-4 flex gap-2 border-t border-[var(--border-color)] pt-3">
            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(address)}
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-[var(--text-secondary)] transition hover:bg-[var(--bg-primary)] hover:text-orange-500"
              >
                <FiEdit2 size={14} />
                Edit
              </button>
            )}

            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(address)}
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-red-500 transition hover:bg-red-50 dark:hover:bg-red-500/10"
              >
                <FiTrash2 size={14} />
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </article>
  );
};

export default AddressCard;
