import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  FiMenu,
  FiX,
  FiSearch,
  FiShoppingCart,
  FiHeart,
  FiUser,
  FiSun,
  FiMoon,
  FiLogOut,
  FiUserCheck,
} from "react-icons/fi";

import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const navigate = useNavigate();

  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const { cartItemCount } = useCart();
  const { wishlistCount } = useWishlist();

  const handleSearch = (event) => {
    event.preventDefault();

    const search = searchValue.trim();

    if (!search) {
      navigate("/mobiles");
      return;
    }

    navigate(`/mobiles?search=${encodeURIComponent(search)}`);
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate("/home");
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${
      isActive
        ? "text-orange-500"
        : "text-[var(--text-secondary)] hover:text-orange-500"
    }`;

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[var(--border-color)] bg-[var(--bg-secondary)]/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link
            to="/home"
            onClick={closeMenu}
            className="flex shrink-0 items-center gap-2"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500 font-bold text-white">
              L
            </div>

            <div className="hidden sm:block">
              <h1 className="text-lg font-bold leading-none text-[var(--text-primary)]">
                Lavi
                <span className="text-orange-500"> Mobile</span>
              </h1>

              <p className="mt-1 text-[10px] text-[var(--text-muted)]">
                Smart Shopping
              </p>
            </div>
          </Link>

          {/* Desktop Search */}
          <form
            onSubmit={handleSearch}
            className="hidden min-w-0 flex-1 md:block"
          >
            <div className="relative mx-auto max-w-xl">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />

              <input
                type="search"
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Search mobile phones, brands..."
                className="h-10 w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] pl-11 pr-4 text-sm text-[var(--text-primary)] outline-none transition focus:border-orange-500"
              />
            </div>
          </form>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-5 lg:flex">
            <NavLink to="/home" className={navLinkClass}>
              Home
            </NavLink>

            <NavLink to="/mobiles" className={navLinkClass}>
              Mobile Phones
            </NavLink>

            <NavLink to="/brands" className={navLinkClass}>
              Brands
            </NavLink>

            <NavLink to="/deals" className={navLinkClass}>
              Deals
            </NavLink>
          </nav>

          {/* Actions */}
          <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
            {/* Wishlist */}
            <Link
              to="/wishlist"
              aria-label="Wishlist"
              className="relative flex h-9 w-9 items-center justify-center rounded-lg text-[var(--text-secondary)] transition hover:bg-[var(--bg-primary)] hover:text-orange-500"
            >
              <FiHeart size={19} />

              {wishlistCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-orange-500 px-1 text-[9px] font-bold text-white">
                  {wishlistCount > 99 ? "99+" : wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              aria-label="Cart"
              className="relative flex h-9 w-9 items-center justify-center rounded-lg text-[var(--text-secondary)] transition hover:bg-[var(--bg-primary)] hover:text-orange-500"
            >
              <FiShoppingCart size={19} />

              {cartItemCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-orange-500 px-1 text-[9px] font-bold text-white">
                  {cartItemCount > 99 ? "99+" : cartItemCount}
                </span>
              )}
            </Link>

            {/* Theme */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="hidden h-9 w-9 items-center justify-center rounded-lg text-[var(--text-secondary)] transition hover:bg-[var(--bg-primary)] hover:text-orange-500 sm:flex"
            >
              {isDarkMode ? <FiSun size={19} /> : <FiMoon size={19} />}
            </button>

            {/* Account */}
            {isAuthenticated ? (
              <div className="hidden items-center gap-2 xl:flex">
                <Link
                  to={isAdmin ? "/admin" : "/profile"}
                  className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition hover:bg-[var(--bg-primary)]"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400">
                    <FiUser size={17} />
                  </div>

                  <div className="max-w-28">
                    <p className="truncate text-xs font-semibold text-[var(--text-primary)]">
                      {user?.name || "Account"}
                    </p>

                    <p className="text-[10px] text-[var(--text-muted)]">
                      {isAdmin ? "Admin" : "My Account"}
                    </p>
                  </div>
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  aria-label="Logout"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--text-secondary)] transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
                >
                  <FiLogOut size={18} />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden items-center gap-2 rounded-lg bg-orange-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-orange-600 xl:flex"
              >
                <FiUserCheck size={16} />
                Login
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setIsMenuOpen((previous) => !previous)}
              aria-label="Toggle menu"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--text-secondary)] transition hover:bg-[var(--bg-primary)] hover:text-orange-500 lg:hidden"
            >
              {isMenuOpen ? <FiX size={21} /> : <FiMenu size={21} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="border-t border-[var(--border-color)] bg-[var(--bg-secondary)] lg:hidden">
            <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="mb-4">
                <div className="relative">
                  <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />

                  <input
                    type="search"
                    value={searchValue}
                    onChange={(event) => setSearchValue(event.target.value)}
                    placeholder="Search mobile phones, brands..."
                    className="h-11 w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] pl-11 pr-4 text-sm text-[var(--text-primary)] outline-none focus:border-orange-500"
                  />
                </div>
              </form>

              {/* Mobile Links */}
              <nav className="flex flex-col">
                <NavLink
                  to="/home"
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `border-b border-[var(--border-color)] py-3 text-sm font-medium ${
                      isActive
                        ? "text-orange-500"
                        : "text-[var(--text-secondary)]"
                    }`
                  }
                >
                  Home
                </NavLink>

                <NavLink
                  to="/mobiles"
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `border-b border-[var(--border-color)] py-3 text-sm font-medium ${
                      isActive
                        ? "text-orange-500"
                        : "text-[var(--text-secondary)]"
                    }`
                  }
                >
                  Mobile Phones
                </NavLink>

                <NavLink
                  to="/brands"
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `border-b border-[var(--border-color)] py-3 text-sm font-medium ${
                      isActive
                        ? "text-orange-500"
                        : "text-[var(--text-secondary)]"
                    }`
                  }
                >
                  Brands
                </NavLink>

                <NavLink
                  to="/deals"
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `border-b border-[var(--border-color)] py-3 text-sm font-medium ${
                      isActive
                        ? "text-orange-500"
                        : "text-[var(--text-secondary)]"
                    }`
                  }
                >
                  Deals
                </NavLink>

                <NavLink
                  to="/wishlist"
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `border-b border-[var(--border-color)] py-3 text-sm font-medium ${
                      isActive
                        ? "text-orange-500"
                        : "text-[var(--text-secondary)]"
                    }`
                  }
                >
                  Wishlist
                  {wishlistCount > 0 && (
                    <span className="ml-2 rounded-full bg-orange-500 px-2 py-0.5 text-[10px] text-white">
                      {wishlistCount}
                    </span>
                  )}
                </NavLink>

                <NavLink
                  to="/cart"
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `border-b border-[var(--border-color)] py-3 text-sm font-medium ${
                      isActive
                        ? "text-orange-500"
                        : "text-[var(--text-secondary)]"
                    }`
                  }
                >
                  Cart
                  {cartItemCount > 0 && (
                    <span className="ml-2 rounded-full bg-orange-500 px-2 py-0.5 text-[10px] text-white">
                      {cartItemCount}
                    </span>
                  )}
                </NavLink>

                <button
                  type="button"
                  onClick={toggleTheme}
                  className="flex items-center gap-3 border-b border-[var(--border-color)] py-3 text-left text-sm font-medium text-[var(--text-secondary)]"
                >
                  {isDarkMode ? <FiSun size={18} /> : <FiMoon size={18} />}

                  {isDarkMode ? "Light Mode" : "Dark Mode"}
                </button>

                {isAuthenticated ? (
                  <>
                    <Link
                      to={isAdmin ? "/admin" : "/profile"}
                      onClick={closeMenu}
                      className="flex items-center gap-3 border-b border-[var(--border-color)] py-3 text-sm font-medium text-[var(--text-secondary)]"
                    >
                      <FiUser size={18} />
                      {isAdmin ? "Admin Panel" : "My Profile"}
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex items-center gap-3 py-3 text-left text-sm font-medium text-red-500"
                    >
                      <FiLogOut size={18} />
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
                  >
                    <FiUserCheck size={18} />
                    Login
                  </Link>
                )}
              </nav>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
