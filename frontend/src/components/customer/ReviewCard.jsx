import { FiCheckCircle, FiUser } from "react-icons/fi";
import RatingStars from "./RatingStars";

const ReviewCard = ({ review, showProduct = false, className = "" }) => {
  if (!review) {
    return null;
  }

  const user = review.user || review.customer || {};

  const userName = user.name || review.userName || "Customer";

  const userImage = user.profileImage || review.userImage || "";

  const rating = Number(review.rating) || 0;

  const title = review.title || "Customer Review";

  const comment = review.comment || review.review || "";

  const product = review.product || null;

  const createdDate = review.createdAt
    ? new Date(review.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";

  return (
    <article
      className={`rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4 sm:p-5 ${className}`}
    >
      <div className="flex items-start gap-3">
        {userImage ? (
          <img
            src={userImage}
            alt={userName}
            className="h-10 w-10 shrink-0 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
            <FiUser size={18} />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-sm font-bold text-[var(--text-primary)]">
                {userName}
              </h3>

              {createdDate && (
                <p className="mt-0.5 text-[11px] text-[var(--text-muted)]">
                  {createdDate}
                </p>
              )}
            </div>

            <RatingStars rating={rating} size="sm" />
          </div>
        </div>
      </div>

      {showProduct && product && (
        <div className="mt-3 rounded-lg bg-[var(--bg-primary)] px-3 py-2">
          <p className="text-xs font-semibold text-[var(--text-secondary)]">
            Product
          </p>

          <p className="mt-0.5 line-clamp-1 text-xs font-bold text-[var(--text-primary)]">
            {product.name || "Product"}
          </p>
        </div>
      )}

      <div className="mt-4">
        {title && (
          <h4 className="text-sm font-bold text-[var(--text-primary)]">
            {title}
          </h4>
        )}

        {comment && (
          <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
            {comment}
          </p>
        )}
      </div>

      {review.isVerifiedPurchase && (
        <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-green-600 dark:text-green-400">
          <FiCheckCircle size={14} />
          Verified Purchase
        </div>
      )}
    </article>
  );
};

export default ReviewCard;
