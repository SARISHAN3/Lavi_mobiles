const DiscountBadge = ({ discount = 0, text, size = "md", className = "" }) => {
  const discountValue = Number(discount) || 0;

  if (discountValue <= 0 && !text) {
    return null;
  }

  const sizes = {
    sm: "px-1.5 py-0.5 text-[10px]",
    md: "px-2 py-1 text-xs",
    lg: "px-3 py-1.5 text-sm",
  };

  const displayText = text || `${Math.round(discountValue)}% OFF`;

  return (
    <span
      className={`inline-flex items-center justify-center rounded-md bg-red-500 font-bold text-white ${
        sizes[size] || sizes.md
      } ${className}`}
    >
      {displayText}
    </span>
  );
};

export default DiscountBadge;
