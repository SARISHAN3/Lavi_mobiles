import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FiMenu,
  FiX,
  FiSearch,
  FiUser,
  FiShoppingCart,
  FiHeart,
  FiPackage,
  FiHome,
  FiLogOut,
  FiSun,
  FiMoon,
  FiChevronDown,
} from "react-icons/fi";

function Navbar() {
  const navigate = useNavigate();

  /* =====================================================
     THEME
  ===================================================== */

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("lavi-theme") === "dark";
  });

  /* =====================================================
     NAVIGATION STATES
  ===================================================== */

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const [search, setSearch] = useState("");

  /* =====================================================
     USER
  ===================================================== */

  const token = localStorage.getItem("token");

  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    user = null;
  }

  /* =====================================================
     APPLY THEME
  ===================================================== */

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    localStorage.setItem("lavi-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  /* =====================================================
     SEARCH
  ===================================================== */

  const handleSearch = (e) => {
    e.preventDefault();

    const searchValue = search.trim();

    if (!searchValue) {
      return;
    }

    setMenuOpen(false);
    setMobileMenuOpen(false);
    setSearch("");

    navigate(`/products?search=${encodeURIComponent(searchValue)}`);
  };

  /* =====================================================
     LOGOUT
  ===================================================== */

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setMenuOpen(false);
    setMobileMenuOpen(false);

    navigate("/login");
  };

  /* =====================================================
     CLOSE MENUS
  ===================================================== */

  const closeMenus = () => {
    setMenuOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <header
      className="
        sticky top-0 z-50
        w-full
        bg-white dark:bg-[#181b1f]
        border-b border-gray-200 dark:border-[#2b3036]
        transition-colors duration-300
      "
    >
      {/* =================================================
          MAIN NAVBAR
      ================================================= */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-[72px] flex items-center gap-4 lg:gap-6">
          {/* =================================================
              LOGO
          ================================================= */}

          <Link
            to="/"
            onClick={closeMenus}
            className="
              shrink-0
              text-2xl sm:text-3xl
              font-bold
              tracking-tight
              text-orange-500
              hover:text-orange-600
              transition
            "
          >
            Lavi Mobile
          </Link>

          {/* =================================================
              MENU DROPDOWN - DESKTOP
          ================================================= */}

          <div
            className="
              hidden lg:block
              relative
            "
            onMouseEnter={() => setMenuOpen(true)}
            onMouseLeave={() => setMenuOpen(false)}
          >
            <button
              type="button"
              className="
                flex items-center gap-2
                px-3 py-2
                rounded-lg
                text-gray-700 dark:text-gray-300
                hover:bg-gray-100 dark:hover:bg-[#24282d]
                hover:text-orange-500
                transition
              "
            >
              <FiMenu size={19} />

              <span className="font-medium text-sm">Menu</span>

              <FiChevronDown
                size={15}
                className={`
                  transition-transform duration-200
                  ${menuOpen ? "rotate-180" : ""}
                `}
              />
            </button>

            {/* =================================================
                DROPDOWN
            ================================================= */}

            <div
              className={`
                absolute
                left-0
                top-full
                pt-2
                w-64
                transition-all duration-200
                ${
                  menuOpen
                    ? "opacity-100 visible translate-y-0"
                    : "opacity-0 invisible -translate-y-2"
                }
              `}
            >
              <div
                className="
                  overflow-hidden
                  rounded-xl
                  bg-white dark:bg-[#1d2125]
                  border border-gray-200 dark:border-[#2b3036]
                  shadow-xl
                "
              >
                {/* Home */}

                <Link
                  to="/"
                  onClick={() => setMenuOpen(false)}
                  className="
                    flex items-center gap-3
                    px-5 py-3.5
                    text-gray-700 dark:text-gray-300
                    hover:bg-orange-50 dark:hover:bg-[#29231f]
                    hover:text-orange-500
                    transition
                  "
                >
                  <FiHome size={18} />
                  <span>Home</span>
                </Link>

                {/* Mobile Phones */}

                <Link
                  to="/products"
                  onClick={() => setMenuOpen(false)}
                  className="
                    flex items-center gap-3
                    px-5 py-3.5
                    text-gray-700 dark:text-gray-300
                    hover:bg-orange-50 dark:hover:bg-[#29231f]
                    hover:text-orange-500
                    transition
                  "
                >
                  <span className="text-lg">📱</span>

                  <span>Mobile Phones</span>
                </Link>

                {/* Wishlist */}

                <Link
                  to="/wishlist"
                  onClick={() => setMenuOpen(false)}
                  className="
                    flex items-center gap-3
                    px-5 py-3.5
                    text-gray-700 dark:text-gray-300
                    hover:bg-orange-50 dark:hover:bg-[#29231f]
                    hover:text-orange-500
                    transition
                  "
                >
                  <FiHeart size={18} />
                  <span>Wishlist</span>
                </Link>

                {/* Orders */}

                <Link
                  to="/orders"
                  onClick={() => setMenuOpen(false)}
                  className="
                    flex items-center gap-3
                    px-5 py-3.5
                    text-gray-700 dark:text-gray-300
                    hover:bg-orange-50 dark:hover:bg-[#29231f]
                    hover:text-orange-500
                    transition
                  "
                >
                  <FiPackage size={18} />
                  <span>Orders</span>
                </Link>

                <div
                  className="
                    border-t
                    border-gray-200 dark:border-[#2b3036]
                  "
                />

                {/* Auth */}

                {token && user ? (
                  <>
                    <Link
                      to="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="
                        flex items-center gap-3
                        px-5 py-3.5
                        text-gray-700 dark:text-gray-300
                        hover:bg-orange-50 dark:hover:bg-[#29231f]
                        hover:text-orange-500
                        transition
                      "
                    >
                      <FiUser size={18} />
                      <span>Profile</span>
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="
                        w-full
                        flex items-center gap-3
                        px-5 py-3.5
                        text-left
                        text-gray-700 dark:text-gray-300
                        hover:bg-red-50 dark:hover:bg-[#2a2020]
                        hover:text-red-500
                        transition
                      "
                    >
                      <FiLogOut size={18} />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setMenuOpen(false)}
                      className="
                        flex items-center gap-3
                        px-5 py-3.5
                        text-gray-700 dark:text-gray-300
                        hover:bg-orange-50 dark:hover:bg-[#29231f]
                        hover:text-orange-500
                        transition
                      "
                    >
                      <FiUser size={18} />
                      <span>Login</span>
                    </Link>

                    <Link
                      to="/register"
                      onClick={() => setMenuOpen(false)}
                      className="
                        flex items-center gap-3
                        px-5 py-3.5
                        text-gray-700 dark:text-gray-300
                        hover:bg-orange-50 dark:hover:bg-[#29231f]
                        hover:text-orange-500
                        transition
                      "
                    >
                      <span>✨</span>
                      <span>Register</span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* =================================================
              SEARCH
          ================================================= */}

          <form
            onSubmit={handleSearch}
            className="
              hidden md:flex
              flex-1
              max-w-2xl
              mx-auto
              relative
            "
          >
            <FiSearch
              size={19}
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-gray-400
                dark:text-gray-500
              "
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search mobiles, brands..."
              className="
                w-full
                h-11
                pl-11 pr-14
                rounded-xl
                bg-gray-100 dark:bg-[#24282d]
                text-gray-800 dark:text-gray-100
                placeholder-gray-400 dark:placeholder-gray-500
                border border-transparent
                focus:border-orange-500
                focus:bg-white dark:focus:bg-[#24282d]
                outline-none
                transition
              "
            />

            <button
              type="submit"
              className="
                absolute
                right-1
                top-1
                w-9 h-9
                flex items-center justify-center
                rounded-lg
                bg-orange-500
                text-white
                hover:bg-orange-600
                transition
              "
              title="Search"
            >
              <FiSearch size={17} />
            </button>
          </form>

          {/* =================================================
              RIGHT SIDE ACTIONS
          ================================================= */}

          <div className="flex items-center gap-1 sm:gap-2 ml-auto">
            {/* Wishlist */}

            <Link
              to="/wishlist"
              className="
                hidden sm:flex
                w-10 h-10
                items-center justify-center
                rounded-lg
                text-gray-600 dark:text-gray-300
                hover:bg-gray-100 dark:hover:bg-[#24282d]
                hover:text-orange-500
                transition
              "
              title="Wishlist"
            >
              <FiHeart size={20} />
            </Link>

            {/* Cart */}

            <Link
              to="/cart"
              className="
                w-10 h-10
                flex items-center justify-center
                rounded-lg
                text-gray-600 dark:text-gray-300
                hover:bg-gray-100 dark:hover:bg-[#24282d]
                hover:text-orange-500
                transition
                relative
              "
              title="Cart"
            >
              <FiShoppingCart size={21} />
            </Link>

            {/* Profile */}

            <Link
              to={token && user ? "/profile" : "/login"}
              className="
                hidden sm:flex
                w-10 h-10
                items-center justify-center
                rounded-lg
                text-gray-600 dark:text-gray-300
                hover:bg-gray-100 dark:hover:bg-[#24282d]
                hover:text-orange-500
                transition
              "
              title={token && user ? "Profile" : "Login"}
            >
              <FiUser size={20} />
            </Link>

            {/* =================================================
                THEME TOGGLE
            ================================================= */}

            <button
              type="button"
              onClick={() => setDarkMode((previous) => !previous)}
              className="
                w-10 h-10
                flex items-center justify-center
                rounded-lg
                bg-gray-100 dark:bg-[#24282d]
                text-gray-700 dark:text-gray-200
                hover:text-orange-500
                transition
              "
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>

            {/* Mobile Menu */}

            <button
              type="button"
              onClick={() => setMobileMenuOpen((previous) => !previous)}
              className="
                lg:hidden
                w-10 h-10
                flex items-center justify-center
                rounded-lg
                text-gray-700 dark:text-gray-200
                hover:bg-gray-100 dark:hover:bg-[#24282d]
                hover:text-orange-500
                transition
              "
              title="Menu"
            >
              {mobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>

        {/* =================================================
            MOBILE MENU
        ================================================= */}

        {mobileMenuOpen && (
          <div
            className="
              lg:hidden
              py-4
              border-t
              border-gray-200 dark:border-[#2b3036]
            "
          >
            {/* Mobile Search */}

            <form
              onSubmit={handleSearch}
              className="
                flex
                w-full
                mb-4
              "
            >
              <div className="relative flex-1">
                <FiSearch
                  size={18}
                  className="
                    absolute
                    left-3
                    top-1/2
                    -translate-y-1/2
                    text-gray-400
                  "
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search mobiles..."
                  className="
                    w-full
                    h-11
                    pl-10 pr-4
                    rounded-l-xl
                    bg-gray-100 dark:bg-[#24282d]
                    text-gray-800 dark:text-gray-100
                    placeholder-gray-400
                    outline-none
                    border border-transparent
                    focus:border-orange-500
                  "
                />
              </div>

              <button
                type="submit"
                className="
                  px-5
                  rounded-r-xl
                  bg-orange-500
                  hover:bg-orange-600
                  text-white
                  transition
                "
              >
                <FiSearch size={19} />
              </button>
            </form>

            {/* Mobile Navigation */}

            <nav className="space-y-1">
              {/* Home */}

              <Link
                to="/"
                onClick={closeMenus}
                className="
                  flex items-center gap-3
                  px-4 py-3
                  rounded-xl
                  text-gray-700 dark:text-gray-300
                  hover:bg-orange-50 dark:hover:bg-[#29231f]
                  hover:text-orange-500
                  transition
                "
              >
                <FiHome size={19} />
                <span>Home</span>
              </Link>

              {/* Mobile Phones */}

              <Link
                to="/products"
                onClick={closeMenus}
                className="
                  flex items-center gap-3
                  px-4 py-3
                  rounded-xl
                  text-gray-700 dark:text-gray-300
                  hover:bg-orange-50 dark:hover:bg-[#29231f]
                  hover:text-orange-500
                  transition
                "
              >
                <span className="text-lg">📱</span>

                <span>Mobile Phones</span>
              </Link>

              {/* Wishlist */}

              <Link
                to="/wishlist"
                onClick={closeMenus}
                className="
                  flex items-center gap-3
                  px-4 py-3
                  rounded-xl
                  text-gray-700 dark:text-gray-300
                  hover:bg-orange-50 dark:hover:bg-[#29231f]
                  hover:text-orange-500
                  transition
                "
              >
                <FiHeart size={19} />
                <span>Wishlist</span>
              </Link>

              {/* Orders */}

              <Link
                to="/orders"
                onClick={closeMenus}
                className="
                  flex items-center gap-3
                  px-4 py-3
                  rounded-xl
                  text-gray-700 dark:text-gray-300
                  hover:bg-orange-50 dark:hover:bg-[#29231f]
                  hover:text-orange-500
                  transition
                "
              >
                <FiPackage size={19} />
                <span>Orders</span>
              </Link>

              {/* Profile / Login */}

              <div
                className="
                  border-t
                  border-gray-200 dark:border-[#2b3036]
                  my-2
                "
              />

              {token && user ? (
                <>
                  <Link
                    to="/profile"
                    onClick={closeMenus}
                    className="
                      flex items-center gap-3
                      px-4 py-3
                      rounded-xl
                      text-gray-700 dark:text-gray-300
                      hover:bg-orange-50 dark:hover:bg-[#29231f]
                      hover:text-orange-500
                      transition
                    "
                  >
                    <FiUser size={19} />
                    <span>Profile</span>
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="
                      w-full
                      flex items-center gap-3
                      px-4 py-3
                      rounded-xl
                      text-left
                      text-gray-700 dark:text-gray-300
                      hover:bg-red-50 dark:hover:bg-[#2a2020]
                      hover:text-red-500
                      transition
                    "
                  >
                    <FiLogOut size={19} />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={closeMenus}
                    className="
                      flex items-center gap-3
                      px-4 py-3
                      rounded-xl
                      text-gray-700 dark:text-gray-300
                      hover:bg-orange-50 dark:hover:bg-[#29231f]
                      hover:text-orange-500
                      transition
                    "
                  >
                    <FiUser size={19} />
                    <span>Login</span>
                  </Link>

                  <Link
                    to="/register"
                    onClick={closeMenus}
                    className="
                      flex items-center gap-3
                      px-4 py-3
                      rounded-xl
                      text-gray-700 dark:text-gray-300
                      hover:bg-orange-50 dark:hover:bg-[#29231f]
                      hover:text-orange-500
                      transition
                    "
                  >
                    <span>✨</span>
                    <span>Register</span>
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;
