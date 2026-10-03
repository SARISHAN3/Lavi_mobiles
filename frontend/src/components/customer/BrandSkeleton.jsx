const BrandSkeleton = ({ count = 6 }) => {
  const skeletonItems = Array.from({ length: count });

  return (
    <>
      {skeletonItems.map((_, index) => (
        <div
          key={index}
          className="flex min-h-32 flex-col items-center justify-center rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5"
        >
          {/* Brand Logo */}
          <div className="h-16 w-16 animate-pulse rounded-full bg-[var(--bg-primary)]" />

          {/* Brand Name */}
          <div className="mt-4 h-4 w-20 animate-pulse rounded bg-[var(--border-color)]" />

          {/* Description */}
          <div className="mt-2 h-3 w-28 animate-pulse rounded bg-[var(--border-color)]" />
        </div>
      ))}
    </>
  );
};

export default BrandSkeleton;
