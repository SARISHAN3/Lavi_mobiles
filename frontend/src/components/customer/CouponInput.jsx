import { useState } from "react";
import { FiCheck, FiLoader, FiTag, FiX } from "react-icons/fi";

const CouponInput = ({
  onApply,
  onRemove,
  appliedCoupon = null,
  loading = false,
  error = "",
  className = "",
}) => {
  const [code, setCode] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const cleanCode = code.trim().toUpperCase();

    if (!cleanCode || loading) return;

    const result = await onApply?.(cleanCode);

    if (result !== false) {
      setCode("");
    }
  };

  if (appliedCoupon) {
    return (
      <div
        className={`rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-500/20 dark:bg-green-500/10 ${className}`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-400">
              <FiCheck size={18} />
            </div>

            <div>
              <p className="text-xs font-medium text-green-700 dark:text-green-400">
                Coupon Applied
              </p>

              <p className="mt-1 text-sm font-bold text-[var(--text-primary)]">
                {appliedCoupon.code}
              </p>

              {appliedCoupon.description && (
                <p className="mt-1 text-xs text-[var(--text-secondary)]">
                  {appliedCoupon.description}
                </p>
              )}
            </div>
          </div>

          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              disabled={loading}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-muted)] transition hover:bg-white hover:text-red-500 disabled:opacity-50 dark:hover:bg-black/10"
            >
              <FiX size={17} />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <p className="mb-2 text-sm font-semibold text-[var(--text-primary)]">
        Have a coupon?
      </p>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <FiTag
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
          />

          <input
            type="text"
            value={code}
            onChange={(event) => setCode(event.target.value.toUpperCase())}
            placeholder="Enter coupon code"
            disabled={loading}
            className="h-11 w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] pl-10 pr-3 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-orange-500 disabled:opacity-50"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !code.trim()}
          className="flex h-11 min-w-24 items-center justify-center rounded-xl bg-orange-500 px-4 text-sm font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? <FiLoader size={17} className="animate-spin" /> : "Apply"}
        </button>
      </form>

      {error && (
        <p className="mt-2 text-xs font-medium text-red-500">{error}</p>
      )}
    </div>
  );
};

export default CouponInput;
