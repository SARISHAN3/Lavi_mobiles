import { FiArrowRight } from "react-icons/fi";
import { getImageUrl } from "../../config/image";

const PromoCard = ({
  title,
  subtitle,
  description,
  image,
  imagePosition = "right",
  buttonText = "Shop Now",
  href = "/mobiles",
  variant = "orange",
  className = "",
}) => {
  const variants = {
    orange: "bg-orange-500 text-white",
    dark: "bg-gray-900 text-white dark:bg-gray-800",
    blue: "bg-blue-600 text-white",
    green: "bg-green-600 text-white",
    purple: "bg-purple-600 text-white",
    light:
      "border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-primary)]",
  };

  const isImageRight = imagePosition === "right";

  return (
    <div
      className={`group relative min-h-[180px] overflow-hidden rounded-2xl p-5 sm:min-h-[210px] sm:p-6 ${
        variants[variant] || variants.orange
      } ${className}`}
    >
      <div
        className={`relative z-10 flex h-full items-center ${
          image ? (isImageRight ? "pr-28 sm:pr-40" : "pl-28 sm:pl-40") : ""
        }`}
      >
        <div className="max-w-md">
          {subtitle && (
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide opacity-80">
              {subtitle}
            </p>
          )}

          {title && (
            <h3 className="text-xl font-bold leading-tight sm:text-2xl">
              {title}
            </h3>
          )}

          {description && (
            <p className="mt-2 text-xs leading-5 opacity-85 sm:text-sm">
              {description}
            </p>
          )}

          {buttonText && href && (
            <a
              href={href}
              className={`mt-4 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition sm:text-sm ${
                variant === "light"
                  ? "bg-orange-500 text-white hover:bg-orange-600"
                  : "bg-white text-gray-900 hover:bg-gray-100"
              }`}
            >
              {buttonText}
              <FiArrowRight
                size={15}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </a>
          )}
        </div>
      </div>

      {image && (
        <div
          className={`pointer-events-none absolute inset-y-0 ${
            isImageRight ? "right-0 w-2/5" : "left-0 w-2/5"
          }`}
        >
          <img
            src={getImageUrl(image)}
            alt={title || "Promotion"}
            className="h-full w-full object-contain object-center transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      )}

      <div
        className={`pointer-events-none absolute -bottom-12 h-32 w-32 rounded-full bg-white/10 blur-2xl ${
          isImageRight ? "left-[-20px]" : "right-[-20px]"
        }`}
      />
    </div>
  );
};

export default PromoCard;
