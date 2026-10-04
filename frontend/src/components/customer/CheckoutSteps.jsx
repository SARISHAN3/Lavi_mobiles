import { FiCheck, FiMapPin, FiCreditCard, FiShoppingBag } from "react-icons/fi";

const CheckoutSteps = ({ currentStep = 1, className = "" }) => {
  const steps = [
    {
      number: 1,
      label: "Address",
      icon: FiMapPin,
    },
    {
      number: 2,
      label: "Payment",
      icon: FiCreditCard,
    },
    {
      number: 3,
      label: "Review",
      icon: FiShoppingBag,
    },
  ];

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center">
        {steps.map((step, index) => {
          const Icon = step.icon;

          const completed = currentStep > step.number;

          const active = currentStep === step.number;

          return (
            <div key={step.number} className="flex min-w-0 flex-1 items-center">
              <div className="flex min-w-0 flex-col items-center">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition ${
                    completed || active
                      ? "border-orange-500 bg-orange-500 text-white"
                      : "border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-muted)]"
                  }`}
                >
                  {completed ? <FiCheck size={17} /> : <Icon size={17} />}
                </div>

                <span
                  className={`mt-2 text-[11px] font-semibold sm:text-xs ${
                    active || completed
                      ? "text-orange-500"
                      : "text-[var(--text-muted)]"
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {index < steps.length - 1 && (
                <div
                  className={`mx-2 mb-5 h-0.5 flex-1 sm:mx-4 ${
                    currentStep > step.number
                      ? "bg-orange-500"
                      : "bg-[var(--border-color)]"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CheckoutSteps;
