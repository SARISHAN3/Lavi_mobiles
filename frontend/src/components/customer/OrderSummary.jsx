import { FiShoppingBag } from "react-icons/fi";
import { getProductImage } from "../../config/image";

const OrderSummary = ({
  items = [],
  subtotal = 0,
  discount = 0,
  shipping = 0,
  total,
  className = "",
}) => {
  const calculatedTotal =
    total !== undefined
      ? Number(total)
      : Number(subtotal) - Number(discount) + Number(shipping);

  return (
    <section
      className={`rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5 sm:p-6 ${className}`}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
          <FiShoppingBag size={19} />
        </div>

        <div>
          <h2 className="text-lg font-bold text-[var(--text-primary)]">
            Order Summary
          </h2>

          <p className="mt-0.5 text-xs text-[var(--text-muted)]">
            Review your items before placing the order.
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        {items.map((item, index) => {
          const product = item.product || item;

          const image = getProductImage(product.images);

          const quantity = Number(item.quantity) || 1;

          const price = Number(item.price ?? product.price) || 0;

          return (
            <div
              key={
                item._id || product._id || product.id || `order-item-${index}`
              }
              className="flex gap-3"
            >
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-[var(--bg-primary)] p-1">
                {image ? (
                  <img
                    src={image}
                    alt={product.name || "Product"}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <span>📱</span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-[var(--text-primary)]">
                  {product.name || "Product"}
                </p>

                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  Qty: {quantity}
                </p>
              </div>

              <p className="shrink-0 text-sm font-bold text-[var(--text-primary)]">
                ₹{(price * quantity).toLocaleString("en-IN")}
              </p>
            </div>
          );
        })}
      </div>

      <div className="my-5 h-px bg-[var(--border-color)]" />

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-[var(--text-secondary)]">Subtotal</span>

          <span className="font-semibold text-[var(--text-primary)]">
            ₹{Number(subtotal).toLocaleString("en-IN")}
          </span>
        </div>

        {Number(discount) > 0 && (
          <div className="flex justify-between">
            <span className="text-[var(--text-secondary)]">Discount</span>

            <span className="font-semibold text-green-600">
              -₹
              {Number(discount).toLocaleString("en-IN")}
            </span>
          </div>
        )}

        <div className="flex justify-between">
          <span className="text-[var(--text-secondary)]">Shipping</span>

          <span className="font-semibold text-[var(--text-primary)]">
            {Number(shipping) === 0
              ? "FREE"
              : `₹${Number(shipping).toLocaleString("en-IN")}`}
          </span>
        </div>
      </div>

      <div className="my-5 h-px bg-[var(--border-color)]" />

      <div className="flex items-center justify-between">
        <span className="text-base font-bold text-[var(--text-primary)]">
          Total
        </span>

        <span className="text-xl font-extrabold text-[var(--text-primary)]">
          ₹{calculatedTotal.toLocaleString("en-IN")}
        </span>
      </div>
    </section>
  );
};

export default OrderSummary;
