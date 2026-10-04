import {
  FiArrowRight,
  FiClock,
  FiPercent,
  FiShoppingBag,
} from "react-icons/fi";
import { getImageUrl } from "../../config/image";

const DealsBanner = ({
  title = "Exclusive Deals",
  subtitle = "Grab the best offers before they are gone",
  description,
  image,
  buttonText = "View All Deals",
  href = "/mobiles",
  offer = "UP TO 50% OFF",
  expiryText,
  variant = "orange",
  className = "",
}) => {
  const variants = {
    orange: "bg-gradient-to-r from-orange-500 to-orange-600",
    dark: "bg-gradient-to-r from-gray-900 to-gray-800",
    blue: "bg-gradient-to-r from-blue-600 to-blue-700",
    purple: "bg-gradient-to-r from-purple-600 to-purple-700",
    green: "bg-gradient-to-r from-green-600 to-green-700",
  };

  return (
    <section
      className={`relative overflow-hidden rounded-2xl ${
        variants[variant] || variants.orange
      } ${className}`}
    >
      <div className="relative flex min-h-[220px] items-center px-6 py-8 sm:min-h-[250px] sm:px-10 lg:px-14">
        <div className="relative z-10 max-w-xl text-white">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold backdrop-blur-sm">
            <FiPercent size={14} />
            {offer}
          </div>

          <h2 className="mt-3 text-2xl font-extrabold leading-tight sm:text-3xl">
            {title}
          </h2>

          {subtitle && (
            <p className="mt-2 text-sm font-medium text-white/90 sm:text-base">
              {subtitle}
            </p>
          )}

          {description && (
            <p className="mt-2 max-w-lg text-xs leading-5 text-white/75 sm:text-sm">
              {description}
            </p>
          )}

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <a
              href={href}
              className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-xs font-bold text-gray-900 transition hover:bg-gray-100 sm:px-5 sm:text-sm"
            >
              <FiShoppingBag size={15} />
              {buttonText}
              <FiArrowRight size={15} />
            </a>

            {expiryText && (
              <div className="inline-flex items-center gap-1.5 text-xs font-medium text-white/90">
                <FiClock size={14} />
                {expiryText}
              </div>
            )}
          </div>
        </div>

        {image && (
          <div className="absolute right-0 top-0 h-full w-2/5 sm:w-1/3">
            <img
              src={getImageUrl(image)}
              alt={title}
              className="h-full w-full object-contain object-right transition-transform duration-500 hover:scale-105"
              loading="lazy"
            />
          </div>
        )}

        <div className="pointer-events-none absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />

        <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
      </div>
    </section>
  );
};

export default DealsBanner;
