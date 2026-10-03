import {
  FiAlertTriangle,
  FiCheckCircle,
  FiInfo,
  FiTrash2,
  FiX,
} from "react-icons/fi";
import Modal from "./Modal";

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "Please confirm that you want to continue.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "orange",
  loading = false,
}) => {
  const variants = {
    orange: {
      icon: FiInfo,
      iconClass:
        "bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400",
      buttonClass: "bg-orange-500 hover:bg-orange-600 text-white",
    },

    danger: {
      icon: FiTrash2,
      iconClass: "bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400",
      buttonClass: "bg-red-500 hover:bg-red-600 text-white",
    },

    warning: {
      icon: FiAlertTriangle,
      iconClass:
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400",
      buttonClass: "bg-yellow-500 hover:bg-yellow-600 text-white",
    },

    success: {
      icon: FiCheckCircle,
      iconClass:
        "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400",
      buttonClass: "bg-green-500 hover:bg-green-600 text-white",
    },
  };

  const selectedVariant = variants[variant] || variants.orange;
  const Icon = selectedVariant.icon;

  const handleConfirm = async () => {
    if (loading) {
      return;
    }

    await onConfirm?.();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={loading ? undefined : onClose}
      title={title}
      size="sm"
    >
      <div className="text-center">
        {/* Icon */}
        <div
          className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${selectedVariant.iconClass}`}
        >
          <Icon size={26} />
        </div>

        {/* Message */}
        <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-[var(--text-secondary)]">
          {message}
        </p>

        {/* Buttons */}
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] px-5 py-2.5 text-sm font-semibold text-[var(--text-primary)] transition hover:bg-[var(--bg-primary)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiX size={16} />
            {cancelText}
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${selectedVariant.buttonClass}`}
          >
            {loading && (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            )}

            {!loading && <span>{confirmText}</span>}

            {loading && <span>Processing...</span>}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
