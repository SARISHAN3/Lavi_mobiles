import { Link } from "react-router-dom";
import { FiChevronRight, FiHome } from "react-icons/fi";

const Breadcrumbs = ({ items = [], className = "" }) => {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex min-w-0 items-center ${className}`}
    >
      <ol className="flex min-w-0 items-center gap-1 text-sm">
        {/* Home */}
        <li className="flex shrink-0 items-center">
          <Link
            to="/home"
            className="flex items-center gap-1.5 text-[var(--text-secondary)] transition hover:text-orange-500"
            aria-label="Home"
          >
            <FiHome size={15} />
            <span className="hidden sm:inline">Home</span>
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li
              key={`${item.label}-${index}`}
              className="flex min-w-0 items-center"
            >
              <FiChevronRight
                size={15}
                className="mx-1 shrink-0 text-[var(--text-muted)]"
              />

              {item.to && !isLast ? (
                <Link
                  to={item.to}
                  className="max-w-32 truncate text-[var(--text-secondary)] transition hover:text-orange-500 sm:max-w-none"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={`max-w-40 truncate sm:max-w-xs ${
                    isLast
                      ? "font-medium text-[var(--text-primary)]"
                      : "text-[var(--text-secondary)]"
                  }`}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
