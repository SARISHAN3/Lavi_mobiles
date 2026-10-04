import { FiArrowRight, FiClock, FiTag } from "react-icons/fi";
import { getImageUrl } from "../../config/image";
import PriceDisplay from "./PriceDisplay";
import DiscountBadge from "./DiscountBadge";

const OfferCard = ({
  product,
  title,
  description,
  image,
  offerText = "Special Offer",
  expiryText,
  href,
  className = "",
}) => {
  const productImage = image || product?.images?.[0] || product?.image || "";

  const productTitle = title || product?.name || "Special Offer";

  const productDescription = description || product?.description || "";

  const productHref =
    href || (product?._id ? `/product/${product._id}` : "/mobiles");

  const discount = product?.discount || 0;

  return (
    <div
      className={`group overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] transition hover:-translate-y-1 hover:shadow-[var(--shadow-hover)] ${className}`}
    >
      <div className="relative overflow-hidden bg-[var(--bg-primary)]">
        <div className="aspect-[16/10]">
          {productImage ? (
            <img
              src={getImageUrl(productImage)}
              alt={productTitle}
              className="h-full w-full object-contain p-5 transition duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-[var(--text-muted)]">
              No image available
            </div>
          )}
        </div>

        <div className="absolute left-3 top-3">
          <span className="inline-flex items-center gap-1 rounded-full bg-orange-500 px-2.5 py-1 text-[11px] font-bold text-white">
            <FiTag size={12} />
            {offerText}
          </span>
        </div>

        {discount > 0 && (
          <div className="absolute right-3 top-3">
            <DiscountBadge discount={discount} />
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="line-clamp-2 text-sm font-bold text-[var(--text-primary)] sm:text-base">
          {productTitle}
        </h3>

        {productDescription && (
          <p className="mt-1 line-clamp-2 text-xs leading-5 text-[var(--text-secondary)]">
            {productDescription}
          </p>
        )}

        {product?.price !== undefined && (
          <div className="mt-3">
            <PriceDisplay
              price={product.price}
              mrp={product.mrp}
              discount={product.discount}
              size="sm"
            />
          </div>
        )}

        {expiryText && (
          <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-orange-500">
            <FiClock size={14} />
            <span>{expiryText}</span>
          </div>
        )}

        <a
          href={productHref}
          className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-orange-500 transition hover:text-orange-600"
        >
          View Offer
          <FiArrowRight
            size={14}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </a>
      </div>
    </div>
  );
};

export default OfferCard;
