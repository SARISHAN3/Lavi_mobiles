import { Link } from "react-router-dom";
import { FiChevronRight, FiPackage } from "react-icons/fi";
import { getProductImage } from "../../config/image";
import OrderStatus from "./OrderStatus";

const OrderCard = ({ order, className = "" }) => {
  if (!order) return null;

  const orderId = order._id || order.id;

  const displayId =
    order.orderNumber ||
    order.orderId ||
    orderId?.slice(-8)?.toUpperCase() ||
    "N/A";

  const items = order.items || [];

  const date = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "";

  const total = Number(order.totalAmount) || 0;

  return (
    <article
      className={`rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4 sm:p-5 ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-color)] pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
            <FiPackage size={19} />
          </div>

          <div>
            <p className="text-xs text-[var(--text-muted)]">Order ID</p>

            <p className="mt-0.5 text-sm font-bold text-[var(--text-primary)]">
              #{displayId}
            </p>

            {date && (
              <p className="mt-0.5 text-xs text-[var(--text-muted)]">{date}</p>
            )}
          </div>
        </div>

        <OrderStatus status={order.orderStatus || order.status || "Pending"} />
      </div>

      <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
        {items.slice(0, 4).map((item, index) => {
          const product = item.product || item;

          const image = getProductImage(product.images);

          return (
            <div
              key={item._id || product._id || index}
              className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[var(--bg-primary)] p-2"
            >
              {image ? (
                <img
                  src={image}
                  alt={product.name || "Product"}
                  className="h-full w-full object-contain"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-2xl">
                  📱
                </div>
              )}
            </div>
          );
        })}

        {items.length > 4 && (
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-[var(--bg-primary)] text-xs font-semibold text-[var(--text-muted)]">
            +{items.length - 4} more
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs text-[var(--text-muted)]">
            {items.length} {items.length === 1 ? "item" : "items"}
          </p>

          <p className="mt-1 text-lg font-extrabold text-[var(--text-primary)]">
            ₹{total.toLocaleString("en-IN")}
          </p>
        </div>

        {orderId && (
          <Link
            to={`/orders/${orderId}`}
            className="inline-flex items-center gap-1 rounded-xl border border-[var(--border-color)] px-4 py-2.5 text-sm font-semibold text-[var(--text-secondary)] transition hover:border-orange-500 hover:text-orange-500"
          >
            View Order
            <FiChevronRight size={16} />
          </Link>
        )}
      </div>
    </article>
  );
};

export default OrderCard;
