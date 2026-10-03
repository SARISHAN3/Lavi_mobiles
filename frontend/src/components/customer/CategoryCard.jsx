import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { getImageUrl } from "../../config/image";

const CategoryCard = ({ category }) => {
  if (!category) {
    return null;
  }

  const categoryId = category._id || category.id;
  const categoryName = category.name || "Category";
  const image = getImageUrl(category.image);

  const slug = category.slug || categoryName.toLowerCase().replace(/\s+/g, "-");

  return (
    <Link
      to={`/mobiles?category=${encodeURIComponent(categoryId || slug)}`}
      className="group block"
    >
      <div className="overflow-hidden rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] shadow-[var(--shadow-card)] transition duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-hover)]">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-[var(--bg-primary)]">
          {image ? (
            <img
              src={image}
              alt={categoryName}
              loading="lazy"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-sm text-[var(--text-muted)]">No Image</span>
            </div>
          )}

          {/* Hover Arrow */}
          <div className="absolute bottom-3 right-3 flex h-8 w-8 translate-y-2 items-center justify-center rounded-full bg-orange-500 text-white opacity-0 shadow-md transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <FiArrowRight size={15} />
          </div>
        </div>

        {/* Details */}
        <div className="p-3 text-center sm:p-4">
          <h3 className="truncate text-sm font-semibold text-[var(--text-primary)] transition group-hover:text-orange-500 sm:text-base">
            {categoryName}
          </h3>

          {category.description && (
            <p className="mt-1 line-clamp-1 text-xs text-[var(--text-muted)]">
              {category.description}
            </p>
          )}

          <p className="mt-2 text-[10px] font-semibold text-orange-500 sm:text-xs">
            Explore Now
          </p>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
