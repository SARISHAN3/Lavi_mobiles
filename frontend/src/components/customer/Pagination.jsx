import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  disabled = false,
}) => {
  if (totalPages <= 1) {
    return null;
  }

  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= 5) {
      for (let page = 1; page <= totalPages; page += 1) {
        pages.push(page);
      }

      return pages;
    }

    pages.push(1);

    if (currentPage > 3) {
      pages.push("left-dots");
    }

    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    for (let page = startPage; page <= endPage; page += 1) {
      pages.push(page);
    }

    if (currentPage < totalPages - 2) {
      pages.push("right-dots");
    }

    pages.push(totalPages);

    return pages;
  };

  const handlePageChange = (page) => {
    if (disabled || page === currentPage || page < 1 || page > totalPages) {
      return;
    }

    onPageChange?.(page);
  };

  return (
    <nav
      className="flex items-center justify-center gap-1.5 sm:gap-2"
      aria-label="Pagination"
    >
      {/* Previous */}
      <button
        type="button"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={disabled || currentPage === 1}
        aria-label="Previous page"
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-secondary)] transition hover:border-orange-500 hover:text-orange-500 disabled:cursor-not-allowed disabled:opacity-40 sm:h-10 sm:w-10"
      >
        <FiChevronLeft size={18} />
      </button>

      {/* Page Numbers */}
      {getPageNumbers().map((page, index) => {
        if (typeof page !== "number") {
          return (
            <span
              key={`${page}-${index}`}
              className="flex h-9 w-8 items-center justify-center text-sm text-[var(--text-muted)] sm:h-10 sm:w-10"
            >
              ...
            </span>
          );
        }

        const isActive = page === currentPage;

        return (
          <button
            key={page}
            type="button"
            onClick={() => handlePageChange(page)}
            disabled={disabled}
            aria-current={isActive ? "page" : undefined}
            className={`flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-semibold transition sm:h-10 sm:w-10 ${
              isActive
                ? "border-orange-500 bg-orange-500 text-white"
                : "border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:border-orange-500 hover:text-orange-500"
            } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
          >
            {page}
          </button>
        );
      })}

      {/* Next */}
      <button
        type="button"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={disabled || currentPage === totalPages}
        aria-label="Next page"
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-secondary)] transition hover:border-orange-500 hover:text-orange-500 disabled:cursor-not-allowed disabled:opacity-40 sm:h-10 sm:w-10"
      >
        <FiChevronRight size={18} />
      </button>
    </nav>
  );
};

export default Pagination;
