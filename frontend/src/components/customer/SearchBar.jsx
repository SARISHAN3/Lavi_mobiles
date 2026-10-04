import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FiSearch, FiX } from "react-icons/fi";

const SearchBar = ({
  placeholder = "Search mobiles, brands and more...",
  className = "",
  autoFocus = false,
}) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialSearch = searchParams.get("search") || "";

  const [search, setSearch] = useState(initialSearch);

  const inputRef = useRef(null);

  useEffect(() => {
    setSearch(searchParams.get("search") || "");
  }, [searchParams]);

  useEffect(() => {
    if (autoFocus) {
      inputRef.current?.focus();
    }
  }, [autoFocus]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedSearch = search.trim();

    if (!trimmedSearch) {
      navigate("/mobiles");
      return;
    }

    navigate(`/mobiles?search=${encodeURIComponent(trimmedSearch)}`);
  };

  const clearSearch = () => {
    setSearch("");
    navigate("/mobiles");
    inputRef.current?.focus();
  };

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      className={`relative w-full ${className}`}
    >
      <FiSearch
        size={19}
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
      />

      <input
        ref={inputRef}
        type="search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder={placeholder}
        aria-label="Search products"
        className="h-11 w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] py-2 pl-11 pr-20 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 [&::-webkit-search-cancel-button]:appearance-none"
      />

      <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
        {search && (
          <button
            type="button"
            onClick={clearSearch}
            aria-label="Clear search"
            className="flex h-8 w-8 items-center justify-center rounded-md text-[var(--text-secondary)] transition hover:bg-[var(--bg-primary)] hover:text-red-500"
          >
            <FiX size={17} />
          </button>
        )}

        <button
          type="submit"
          aria-label="Search"
          className="flex h-8 items-center justify-center rounded-md bg-orange-500 px-3 text-xs font-semibold text-white transition hover:bg-orange-600"
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
