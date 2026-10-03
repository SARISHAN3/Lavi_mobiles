import { FiAlertCircle, FiRefreshCw, FiX } from "react-icons/fi";

const ErrorMessage = ({
  message = "Something went wrong. Please try again.",
  onRetry,
  onClose,
  fullScreen = false,
}) => {
  const content = (
    <div className="flex w-full items-center justify-center px-4 py-8">
      <div className="w-full max-w-md rounded-xl border border-red-200 bg-red-50 p-5 dark:border-red-500/20 dark:bg-red-500/10">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 shrink-0 text-red-500">
            <FiAlertCircle size={22} />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold text-red-700 dark:text-red-400">
              Something went wrong
            </h3>

            <p className="mt-1 text-sm leading-5 text-red-600 dark:text-red-300">
              {message}
            </p>

            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-600"
              >
                <FiRefreshCw size={14} />
                Try Again
              </button>
            )}
          </div>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close error"
              className="shrink-0 text-red-400 transition hover:text-red-600 dark:hover:text-red-300"
            >
              <FiX size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[var(--bg-primary)]">
        {content}
      </div>
    );
  }

  return content;
};

export default ErrorMessage;
