import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

const AuthForm = ({
  title,
  subtitle,
  submitText = "Submit",
  loading = false,
  error = "",
  onSubmit,
  children,
  footer,
  className = "",
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit?.(event);
  };

  return (
    <div
      className={`w-full rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 shadow-sm sm:p-8 ${className}`}
    >
      {(title || subtitle) && (
        <div className="mb-6 text-center">
          {title && (
            <h1 className="text-2xl font-extrabold text-[var(--text-primary)]">
              {title}
            </h1>
          )}

          {subtitle && (
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {children}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 flex h-12 w-full items-center justify-center rounded-xl bg-orange-500 px-5 text-sm font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Please wait..." : submitText}
        </button>
      </form>

      {footer && (
        <div className="mt-5 border-t border-[var(--border-color)] pt-5 text-center">
          {footer}
        </div>
      )}
    </div>
  );
};

export const AuthInput = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder = "",
  required = false,
  disabled = false,
  error = "",
  autoComplete,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";

  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-[var(--text-primary)]">
        {label}

        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <div className="relative">
        <input
          type={inputType}
          value={value || ""}
          onChange={(event) => onChange?.(event.target.value)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          autoComplete={autoComplete}
          className={`h-11 w-full rounded-xl border bg-[var(--bg-primary)] px-3 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] disabled:cursor-not-allowed disabled:opacity-60 ${
            isPassword ? "pr-11" : ""
          } ${
            error
              ? "border-red-500"
              : "border-[var(--border-color)] focus:border-orange-500"
          }`}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            className="absolute right-0 top-0 flex h-11 w-11 items-center justify-center text-[var(--text-muted)] hover:text-orange-500"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>
        )}
      </div>

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default AuthForm;
