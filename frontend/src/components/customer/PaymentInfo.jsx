import React from "react";
import { FiCreditCard, FiShield, FiTruck } from "react-icons/fi";

const PaymentInfo = ({
  codAvailable = true,
  onlinePaymentAvailable = true,
}) => {
  return (
    <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5">
      <h2 className="mb-4 text-lg font-bold text-[var(--text-primary)]">
        Payment Options
      </h2>

      <div className="space-y-3">
        {codAvailable && (
          <div className="flex items-center gap-3 rounded-xl bg-[var(--bg-primary)] p-3">
            <FiTruck className="text-orange-500" size={20} />

            <div>
              <p className="text-sm font-semibold text-[var(--text-primary)]">
                Cash on Delivery
              </p>

              <p className="text-xs text-[var(--text-secondary)]">
                Pay when your order arrives
              </p>
            </div>
          </div>
        )}

        {onlinePaymentAvailable && (
          <div className="flex items-center gap-3 rounded-xl bg-[var(--bg-primary)] p-3">
            <FiCreditCard className="text-blue-500" size={20} />

            <div>
              <p className="text-sm font-semibold text-[var(--text-primary)]">
                Online Payment
              </p>

              <p className="text-xs text-[var(--text-secondary)]">
                Secure payment options
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 rounded-xl bg-[var(--bg-primary)] p-3">
          <FiShield className="text-green-500" size={20} />

          <div>
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              Secure Checkout
            </p>

            <p className="text-xs text-[var(--text-secondary)]">
              Your payment information is protected
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentInfo;
