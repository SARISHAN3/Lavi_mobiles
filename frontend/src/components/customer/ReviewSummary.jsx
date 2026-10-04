import RatingStars from "./RatingStars";

const ReviewSummary = ({
  summary,
  rating = 0,
  reviewCount = 0,
  className = "",
}) => {
  const averageRating =
    Number(summary?.averageRating ?? summary?.rating ?? rating) || 0;

  const totalReviews =
    Number(summary?.totalReviews ?? summary?.reviewCount ?? reviewCount) || 0;

  const ratingCounts = {
    5: Number(summary?.ratingCounts?.[5] ?? summary?.fiveStar ?? 0),
    4: Number(summary?.ratingCounts?.[4] ?? summary?.fourStar ?? 0),
    3: Number(summary?.ratingCounts?.[3] ?? summary?.threeStar ?? 0),
    2: Number(summary?.ratingCounts?.[2] ?? summary?.twoStar ?? 0),
    1: Number(summary?.ratingCounts?.[1] ?? summary?.oneStar ?? 0),
  };

  const getPercentage = (count) => {
    if (totalReviews === 0) {
      return 0;
    }

    return Math.min(100, Math.round((count / totalReviews) * 100));
  };

  return (
    <div
      className={`rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5 ${className}`}
    >
      <div className="grid gap-6 sm:grid-cols-[180px_1fr] sm:items-center">
        <div className="text-center sm:border-r sm:border-[var(--border-color)] sm:pr-6">
          <p className="text-4xl font-extrabold text-[var(--text-primary)]">
            {averageRating.toFixed(1)}
          </p>

          <div className="mt-2 flex justify-center">
            <RatingStars rating={averageRating} size="md" />
          </div>

          <p className="mt-2 text-xs text-[var(--text-secondary)]">
            Based on {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
          </p>
        </div>

        <div className="space-y-2.5">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = ratingCounts[star];
            const percentage = getPercentage(count);

            return (
              <div key={star} className="flex items-center gap-2">
                <span className="w-8 text-xs font-semibold text-[var(--text-secondary)]">
                  {star}★
                </span>

                <div className="h-2 flex-1 overflow-hidden rounded-full bg-[var(--bg-primary)]">
                  <div
                    className="h-full rounded-full bg-orange-400 transition-all duration-500"
                    style={{
                      width: `${percentage}%`,
                    }}
                  />
                </div>

                <span className="w-8 text-right text-[11px] text-[var(--text-muted)]">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ReviewSummary;
