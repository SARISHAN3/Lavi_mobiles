import { Link, useLocation } from "react-router-dom";
import {
  FiHome,
  FiSmartphone,
  FiTag,
  FiHeart,
  FiShoppingCart,
  FiUser,
  FiX,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import ThemeToggle from "./ThemeToggle";

const MobileMenu = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { isAuthenticated, user, isAdmin } = useAuth();
  const { cartItemCount } = useCart();
  const { wishlistCount } = useWishlist();

  if (!isOpen) {
    return null;
  }

  const isActive = (path) => {
    if (path === "/home") {
      return location.pathname === "/" || location.pathname === "/home";
    }

    return location.pathname.startsWith(path);
  };

  const menuItems = [
    {
      label: "Home",
      path: "/home",
      icon: FiHome,
    },
    {
      label: "Mobile Phones",
      path: "/mobiles",
      icon: FiSmartphone,
    },
    {
      label: "Brands",
      path: "/mobiles?view=brands",
      icon: FiTag,
    },
    {
      label: "Deals",
      path: "/mobiles?sort=deals",
      icon: FiTag,
    },
  ];

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <aside className="fixed right-0 top-0 z-50 flex h-full w-[min(88vw,360px)] flex-col border-l border-[var(--border-color)] bg-[var(--bg-secondary)] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[var(--border-color)] px-5 py-4">
          <div>
            <h2 className="text-lg font-bold text-[var(--text-primary)]">
              Menu
            </h2>

            <p className="mt-0.5 text-xs text-[var(--text-muted)]">
              Explore Lavi Mobile
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--text-secondary)] transition hover:bg-[var(--bg-primary)] hover:text-orange-500"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-5">
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path.split("?")[0]);

              return (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={onClose}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    active
                      ? "bg-orange-500 text-white"
                      : "text-[var(--text-secondary)] hover:bg-[var(--bg-primary)] hover:text-orange-500"
                  }`}
                >
                  <Icon size={19} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="my-5 h-px bg-[var(--border-color)]" />

          <div className="space-y-1">
            <Link
              to="/wishlist"
              onClick={onClose}
              className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-[var(--text-secondary)] transition hover:bg-[var(--bg-primary)] hover:text-orange-500"
            >
              <span className="flex items-center gap-3">
                <FiHeart size={19} />
                Wishlist
              </span>

              {wishlistCount > 0 && (
                <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-orange-500 px-1.5 text-xs font-bold text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              to="/cart"
              onClick={onClose}
              className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-[var(--text-secondary)] transition hover:bg-[var(--bg-primary)] hover:text-orange-500"
            >
              <span className="flex items-center gap-3">
                <FiShoppingCart size={19} />
                Cart
              </span>

              {cartItemCount > 0 && (
                <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-orange-500 px-1.5 text-xs font-bold text-white">
                  {cartItemCount}
                </span>
              )}
            </Link>

            <Link
              to={isAuthenticated ? "/profile" : "/login"}
              onClick={onClose}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[var(--text-secondary)] transition hover:bg-[var(--bg-primary)] hover:text-orange-500"
            >
              <FiUser size={19} />

              <span>
                {isAuthenticated
                  ? user?.name || "My Profile"
                  : "Login / Register"}
              </span>
            </Link>

            {isAuthenticated && (
              <Link
                to="/orders"
                onClick={onClose}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[var(--text-secondary)] transition hover:bg-[var(--bg-primary)] hover:text-orange-500"
              >
                <FiShoppingCart size={19} />
                My Orders
              </Link>
            )}

            {isAuthenticated && isAdmin && (
              <Link
                to="/admin"
                onClick={onClose}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[var(--text-secondary)] transition hover:bg-[var(--bg-primary)] hover:text-orange-500"
              >
                <FiUser size={19} />
                Admin Panel
              </Link>
            )}
          </div>

          <div className="my-5 h-px bg-[var(--border-color)]" />

          <div className="flex items-center justify-between rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-[var(--text-primary)]">
                Appearance
              </p>

              <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                Change theme
              </p>
            </div>

            <ThemeToggle />
          </div>
        </div>

        <div className="border-t border-[var(--border-color)] px-5 py-4">
          <p className="text-center text-xs text-[var(--text-muted)]">
            © {new Date().getFullYear()} Lavi Mobile
          </p>
        </div>
      </aside>
    </>
  );
};

export default MobileMenu;
