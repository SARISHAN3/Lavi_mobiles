import React from "react";
import RatingStars from "./RatingStars";
import PriceDisplay from "./PriceDisplay";
import StockStatus from "./StockStatus";
import DiscountBadge from "./DiscountBadge";

const ProductInfo = ({ product }) => {
  if (!product) return null;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        {product.isFeatured && (
          <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
            Featured
          </span>
        )}

        {product.discount > 0 && <DiscountBadge discount={product.discount} />}
      </div>

      <div>
        <p className="mb-1 text-sm text-[var(--text-muted)]">
          {product.brand?.name || product.brand || "Lavi Mobile"}
        </p>

        <h1 className="text-2xl font-bold leading-tight text-[var(--text-primary)] sm:text-3xl">
          {product.name}
        </h1>

        {product.model && (
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            Model: {product.model}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <RatingStars
          rating={product.rating || 0}
          reviewCount={product.reviewCount || 0}
          showValue
        />

        {product.reviewCount > 0 && (
          <span className="text-sm text-[var(--text-secondary)]">
            {product.reviewCount} reviews
          </span>
        )}
      </div>

      <div className="border-y border-[var(--border-color)] py-5">
        <PriceDisplay
          price={product.price}
          mrp={product.mrp}
          discount={product.discount}
          savings={product.mrp - product.price}
          size="lg"
        />
      </div>

      <StockStatus
        stock={product.stock}
        lowStockLimit={product.lowStockLimit}
      />

      {product.description && (
        <div>
          <h2 className="mb-2 text-base font-semibold text-[var(--text-primary)]">
            About this product
          </h2>

          <p className="text-sm leading-6 text-[var(--text-secondary)]">
            {product.description}
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductInfo;
