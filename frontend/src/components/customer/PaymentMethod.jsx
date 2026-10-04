import { FiCheckCircle, FiCreditCard, FiTruck } from "react-icons/fi";

const PaymentMethod = ({
  value = "COD",
  onChange,
  disabled = false,
  className = "",
}) => {
  const methods = [
    {
      value: "COD",
      label: "Cash on Delivery",
      description: "Pay when your order is delivered.",
      icon: FiTruck,
      available: true,
    },
    {
      value: "RAZORPAY",
      label: "Online Payment",
      description: "Pay securely using Razorpay.",
      icon: FiCreditCard,
      available: false,
    },
  ];

  return (
    <section
      className={`rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5 sm:p-6 ${className}`}
    >
      <h2 className="text-lg font-bold text-[var(--text-primary)]">
        Payment Method
      </h2>

      <p className="mt-1 text-xs text-[var(--text-muted)]">
        Choose how you want to pay.
      </p>

      <div className="mt-5 space-y-3">
        {methods.map((method) => {
          const Icon = method.icon;
          const selected = value === method.value;

          return (
            <button
              key={method.value}
              type="button"
              onClick={() => method.available && onChange?.(method.value)}
              disabled={disabled || !method.available}
              className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition ${
                selected
                  ? "border-orange-500 bg-orange-50 dark:bg-orange-500/10"
                  : "border-[var(--border-color)] bg-[var(--bg-card)] hover:border-orange-300"
              } ${!method.available ? "cursor-not-allowed opacity-50" : ""}`}
            >
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                  selected
                    ? "bg-orange-500 text-white"
                    : "bg-[var(--bg-primary)] text-[var(--text-secondary)]"
                }`}
              >
                <Icon size={20} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-[var(--text-primary)]">
                    {method.label}
                  </p>

                  {!method.available && (
                    <span className="rounded-full bg-[var(--bg-primary)] px-2 py-0.5 text-[10px] font-semibold text-[var(--text-muted)]">
                      Coming Soon
                    </span>
                  )}
                </div>

                <p className="mt-1 text-xs text-[var(--text-secondary)]">
                  {method.description}
                </p>
              </div>

              {selected && (
                <FiCheckCircle size={21} className="shrink-0 text-orange-500" />
              )}
            </button>
          );
        })}
      </div>

      {value === "COD" && (
        <div className="mt-4 rounded-xl bg-green-50 p-3 text-xs text-green-700 dark:bg-green-500/10 dark:text-green-400">
          Cash on Delivery is currently available for your order.
        </div>
      )}
    </section>
  );
};

export default PaymentMethod;
