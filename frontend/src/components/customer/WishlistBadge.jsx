import { FiHeart } from "react-icons/fi";
import { useWishlist } from "../../context/WishlistContext";

const WishlistBadge = ({
  showIcon = true,
  showLabel = false,
  className = "",
}) => {
  const { wishlistCount } = useWishlist();

  return (
    <div
      className={`relative inline-flex items-center gap-2 text-[var(--text-secondary)] ${className}`}
    >
      {showIcon && <FiHeart size={20} aria-hidden="true" />}

      {showLabel && <span className="text-sm font-medium">Wishlist</span>}

      {wishlistCount > 0 && (
        <span
          aria-label={`${wishlistCount} items in wishlist`}
          className={`absolute flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-bold leading-none text-white ${
            showLabel ? "-right-3 -top-2" : "-right-2 -top-2"
          }`}
        >
          {wishlistCount > 99 ? "99+" : wishlistCount}
        </span>
      )}
    </div>
  );
};

export default WishlistBadge;
