import { FiStar } from "react-icons/fi";

const RatingStars = ({
  rating = 0,
  size = 16,
  showValue = false,
  reviewCount = 0,
}) => {
  const numericRating = Math.max(0, Math.min(5, Number(rating) || 0));

  const roundedRating = Math.round(numericRating);

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <FiStar
            key={star}
            size={size}
            className={
              star <= roundedRating
                ? "text-amber-400"
                : "text-gray-300 dark:text-gray-600"
            }
            fill={star <= roundedRating ? "currentColor" : "none"}
          />
        ))}
      </div>

      {showValue && (
        <span className="text-sm font-semibold text-[var(--text-primary)]">
          {numericRating.toFixed(1)}
        </span>
      )}

      {reviewCount > 0 && (
        <span className="text-xs text-[var(--text-muted)]">
          ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
        </span>
      )}
    </div>
  );
};

export default RatingStars;
