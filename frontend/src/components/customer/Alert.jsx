import React from "react";
import { FiAlertCircle, FiCheckCircle, FiInfo, FiX } from "react-icons/fi";

const Alert = ({ type = "info", title, message, onClose }) => {
  const styles = {
    success: {
      wrapper:
        "border-green-200 bg-green-50 text-green-800 dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-400",
      icon: FiCheckCircle,
    },
    error: {
      wrapper:
        "border-red-200 bg-red-50 text-red-800 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400",
      icon: FiAlertCircle,
    },
    warning: {
      wrapper:
        "border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-500/20 dark:bg-yellow-500/10 dark:text-yellow-400",
      icon: FiAlertCircle,
    },
    info: {
      wrapper:
        "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400",
      icon: FiInfo,
    },
  };

  const config = styles[type] || styles.info;
  const Icon = config.icon;

  return (
    <div
      className={`flex items-start gap-3 rounded-xl border p-4 ${config.wrapper}`}
      role="alert"
    >
      <Icon className="mt-0.5 flex-shrink-0" size={20} />

      <div className="flex-1">
        {title && <h3 className="font-semibold">{title}</h3>}

        {message && <p className="mt-1 text-sm leading-5">{message}</p>}
      </div>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="rounded-md p-1 transition hover:bg-black/5 dark:hover:bg-white/5"
          aria-label="Close alert"
        >
          <FiX size={17} />
        </button>
      )}
    </div>
  );
};

export default Alert;
