import ProductCard from "./ProductCard";
import ProductSkeleton from "./ProductSkeleton";
import EmptyState from "./EmptyState";

const ProductGrid = ({
  products = [],
  loading = false,
  skeletonCount = 8,
  emptyTitle = "No products found",
  emptyMessage = "We couldn't find any products matching your selection.",
  emptyType = "products",
  columns = "default",
}) => {
  const columnClasses = {
    default: "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
    compact: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5",
    large: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  };

  if (loading) {
    return (
      <div
        className={`grid gap-4 sm:gap-5 ${
          columnClasses[columns] || columnClasses.default
        }`}
      >
        <ProductSkeleton count={skeletonCount} />
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <EmptyState type={emptyType} title={emptyTitle} message={emptyMessage} />
    );
  }

  return (
    <div
      className={`grid gap-4 sm:gap-5 ${
        columnClasses[columns] || columnClasses.default
      }`}
    >
      {products.map((product) => (
        <ProductCard key={product._id || product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
