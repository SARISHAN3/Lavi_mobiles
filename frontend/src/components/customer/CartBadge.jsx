import { FiShoppingCart } from "react-icons/fi";
import { useCart } from "../../context/CartContext";

const CartBadge = ({ showIcon = true, showLabel = false, className = "" }) => {
  const { cartItemCount } = useCart();

  return (
    <div
      className={`relative inline-flex items-center gap-2 text-[var(--text-secondary)] ${className}`}
    >
      {showIcon && <FiShoppingCart size={20} aria-hidden="true" />}

      {showLabel && <span className="text-sm font-medium">Cart</span>}

      {cartItemCount > 0 && (
        <span
          aria-label={`${cartItemCount} items in cart`}
          className={`absolute flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-bold leading-none text-white ${
            showLabel ? "-right-3 -top-2" : "-right-2 -top-2"
          }`}
        >
          {cartItemCount > 99 ? "99+" : cartItemCount}
        </span>
      )}
    </div>
  );
};

export default CartBadge;
