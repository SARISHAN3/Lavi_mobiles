import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  FiMenu,
  FiX,
  FiSearch,
  FiUser,
  FiShoppingCart,
  FiHeart,
  FiPackage,
} from "react-icons/fi";

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

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link
            to="/"
            onClick={closeMenu}
            className="text-2xl font-bold text-orange-500 whitespace-nowrap"
          >
            Lavi Mobile
          </Link>

          {/* Desktop Search */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex items-center flex-1 max-w-md"
          >
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search mobiles..."
              className="w-full border border-gray-300 rounded-l-lg px-4 py-2 outline-none focus:border-orange-500"
            />

            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-r-lg"
            >
              <FiSearch size={20} />
            </button>
          </form>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-5">
            <Link to="/" className="text-gray-700 hover:text-orange-500">
              Home
            </Link>

            <Link
              to="/products"
              className="text-gray-700 hover:text-orange-500"
            >
              Mobiles
            </Link>

            <Link
              to="/wishlist"
              className="text-gray-700 hover:text-orange-500 flex items-center gap-1"
            >
              <FiHeart />
              Wishlist
            </Link>

            <Link
              to="/orders"
              className="text-gray-700 hover:text-orange-500 flex items-center gap-1"
            >
              <FiPackage />
              Orders
            </Link>

            <Link
              to="/cart"
              className="text-gray-700 hover:text-orange-500 flex items-center gap-1"
            >
              <FiShoppingCart />
              Cart
            </Link>
          </nav>

          {/* Desktop User Section */}
          <div className="hidden lg:flex items-center gap-3">
            {token && user ? (
              <>
                <Link
                  to="/profile"
                  className="text-gray-700 hover:text-orange-500 flex items-center gap-1"
                >
                  <FiUser />
                  Profile
                </Link>

                <button
                  onClick={handleLogout}
                  className="bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-lg text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-orange-500"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden text-gray-700 hover:text-orange-500"
          >
            {menuOpen ? <FiX size={26} /> : <FiMenu size={26} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="flex items-center mb-4">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search mobiles..."
                className="w-full border border-gray-300 rounded-l-lg px-4 py-2 outline-none focus:border-orange-500"
              />

              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-r-lg"
              >
                <FiSearch size={20} />
              </button>
            </form>

            {/* Mobile Links */}
            <nav className="flex flex-col gap-3">
              <Link
                to="/"
                onClick={closeMenu}
                className="text-gray-700 hover:text-orange-500 py-2"
              >
                🏠 Home
              </Link>

              <Link
                to="/products"
                onClick={closeMenu}
                className="text-gray-700 hover:text-orange-500 py-2"
              >
                📱 Mobile Phones
              </Link>

              <Link
                to="/wishlist"
                onClick={closeMenu}
                className="text-gray-700 hover:text-orange-500 py-2 flex items-center gap-2"
              >
                <FiHeart />
                Wishlist
              </Link>

              <Link
                to="/orders"
                onClick={closeMenu}
                className="text-gray-700 hover:text-orange-500 py-2 flex items-center gap-2"
              >
                <FiPackage />
                Orders
              </Link>

              <Link
                to="/cart"
                onClick={closeMenu}
                className="text-gray-700 hover:text-orange-500 py-2 flex items-center gap-2"
              >
                <FiShoppingCart />
                Cart
              </Link>

              <hr />

              {token && user ? (
                <>
                  <Link
                    to="/profile"
                    onClick={closeMenu}
                    className="text-gray-700 hover:text-orange-500 py-2 flex items-center gap-2"
                  >
                    <FiUser />
                    Profile
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-lg text-sm w-full"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex gap-3">
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="border border-gray-300 hover:border-orange-500 text-gray-700 px-4 py-2 rounded-lg text-sm flex-1 text-center"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    onClick={closeMenu}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm flex-1 text-center"
                  >
                    Register
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;
