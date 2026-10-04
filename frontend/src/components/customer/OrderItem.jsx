import { Link } from "react-router-dom";
import { getProductImage } from "../../config/image";
import PriceDisplay from "./PriceDisplay";

const OrderItem = ({ item, className = "" }) => {
  if (!item) return null;

  const product = item.product || item;

  const productId = product._id || product.id;

  const image = getProductImage(product.images);

  const quantity = Number(item.quantity) || 1;

  const price = Number(item.price ?? product.price) || 0;

  return (
    <div
      className={`flex gap-4 rounded-xl bg-[var(--bg-primary)] p-3 sm:p-4 ${className}`}
    >
      {productId ? (
        <Link
          to={`/product/${productId}`}
          className="flex h-24 w-20 shrink-0 items-center justify-center rounded-xl bg-[var(--bg-card)] p-2"
        >
          {image ? (
            <img
              src={image}
              alt={product.name || "Product"}
              className="h-full w-full object-contain"
            />
          ) : (
            <span className="text-2xl">📱</span>
          )}
        </Link>
      ) : (
        <div className="flex h-24 w-20 shrink-0 items-center justify-center rounded-xl bg-[var(--bg-card)] p-2">
          {image ? (
            <img
              src={image}
              alt={product.name || "Product"}
              className="h-full w-full object-contain"
            />
          ) : (
            <span className="text-2xl">📱</span>
          )}
        </div>
      )}

      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-orange-500">
          {product.brand?.name || product.brand || ""}
        </p>

        <h3 className="mt-1 text-sm font-bold text-[var(--text-primary)]">
          {product.name || "Product"}
        </h3>

        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--text-muted)]">
          {product.ram && <span>RAM: {product.ram}</span>}

          {product.storage && <span>Storage: {product.storage}</span>}

          <span>Qty: {quantity}</span>
        </div>

        <div className="mt-3">
          <PriceDisplay price={price} size="sm" />
        </div>
      </div>

      <div className="hidden text-right sm:block">
        <p className="text-xs text-[var(--text-muted)]">Total</p>

        <p className="mt-1 text-sm font-bold text-[var(--text-primary)]">
          ₹{(price * quantity).toLocaleString("en-IN")}
        </p>
      </div>
    </div>
  );
};

export default OrderItem;
