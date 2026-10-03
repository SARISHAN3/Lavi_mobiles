import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";

const SectionTitle = ({
  title,
  subtitle,
  viewAllLink,
  viewAllText = "View All",
  align = "left",
}) => {
  const alignmentClasses = {
    left: "items-start text-left",
    center: "items-center text-center",
  };

  return (
    <div
      className={`mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between ${
        alignmentClasses[align] || alignmentClasses.left
      }`}
    >
      <div className="min-w-0">
        <h2 className="text-xl font-bold text-[var(--text-primary)] sm:text-2xl">
          {title}
        </h2>

        {subtitle && (
          <p className="mt-1.5 max-w-2xl text-sm text-[var(--text-secondary)]">
            {subtitle}
          </p>
        )}
      </div>

      {viewAllLink && (
        <Link
          to={viewAllLink}
          className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-orange-500 transition hover:text-orange-600"
        >
          {viewAllText}
          <FiArrowRight size={16} />
        </Link>
      )}
    </div>
  );
};

export default SectionTitle;
