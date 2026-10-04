import { FiTrash2, FiHeart } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { getProductImage } from "../../config/image";
import QuantitySelector from "./QuantitySelector";
import PriceDisplay from "./PriceDisplay";
import StockStatus from "./StockStatus";

const CartItem = ({
  item,
  onUpdateQuantity,
  onRemove,
  onMoveToWishlist,
  loading = false,
  className = "",
}) => {
  const navigate = useNavigate();

  if (!item) return null;

  const product = item.product || item;

  const productId = product._id || product.id;

  const image = getProductImage(product.images);

  const quantity = Number(item.quantity) || 1;

  const price = Number(item.price ?? product.price) || 0;

  const total = price * quantity;

  const stock = Number(product.stock) || 0;

  const maxQuantity = stock > 0 ? stock : quantity;

  const handleProductClick = () => {
    if (productId) {
      navigate(`/product/${productId}`);
    }
  };

  return (
    <article
      className={`rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4 sm:p-5 ${className}`}
    >
      <div className="flex gap-4">
        <button
          type="button"
          onClick={handleProductClick}
          className="flex h-28 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[var(--bg-primary)] p-2 sm:h-32 sm:w-28"
        >
          {image ? (
            <img
              src={image}
              alt={product.name || "Product"}
              className="h-full w-full object-contain"
            />
          ) : (
            <span className="text-3xl">📱</span>
          )}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              {product.brand?.name && (
                <p className="text-xs font-semibold text-orange-500">
                  {product.brand.name}
                </p>
              )}

              <button
                type="button"
                onClick={handleProductClick}
                className="mt-1 text-left text-sm font-bold leading-5 text-[var(--text-primary)] hover:text-orange-500 sm:text-base"
              >
                {product.name || "Product"}
              </button>

              {product.model && (
                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  Model: {product.model}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={() => onRemove?.(productId)}
              disabled={loading}
              aria-label="Remove item"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[var(--text-muted)] transition hover:bg-red-50 hover:text-red-500 disabled:opacity-50 dark:hover:bg-red-500/10"
            >
              <FiTrash2 size={17} />
            </button>
          </div>

          <div className="mt-3">
            <PriceDisplay
              price={price}
              mrp={product.mrp}
              discount={product.discount}
              size="sm"
            />
          </div>

          <div className="mt-3">
            <StockStatus
              stock={product.stock}
              lowStockLimit={product.lowStockLimit}
            />
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <QuantitySelector
              value={quantity}
              min={1}
              max={maxQuantity}
              disabled={loading || stock <= 0}
              onChange={(value) => onUpdateQuantity?.(productId, value)}
              size="sm"
            />

            <div className="text-right">
              <p className="text-xs text-[var(--text-muted)]">Item Total</p>

              <p className="mt-0.5 text-base font-bold text-[var(--text-primary)]">
                ₹{total.toLocaleString("en-IN")}
              </p>
            </div>
          </div>

          {onMoveToWishlist && (
            <button
              type="button"
              onClick={() => onMoveToWishlist(product)}
              disabled={loading}
              className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-[var(--text-secondary)] transition hover:text-orange-500 disabled:opacity-50"
            >
              <FiHeart size={15} />
              Move to Wishlist
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

export default CartItem;
