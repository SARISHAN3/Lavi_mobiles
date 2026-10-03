import { FiMinus, FiPlus } from "react-icons/fi";

const QuantitySelector = ({
  quantity = 1,
  onIncrease,
  onDecrease,
  onChange,
  min = 1,
  max = 99,
  disabled = false,
  size = "md",
}) => {
  const sizes = {
    sm: {
      button: "h-8 w-8",
      input: "h-8 w-10 text-xs",
      icon: 14,
    },
    md: {
      button: "h-10 w-10",
      input: "h-10 w-12 text-sm",
      icon: 16,
    },
    lg: {
      button: "h-11 w-11",
      input: "h-11 w-14 text-base",
      icon: 18,
    },
  };

  const currentSize = sizes[size] || sizes.md;

  const decrease = () => {
    if (disabled || quantity <= min) {
      return;
    }

    if (onDecrease) {
      onDecrease(quantity - 1);
      return;
    }

    onChange?.(quantity - 1);
  };

  const increase = () => {
    if (disabled || quantity >= max) {
      return;
    }

    if (onIncrease) {
      onIncrease(quantity + 1);
      return;
    }

    onChange?.(quantity + 1);
  };

  const handleInputChange = (event) => {
    const value = event.target.value;

    if (value === "") {
      onChange?.("");
      return;
    }

    const numericValue = Number(value);

    if (Number.isNaN(numericValue)) {
      return;
    }

    const nextValue = Math.min(Math.max(numericValue, min), max);

    onChange?.(nextValue);
  };

  const handleBlur = () => {
    if (quantity === "" || quantity < min) {
      onChange?.(min);
      return;
    }

    if (quantity > max) {
      onChange?.(max);
    }
  };

  return (
    <div
      className={`inline-flex items-center overflow-hidden rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] ${
        disabled ? "opacity-60" : ""
      }`}
    >
      <button
        type="button"
        onClick={decrease}
        disabled={disabled || quantity <= min}
        aria-label="Decrease quantity"
        className={`${currentSize.button} flex items-center justify-center text-[var(--text-secondary)] transition hover:bg-[var(--bg-primary)] hover:text-orange-500 disabled:cursor-not-allowed disabled:opacity-40`}
      >
        <FiMinus size={currentSize.icon} />
      </button>

      <input
        type="number"
        min={min}
        max={max}
        value={quantity}
        onChange={handleInputChange}
        onBlur={handleBlur}
        disabled={disabled}
        aria-label="Quantity"
        className={`${currentSize.input} appearance-none border-x border-[var(--border-color)] bg-transparent text-center font-semibold text-[var(--text-primary)] outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
      />

      <button
        type="button"
        onClick={increase}
        disabled={disabled || quantity >= max}
        aria-label="Increase quantity"
        className={`${currentSize.button} flex items-center justify-center text-[var(--text-secondary)] transition hover:bg-[var(--bg-primary)] hover:text-orange-500 disabled:cursor-not-allowed disabled:opacity-40`}
      >
        <FiPlus size={currentSize.icon} />
      </button>
    </div>
  );
};

export default QuantitySelector;
