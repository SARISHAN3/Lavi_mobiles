import { FiQuote, FiUser } from "react-icons/fi";
import RatingStars from "./RatingStars";

const TestimonialCard = ({ testimonial, className = "" }) => {
  if (!testimonial) {
    return null;
  }

  const name = testimonial.name || testimonial.user?.name || "Happy Customer";

  const role =
    testimonial.role || testimonial.designation || "Lavi Mobile Customer";

  const message =
    testimonial.message || testimonial.comment || testimonial.review || "";

  const rating = Number(testimonial.rating) || 5;

  const image =
    testimonial.image ||
    testimonial.profileImage ||
    testimonial.user?.profileImage ||
    "";

  return (
    <article
      className={`relative rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5 sm:p-6 ${className}`}
    >
      <div className="absolute right-5 top-5 text-orange-100 dark:text-orange-500/10">
        <FiQuote size={38} />
      </div>

      <div className="relative z-10">
        <RatingStars rating={rating} size="sm" />

        {message && (
          <p className="mt-4 text-sm leading-6 text-[var(--text-secondary)]">
            “{message}”
          </p>
        )}

        <div className="mt-5 flex items-center gap-3 border-t border-[var(--border-color)] pt-4">
          {image ? (
            <img
              src={image}
              alt={name}
              className="h-11 w-11 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
              <FiUser size={19} />
            </div>
          )}

          <div className="min-w-0">
            <h3 className="truncate text-sm font-bold text-[var(--text-primary)]">
              {name}
            </h3>

            <p className="mt-0.5 truncate text-xs text-[var(--text-muted)]">
              {role}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
};

export default TestimonialCard;
