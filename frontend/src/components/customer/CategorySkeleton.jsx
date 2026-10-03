const CategorySkeleton = ({ count = 6 }) => {
  const skeletonItems = Array.from({ length: count });

  return (
    <>
      {skeletonItems.map((_, index) => (
        <div
          key={index}
          className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4"
        >
          {/* Category Image */}
          <div className="mx-auto aspect-square w-full max-w-32 animate-pulse rounded-full bg-[var(--bg-primary)]" />

          {/* Category Name */}
          <div className="mx-auto mt-4 h-4 w-20 animate-pulse rounded bg-[var(--border-color)]" />

          {/* Description */}
          <div className="mx-auto mt-2 h-3 w-28 animate-pulse rounded bg-[var(--border-color)]" />
        </div>
      ))}
    </>
  );
};

export default CategorySkeleton;
