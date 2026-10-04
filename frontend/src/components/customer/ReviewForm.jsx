import { useState } from "react";
import { FiSend } from "react-icons/fi";
import RatingStars from "./RatingStars";

const ReviewForm = ({
  onSubmit,
  loading = false,
  initialRating = 0,
  initialTitle = "",
  initialComment = "",
  submitText = "Submit Review",
  cancelText = "Cancel",
  onCancel,
  className = "",
}) => {
  const [rating, setRating] = useState(initialRating);
  const [title, setTitle] = useState(initialTitle);
  const [comment, setComment] = useState(initialComment);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (rating < 1 || rating > 5) {
      setError("Please select a rating.");
      return;
    }

    if (!comment.trim()) {
      setError("Please write your review.");
      return;
    }

    try {
      if (onSubmit) {
        await onSubmit({
          rating,
          title: title.trim(),
          comment: comment.trim(),
        });
      }
    } catch (submitError) {
      setError(submitError?.message || "Unable to submit your review.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5 ${className}`}
    >
      <h3 className="text-base font-bold text-[var(--text-primary)]">
        Write a Review
      </h3>

      <div className="mt-4">
        <p className="mb-2 text-sm font-semibold text-[var(--text-primary)]">
          Your Rating
        </p>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                aria-label={`Rate ${star} out of 5`}
                className="transition hover:scale-110"
              >
                <span
                  className={`text-2xl ${
                    star <= rating
                      ? "text-yellow-400"
                      : "text-gray-300 dark:text-gray-600"
                  }`}
                >
                  ★
                </span>
              </button>
            ))}
          </div>

          {rating > 0 && (
            <span className="text-xs font-semibold text-[var(--text-secondary)]">
              {rating}/5
            </span>
          )}
        </div>
      </div>

      <div className="mt-4">
        <label
          htmlFor="review-title"
          className="mb-2 block text-sm font-semibold text-[var(--text-primary)]"
        >
          Review Title
          <span className="ml-1 font-normal text-[var(--text-muted)]">
            (optional)
          </span>
        </label>

        <input
          id="review-title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          maxLength={100}
          placeholder="Give your review a title"
          className="lavi-input w-full"
        />
      </div>

      <div className="mt-4">
        <label
          htmlFor="review-comment"
          className="mb-2 block text-sm font-semibold text-[var(--text-primary)]"
        >
          Your Review
        </label>

        <textarea
          id="review-comment"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          rows={5}
          maxLength={1000}
          placeholder="Tell us about your experience with this product..."
          className="lavi-input min-h-[120px] w-full resize-y"
        />

        <div className="mt-1 text-right text-[11px] text-[var(--text-muted)]">
          {comment.length}/1000
        </div>
      </div>

      {error && (
        <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600 dark:bg-red-500/10 dark:text-red-400">
          {error}
        </p>
      )}

      <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg border border-[var(--border-color)] px-4 py-2.5 text-sm font-semibold text-[var(--text-secondary)] transition hover:bg-[var(--bg-primary)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {cancelText}
          </button>
        )}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <FiSend size={15} />
          {loading ? "Submitting..." : submitText}
        </button>
      </div>
    </form>
  );
};

export default ReviewForm;
