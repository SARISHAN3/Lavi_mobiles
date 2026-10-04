import { FiMapPin, FiCreditCard, FiTag } from "react-icons/fi";

const OrderSummaryCard = ({ order, className = "" }) => {
  if (!order) return null;

  const address = order.shippingAddress || {};

  const paymentMethod = order.paymentMethod || "COD";

  const subtotal = Number(order.subtotal) || 0;

  const discount = Number(order.discountAmount) || 0;

  const shipping = Number(order.shippingAmount) || 0;

  const total = Number(order.totalAmount) || subtotal - discount + shipping;

  return (
    <section
      className={`rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5 sm:p-6 ${className}`}
    >
      <h2 className="text-lg font-bold text-[var(--text-primary)]">
        Order Summary
      </h2>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl bg-[var(--bg-primary)] p-4">
          <div className="flex items-center gap-2">
            <FiMapPin size={17} className="text-orange-500" />

            <p className="text-sm font-bold text-[var(--text-primary)]">
              Delivery Address
            </p>
          </div>

          <div className="mt-3 space-y-1 text-xs leading-5 text-[var(--text-secondary)]">
            {address.name && (
              <p className="font-semibold text-[var(--text-primary)]">
                {address.name}
              </p>
            )}

            {address.phone && <p>{address.phone}</p>}

            {address.street && <p>{address.street}</p>}

            <p>
              {[address.city, address.state, address.pincode]
                .filter(Boolean)
                .join(", ")}
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-[var(--bg-primary)] p-4">
          <div className="flex items-center gap-2">
            <FiCreditCard size={17} className="text-orange-500" />

            <p className="text-sm font-bold text-[var(--text-primary)]">
              Payment
            </p>
          </div>

          <p className="mt-3 text-sm font-semibold text-[var(--text-primary)]">
            {paymentMethod === "COD" ? "Cash on Delivery" : paymentMethod}
          </p>

          {order.couponCode && (
            <div className="mt-3 flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
              <FiTag size={14} />
              Coupon: {order.couponCode}
            </div>
          )}
        </div>
      </div>

      <div className="my-5 h-px bg-[var(--border-color)]" />

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-[var(--text-secondary)]">Subtotal</span>

          <span className="font-semibold text-[var(--text-primary)]">
            ₹{subtotal.toLocaleString("en-IN")}
          </span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between">
            <span className="text-[var(--text-secondary)]">Discount</span>

            <span className="font-semibold text-green-600">
              -₹
              {discount.toLocaleString("en-IN")}
            </span>
          </div>
        )}

        <div className="flex justify-between">
          <span className="text-[var(--text-secondary)]">Shipping</span>

          <span className="font-semibold text-[var(--text-primary)]">
            {shipping === 0 ? "FREE" : `₹${shipping.toLocaleString("en-IN")}`}
          </span>
        </div>
      </div>

      <div className="my-5 h-px bg-[var(--border-color)]" />

      <div className="flex items-center justify-between">
        <span className="font-bold text-[var(--text-primary)]">Total</span>

        <span className="text-xl font-extrabold text-[var(--text-primary)]">
          ₹{total.toLocaleString("en-IN")}
        </span>
      </div>
    </section>
  );
};

export default OrderSummaryCard;
