import { FiArrowRight, FiTruck } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const CartSummary = ({
  subtotal = 0,
  discount = 0,
  shipping = 0,
  total,
  itemCount = 0,
  checkoutPath = "/checkout",
  loading = false,
  onCheckout,
  className = "",
}) => {
  const navigate = useNavigate();

  const calculatedTotal =
    total !== undefined
      ? Number(total)
      : Number(subtotal) - Number(discount) + Number(shipping);

  const handleCheckout = () => {
    if (onCheckout) {
      onCheckout();
      return;
    }

    navigate(checkoutPath);
  };

  return (
    <aside
      className={`rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5 ${className}`}
    >
      <h2 className="text-lg font-bold text-[var(--text-primary)]">
        Order Summary
      </h2>

      <div className="mt-5 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-[var(--text-secondary)]">Subtotal</span>

          <span className="font-semibold text-[var(--text-primary)]">
            ₹{Number(subtotal).toLocaleString("en-IN")}
          </span>
        </div>

        {Number(discount) > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-[var(--text-secondary)]">Discount</span>

            <span className="font-semibold text-green-600">
              -₹
              {Number(discount).toLocaleString("en-IN")}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between text-sm">
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

      <button
        type="button"
        onClick={handleCheckout}
        disabled={loading || itemCount <= 0}
        className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 text-sm font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Processing..." : "Proceed to Checkout"}

        {!loading && <FiArrowRight size={18} />}
      </button>

      <div className="mt-4 flex items-center gap-2 rounded-xl bg-green-50 p-3 text-xs text-green-700 dark:bg-green-500/10 dark:text-green-400">
        <FiTruck size={17} className="shrink-0" />

        <span>Free delivery available on eligible orders.</span>
      </div>

      {itemCount > 0 && (
        <p className="mt-3 text-center text-xs text-[var(--text-muted)]">
          {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
        </p>
      )}
    </aside>
  );
};

export default CartSummary;
