const PriceDisplay = ({
  price = 0,
  mrp = 0,
  discount = 0,
  size = "md",
  showSavings = true,
}) => {
  const currentPrice = Number(price || 0);
  const originalPrice = Number(mrp || 0);

  const calculatedDiscount =
    originalPrice > currentPrice && currentPrice > 0
      ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
      : 0;

  const discountPercentage = Number(discount || 0) || calculatedDiscount;

  const savings =
    originalPrice > currentPrice ? originalPrice - currentPrice : 0;

  const sizeClasses = {
    sm: {
      price: "text-base",
      mrp: "text-xs",
      discount: "text-[10px]",
      savings: "text-[10px]",
    },
    md: {
      price: "text-xl",
      mrp: "text-sm",
      discount: "text-xs",
      savings: "text-xs",
    },
    lg: {
      price: "text-2xl sm:text-3xl",
      mrp: "text-sm sm:text-base",
      discount: "text-xs sm:text-sm",
      savings: "text-xs sm:text-sm",
    },
  };

  const classes = sizeClasses[size] || sizeClasses.md;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`font-bold text-[var(--text-primary)] ${classes.price}`}
        >
          ₹{currentPrice.toLocaleString("en-IN")}
        </span>

        {originalPrice > currentPrice && (
          <span
            className={`text-[var(--text-muted)] line-through ${classes.mrp}`}
          >
            ₹{originalPrice.toLocaleString("en-IN")}
          </span>
        )}

        {discountPercentage > 0 && (
          <span
            className={`font-semibold text-green-600 dark:text-green-400 ${classes.discount}`}
          >
            {discountPercentage}% OFF
          </span>
        )}
      </div>

      {showSavings && savings > 0 && (
        <p
          className={`mt-1 font-medium text-green-600 dark:text-green-400 ${classes.savings}`}
        >
          Save ₹{savings.toLocaleString("en-IN")}
        </p>
      )}
    </div>
  );
};

export default PriceDisplay;
