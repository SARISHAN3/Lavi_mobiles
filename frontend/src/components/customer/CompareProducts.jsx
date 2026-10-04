import { useMemo } from "react";
import { FiX } from "react-icons/fi";
import { getProductImage } from "../../config/image";
import PriceDisplay from "./PriceDisplay";
import RatingStars from "./RatingStars";
import EmptyState from "./EmptyState";

const CompareProducts = ({ products = [], onRemove, className = "" }) => {
  const rows = useMemo(
    () => [
      {
        label: "Price",
        render: (product) => (
          <PriceDisplay
            price={product.price}
            mrp={product.mrp}
            discount={product.discount}
            size="sm"
          />
        ),
      },
      {
        label: "Rating",
        render: (product) => (
          <RatingStars
            rating={product.rating || 0}
            reviewCount={product.reviewCount || 0}
            showValue
            size="sm"
          />
        ),
      },
      {
        label: "RAM",
        key: "ram",
      },
      {
        label: "Storage",
        key: "storage",
      },
      {
        label: "Operating System",
        key: "operatingSystem",
      },
      {
        label: "Network",
        key: "network",
      },
      {
        label: "Screen Size",
        key: "screenSize",
      },
      {
        label: "Battery",
        key: "battery",
      },
      {
        label: "Processor",
        key: "processor",
      },
      {
        label: "Camera",
        key: "camera",
      },
    ],
    [],
  );

  if (products.length === 0) {
    return (
      <EmptyState
        title="No products to compare"
        message="Add products to compare their specifications."
      />
    );
  }

  return (
    <div
      className={`overflow-x-auto rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] ${className}`}
    >
      <table className="min-w-[760px] w-full border-collapse">
        <thead>
          <tr className="border-b border-[var(--border-color)]">
            <th className="w-40 px-5 py-5 text-left text-sm font-semibold text-[var(--text-secondary)]">
              Specification
            </th>

            {products.map((product) => {
              const id = product._id || product.id;

              return (
                <th
                  key={id}
                  className="min-w-[190px] border-l border-[var(--border-color)] px-5 py-5 text-left align-top"
                >
                  <div className="relative">
                    {onRemove && (
                      <button
                        type="button"
                        onClick={() => onRemove(product)}
                        aria-label={`Remove ${product.name}`}
                        className="absolute right-0 top-0 flex h-7 w-7 items-center justify-center rounded-full bg-[var(--bg-primary)] text-[var(--text-muted)] transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
                      >
                        <FiX size={15} />
                      </button>
                    )}

                    <div className="flex h-32 items-center justify-center">
                      <img
                        src={getProductImage(product.images)}
                        alt={product.name}
                        className="h-full max-w-full object-contain"
                      />
                    </div>

                    <h3 className="mt-4 pr-6 text-sm font-bold text-[var(--text-primary)]">
                      {product.name}
                    </h3>

                    {product.brand?.name && (
                      <p className="mt-1 text-xs text-orange-500">
                        {product.brand.name}
                      </p>
                    )}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => (
            <tr
              key={row.label}
              className="border-b border-[var(--border-color)] last:border-b-0"
            >
              <td className="px-5 py-4 text-sm font-semibold text-[var(--text-secondary)]">
                {row.label}
              </td>

              {products.map((product) => {
                const value = row.render
                  ? row.render(product)
                  : product[row.key];

                return (
                  <td
                    key={`${product._id || product.id}-${row.label}`}
                    className="border-l border-[var(--border-color)] px-5 py-4 text-sm text-[var(--text-primary)]"
                  >
                    {value || (
                      <span className="text-[var(--text-muted)]">
                        Not available
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CompareProducts;
