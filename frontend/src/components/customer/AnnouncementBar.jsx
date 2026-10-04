import { FiChevronRight, FiX, FiZap } from "react-icons/fi";
import { useState } from "react";

const AnnouncementBar = ({
  message = "Special offers available on selected smartphones",
  actionText = "Shop Now",
  actionHref = "/mobiles",
  dismissible = true,
  icon: Icon = FiZap,
}) => {
  const [visible, setVisible] = useState(true);

  if (!visible) {
    return null;
  }

  return (
    <div className="relative bg-orange-500 text-white">
      <div className="mx-auto flex min-h-10 max-w-7xl items-center justify-center gap-2 px-4 py-2 sm:px-6 lg:px-8">
        <Icon size={16} className="hidden shrink-0 sm:block" />

        <p className="text-center text-xs font-medium sm:text-sm">{message}</p>

        {actionText && actionHref && (
          <a
            href={actionHref}
            className="inline-flex shrink-0 items-center gap-1 text-xs font-bold underline underline-offset-2 transition hover:text-orange-100 sm:text-sm"
          >
            {actionText}
            <FiChevronRight size={14} />
          </a>
        )}

        {dismissible && (
          <button
            type="button"
            onClick={() => setVisible(false)}
            aria-label="Dismiss announcement"
            className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full transition hover:bg-white/10 sm:right-5"
          >
            <FiX size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default AnnouncementBar;
