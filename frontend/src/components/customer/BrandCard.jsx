import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { getImageUrl } from "../../config/image";

const BrandCard = ({ brand }) => {
  if (!brand) {
    return null;
  }

  const brandId = brand._id || brand.id;
  const brandName = brand.name || "Brand";
  const logo = getImageUrl(brand.logo);

  const slug =
    brand.slug || brandName.toLowerCase().trim().replace(/\s+/g, "-");

  return (
    <Link
      to={`/mobiles?brand=${encodeURIComponent(brandId || slug)}`}
      className="group block"
    >
      <div className="flex h-full min-h-[150px] flex-col items-center justify-center rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5 text-center shadow-[var(--shadow-card)] transition duration-300 hover:-translate-y-1 hover:border-orange-500/40 hover:shadow-[var(--shadow-hover)]">
        {/* Brand Logo */}
        <div className="flex h-20 w-24 items-center justify-center rounded-lg bg-white p-3 dark:bg-[#f5f5f5]">
          {logo ? (
            <img
              src={logo}
              alt={brandName}
              loading="lazy"
              className="max-h-full max-w-full object-contain transition duration-300 group-hover:scale-105"
            />
          ) : (
            <span className="text-lg font-bold text-orange-500">
              {brandName.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        {/* Brand Name */}
        <h3 className="mt-4 text-sm font-semibold text-[var(--text-primary)] transition group-hover:text-orange-500">
          {brandName}
        </h3>

        {/* Description */}
        {brand.description && (
          <p className="mt-1 line-clamp-1 text-xs text-[var(--text-muted)]">
            {brand.description}
          </p>
        )}

        {/* Explore */}
        <span className="mt-3 inline-flex items-center gap-1 text-[10px] font-semibold text-orange-500 sm:text-xs">
          Explore
          <FiArrowRight
            size={13}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </span>
      </div>
    </Link>
  );
};

export default BrandCard;
