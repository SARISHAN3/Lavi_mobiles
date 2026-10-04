import React from "react";
import { FiAlertCircle, FiCheckCircle, FiInfo, FiX } from "react-icons/fi";

const Toast = ({ type = "success", message, onClose }) => {
  const config = {
    success: {
      icon: FiCheckCircle,
      color: "text-green-500",
    },
    error: {
      icon: FiAlertCircle,
      color: "text-red-500",
    },
    warning: {
      icon: FiAlertCircle,
      color: "text-yellow-500",
    },
    info: {
      icon: FiInfo,
      color: "text-blue-500",
    },
  };

  const current = config[type] || config.success;
  const Icon = current.icon;

  return (
    <div className="flex w-full max-w-sm items-center gap-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4 shadow-xl">
      <Icon size={21} className={`flex-shrink-0 ${current.color}`} />

      <p className="flex-1 text-sm font-medium text-[var(--text-primary)]">
        {message}
      </p>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        >
          <FiX size={18} />
        </button>
      )}
    </div>
  );
};

export default Toast;
