import { FiUser } from "react-icons/fi";
import { getImageUrl } from "../../config/image";

const UserAvatar = ({
  user,
  size = "md",
  showName = false,
  className = "",
}) => {
  const sizes = {
    sm: {
      wrapper: "h-8 w-8",
      icon: 15,
      text: "text-xs",
    },
    md: {
      wrapper: "h-10 w-10",
      icon: 18,
      text: "text-sm",
    },
    lg: {
      wrapper: "h-14 w-14",
      icon: 24,
      text: "text-base",
    },
    xl: {
      wrapper: "h-20 w-20",
      icon: 32,
      text: "text-lg",
    },
  };

  const selectedSize = sizes[size] || sizes.md;

  const name = user?.name || user?.username || "User";

  const image = user?.profileImage || user?.image || "";

  const imageUrl = image ? getImageUrl(image) : "";

  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={name}
          className={`${selectedSize.wrapper} shrink-0 rounded-full border border-[var(--border-color)] object-cover`}
        />
      ) : (
        <div
          className={`flex ${selectedSize.wrapper} shrink-0 items-center justify-center rounded-full bg-orange-100 font-bold text-orange-600 dark:bg-orange-500/10 dark:text-orange-400`}
          aria-label={name}
        >
          {initials ? (
            <span className={selectedSize.text}>{initials}</span>
          ) : (
            <FiUser size={selectedSize.icon} />
          )}
        </div>
      )}

      {showName && (
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[var(--text-primary)]">
            {name}
          </p>

          {user?.email && (
            <p className="truncate text-xs text-[var(--text-muted)]">
              {user.email}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default UserAvatar;
