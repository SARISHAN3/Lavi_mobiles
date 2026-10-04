import { Link } from "react-router-dom";
import { FiLogIn, FiUserPlus, FiX } from "react-icons/fi";

const LoginPrompt = ({
  title = "Login required",
  message = "Please login to continue with this action.",
  onClose,
}) => {
  return (
    <div className="rounded-xl border border-orange-200 bg-orange-50 p-5 dark:border-orange-500/20 dark:bg-orange-500/10">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
          <FiLogIn size={20} />
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold text-[var(--text-primary)]">
            {title}
          </h3>

          <p className="mt-1 text-sm leading-5 text-[var(--text-secondary)]">
            {message}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              <FiLogIn size={15} />
              Login
            </Link>

            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] px-4 py-2 text-sm font-semibold text-[var(--text-primary)] transition hover:border-orange-500 hover:text-orange-500"
            >
              <FiUserPlus size={15} />
              Create Account
            </Link>
          </div>
        </div>

        {/* Close */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[var(--text-secondary)] transition hover:bg-[var(--bg-card)] hover:text-red-500"
          >
            <FiX size={17} />
          </button>
        )}
      </div>
    </div>
  );
};

export default LoginPrompt;
