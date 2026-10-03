import { Link } from "react-router-dom";
import {
  FiFacebook,
  FiInstagram,
  FiTwitter,
  FiYoutube,
  FiMail,
  FiPhone,
  FiMapPin,
} from "react-icons/fi";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-[var(--border-color)] bg-[var(--bg-secondary)]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link to="/home" className="inline-flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500 font-bold text-white">
                L
              </div>

              <div>
                <h2 className="text-xl font-bold text-[var(--text-primary)]">
                  Lavi <span className="text-orange-500">Mobile</span>
                </h2>

                <p className="text-[10px] text-[var(--text-muted)]">
                  Smart Shopping
                </p>
              </div>
            </Link>

            <p className="mt-5 max-w-xs text-sm leading-6 text-[var(--text-secondary)]">
              Your trusted destination for smartphones, smartwatches and
              accessories. Discover the latest technology at great prices.
            </p>

            {/* Social Links */}
            <div className="mt-5 flex items-center gap-2">
              <a
                href="#"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-color)] text-[var(--text-secondary)] transition hover:border-orange-500 hover:bg-orange-500 hover:text-white"
              >
                <FiFacebook size={17} />
              </a>

              <a
                href="#"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-color)] text-[var(--text-secondary)] transition hover:border-orange-500 hover:bg-orange-500 hover:text-white"
              >
                <FiInstagram size={17} />
              </a>

              <a
                href="#"
                aria-label="Twitter"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-color)] text-[var(--text-secondary)] transition hover:border-orange-500 hover:bg-orange-500 hover:text-white"
              >
                <FiTwitter size={17} />
              </a>

              <a
                href="#"
                aria-label="YouTube"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-color)] text-[var(--text-secondary)] transition hover:border-orange-500 hover:bg-orange-500 hover:text-white"
              >
                <FiYoutube size={17} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-[var(--text-primary)]">
              Quick Links
            </h3>

            <ul className="mt-5 space-y-3">
              <li>
                <Link
                  to="/home"
                  className="text-sm text-[var(--text-secondary)] transition hover:text-orange-500"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  to="/mobiles"
                  className="text-sm text-[var(--text-secondary)] transition hover:text-orange-500"
                >
                  Mobile Phones
                </Link>
              </li>

              <li>
                <Link
                  to="/brands"
                  className="text-sm text-[var(--text-secondary)] transition hover:text-orange-500"
                >
                  Brands
                </Link>
              </li>

              <li>
                <Link
                  to="/deals"
                  className="text-sm text-[var(--text-secondary)] transition hover:text-orange-500"
                >
                  Deals
                </Link>
              </li>

              <li>
                <Link
                  to="/wishlist"
                  className="text-sm text-[var(--text-secondary)] transition hover:text-orange-500"
                >
                  Wishlist
                </Link>
              </li>

              <li>
                <Link
                  to="/cart"
                  className="text-sm text-[var(--text-secondary)] transition hover:text-orange-500"
                >
                  Shopping Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-[var(--text-primary)]">
              Customer Service
            </h3>

            <ul className="mt-5 space-y-3">
              <li>
                <Link
                  to="/orders"
                  className="text-sm text-[var(--text-secondary)] transition hover:text-orange-500"
                >
                  My Orders
                </Link>
              </li>

              <li>
                <Link
                  to="/profile"
                  className="text-sm text-[var(--text-secondary)] transition hover:text-orange-500"
                >
                  My Profile
                </Link>
              </li>

              <li>
                <Link
                  to="/mobiles"
                  className="text-sm text-[var(--text-secondary)] transition hover:text-orange-500"
                >
                  Track Products
                </Link>
              </li>

              <li>
                <a
                  href="mailto:support@lavimobile.com"
                  className="text-sm text-[var(--text-secondary)] transition hover:text-orange-500"
                >
                  Help & Support
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="text-sm text-[var(--text-secondary)] transition hover:text-orange-500"
                >
                  Privacy Policy
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="text-sm text-[var(--text-secondary)] transition hover:text-orange-500"
                >
                  Terms & Conditions
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-[var(--text-primary)]">
              Contact Us
            </h3>

            <div className="mt-5 space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 text-orange-500">
                  <FiMapPin size={18} />
                </div>

                <p className="text-sm leading-5 text-[var(--text-secondary)]">
                  Lavi Mobile Store
                  <br />
                  Tamil Nadu, India
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-orange-500">
                  <FiPhone size={18} />
                </div>

                <a
                  href="tel:+919999999999"
                  className="text-sm text-[var(--text-secondary)] transition hover:text-orange-500"
                >
                  +91 99999 99999
                </a>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-orange-500">
                  <FiMail size={18} />
                </div>

                <a
                  href="mailto:support@lavimobile.com"
                  className="break-all text-sm text-[var(--text-secondary)] transition hover:text-orange-500"
                >
                  support@lavimobile.com
                </a>
              </div>
            </div>

            <div className="mt-6 rounded-lg bg-[var(--bg-primary)] p-4">
              <p className="text-xs font-semibold text-[var(--text-primary)]">
                Customer Support
              </p>

              <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">
                Monday - Saturday
                <br />
                9:00 AM - 7:00 PM
              </p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 border-t border-[var(--border-color)] pt-6">
          <div className="flex flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
            <p className="text-xs text-[var(--text-muted)]">
              © {currentYear} Lavi Mobile. All rights reserved.
            </p>

            <p className="text-xs text-[var(--text-muted)]">
              Built for a smarter mobile shopping experience.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
