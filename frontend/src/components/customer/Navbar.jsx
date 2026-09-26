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
} from "react-icons/fi";
import { useState } from "react";

function Navbar() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleSearch = (e) => {
    e.preventDefault();

    if (!search.trim()) {
      return;
    }

    setMenuOpen(false);

    navigate(`/products?search=${encodeURIComponent(search.trim())}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setMenuOpen(false);

    navigate("/login");
  };

  return (
    <header className="bg-gray-950 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="h-20 flex items-center gap-6">
          {/* ================= LOGO ================= */}
          <Link
            to="/"
            className="text-2xl md:text-3xl font-bold text-white whitespace-nowrap"
          >
            Lavi Mobile
          </Link>

          {/* ================= DESKTOP MENU ================= */}
          <div
            className="hidden lg:block relative group"
            onMouseEnter={() => setMenuOpen(true)}
            onMouseLeave={() => setMenuOpen(false)}
          >
            {/* Menu Button */}
            <button className="flex items-center gap-2 text-white hover:text-orange-400 transition">
              <FiMenu size={22} />
              <span className="font-medium">Menu</span>
            </button>

            {/* Dropdown */}
            <div
              className={`
                absolute left-0 top-full pt-3
                transition-all duration-200
                ${
                  menuOpen
                    ? "opacity-100 visible translate-y-0"
                    : "opacity-0 invisible -translate-y-2"
                }
              `}
            >
              <div className="w-64 bg-white text-gray-800 rounded-lg shadow-xl border border-gray-200 overflow-hidden">
                {/* Home */}
                <Link
                  to="/"
                  className="flex items-center gap-3 px-5 py-3 hover:bg-orange-50 hover:text-orange-500 transition"
                >
                  <FiHome />
                  Home
                </Link>

                {/* Mobile Phones */}
                <Link
                  to="/products"
                  className="flex items-center gap-3 px-5 py-3 hover:bg-orange-50 hover:text-orange-500 transition"
                >
                  📱 Mobile Phones
                </Link>

                {/* Wishlist */}
                <Link
                  to="/wishlist"
                  className="flex items-center gap-3 px-5 py-3 hover:bg-orange-50 hover:text-orange-500 transition"
                >
                  <FiHeart />
                  Wishlist
                </Link>

                {/* Orders */}
                <Link
                  to="/orders"
                  className="flex items-center gap-3 px-5 py-3 hover:bg-orange-50 hover:text-orange-500 transition"
                >
                  <FiPackage />
                  Orders
                </Link>

                <div className="border-t border-gray-200" />

                {/* Profile */}
                {token && user ? (
                  <>
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-5 py-3 hover:bg-orange-50 hover:text-orange-500 transition"
                    >
                      <FiUser />
                      Profile
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-5 py-3 text-left hover:bg-red-50 hover:text-red-500 transition"
                    >
                      <FiLogOut />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="flex items-center gap-3 px-5 py-3 hover:bg-orange-50 hover:text-orange-500 transition"
                    >
                      <FiUser />
                      Login
                    </Link>

                    <Link
                      to="/register"
                      className="flex items-center gap-3 px-5 py-3 hover:bg-orange-50 hover:text-orange-500 transition"
                    >
                      ✨ Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* ================= SEARCH ================= */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex items-center flex-1 max-w-2xl mx-auto"
          >
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="What are you looking for?"
              className="w-full bg-white text-gray-800 px-5 py-3 rounded-l-lg outline-none placeholder-gray-400"
            />

            <button
              type="submit"
              className="bg-white text-gray-800 px-5 py-3 rounded-r-lg hover:text-orange-500 transition"
            >
              <FiSearch size={22} />
            </button>
          </form>

          {/* ================= RIGHT SIDE ================= */}
          <div className="flex items-center gap-5 ml-auto">
            {/* Profile */}
            <Link
              to={token && user ? "/profile" : "/login"}
              className="text-white hover:text-orange-400 transition"
              title={token && user ? "Profile" : "Login"}
            >
              <FiUser size={25} />
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="text-white hover:text-orange-400 transition relative"
              title="Cart"
            >
              <FiShoppingCart size={25} />
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden text-white hover:text-orange-400"
            >
              {menuOpen ? <FiX size={27} /> : <FiMenu size={27} />}
            </button>
          </div>
        </div>

        {/* ================= MOBILE MENU ================= */}
        {menuOpen && (
          <div className="lg:hidden border-t border-gray-700 py-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="flex items-center mb-4">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search mobiles..."
                className="w-full bg-white text-gray-800 rounded-l-lg px-4 py-2.5 outline-none"
              />

              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-r-lg"
              >
                <FiSearch size={20} />
              </button>
            </form>

            {/* Mobile Links */}
            <nav className="flex flex-col">
              <Link
                to="/"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 py-3 hover:text-orange-400"
              >
                <FiHome />
                Home
              </Link>

              <Link
                to="/products"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 py-3 hover:text-orange-400"
              >
                📱 Mobile Phones
              </Link>

              <Link
                to="/wishlist"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 py-3 hover:text-orange-400"
              >
                <FiHeart />
                Wishlist
              </Link>

              <Link
                to="/orders"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 py-3 hover:text-orange-400"
              >
                <FiPackage />
                Orders
              </Link>

              <hr className="border-gray-700 my-2" />

              {token && user ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 py-3 hover:text-orange-400"
                  >
                    <FiUser />
                    Profile
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 py-3 text-left hover:text-red-400"
                  >
                    <FiLogOut />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 py-3 hover:text-orange-400"
                  >
                    <FiUser />
                    Login
                  </Link>

                  <Link
                    to="/register"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 py-3 hover:text-orange-400"
                  >
                    ✨ Register
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
