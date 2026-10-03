const ProductSkeleton = ({ count = 1 }) => {
  const skeletonItems = Array.from({ length: count });

  return (
    <>
      {skeletonItems.map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)]"
        >
          {/* Image */}
          <div className="aspect-square animate-pulse bg-[var(--bg-primary)]" />

          <div className="space-y-3 p-4">
            {/* Brand */}
            <div className="h-3 w-16 animate-pulse rounded bg-[var(--border-color)]" />

            {/* Product name */}
            <div className="space-y-2">
              <div className="h-4 w-full animate-pulse rounded bg-[var(--border-color)]" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-[var(--border-color)]" />
            </div>

            {/* Rating */}
            <div className="h-4 w-24 animate-pulse rounded bg-[var(--border-color)]" />

            {/* Price */}
            <div className="h-6 w-28 animate-pulse rounded bg-[var(--border-color)]" />

            {/* Button */}
            <div className="h-10 w-full animate-pulse rounded-lg bg-[var(--border-color)]" />
          </div>
        </div>
      ))}
    </>
  );
};

export default ProductSkeleton;
