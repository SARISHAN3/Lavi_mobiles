const LoadingSpinner = ({ size = "md", text = "", fullScreen = false }) => {
  const sizeClasses = {
    sm: "h-5 w-5 border-2",
    md: "h-8 w-8 border-4",
    lg: "h-12 w-12 border-4",
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center">
      <div
        className={`animate-spin rounded-full border-[var(--border-color)] border-t-orange-500 ${sizeClasses[size] || sizeClasses.md}`}
      />

      {text && (
        <p className="mt-3 text-sm text-[var(--text-secondary)]">{text}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[var(--bg-primary)]">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;
