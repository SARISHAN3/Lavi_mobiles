import React, { useState } from "react";
import { FiHeart, FiShoppingCart, FiZap } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import QuantitySelector from "./QuantitySelector";
import StockStatus from "./StockStatus";

const ProductActions = ({
  product,
  quantity = 1,
  onQuantityChange,
  onAddToCart,
  onBuyNow,
  onToggleWishlist,
  isWishlisted = false,
  loading = false,
}) => {
  const navigate = useNavigate();
  const [actionLoading, setActionLoading] = useState(false);

  if (!product) return null;

  const stock = Number(product.stock || 0);
  const maxQuantity = Math.max(stock, 1);
  const outOfStock = stock <= 0;

  const handleAddToCart = async () => {
    if (outOfStock || !onAddToCart) return;

    try {
      setActionLoading(true);
      await onAddToCart(product, quantity);
    } finally {
      setActionLoading(false);
    }
  };

  const handleBuyNow = async () => {
    if (outOfStock) return;

    if (onBuyNow) {
      try {
        setActionLoading(true);
        await onBuyNow(product, quantity);
      } finally {
        setActionLoading(false);
      }

      return;
    }

    navigate("/checkout", {
      state: {
        buyNow: true,
        product,
        quantity,
      },
    });
  };

  const handleWishlist = async () => {
    if (!onToggleWishlist) return;
    await onToggleWishlist(product);
  };

  return (
    <div className="space-y-5">
      <StockStatus stock={stock} lowStockLimit={product.lowStockLimit} />

      {!outOfStock && (
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-sm font-medium text-[var(--text-primary)]">
            Quantity
          </span>

          <QuantitySelector
            quantity={quantity}
            onChange={onQuantityChange}
            min={1}
            max={maxQuantity}
            disabled={loading || actionLoading}
          />
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={outOfStock || loading || actionLoading}
          className="flex items-center justify-center gap-2 rounded-xl border border-orange-500 px-5 py-3 font-semibold text-orange-500 transition hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-orange-500/10"
        >
          <FiShoppingCart size={19} />
          {actionLoading ? "Please wait..." : "Add to Cart"}
        </button>

        <button
          type="button"
          onClick={handleBuyNow}
          disabled={outOfStock || loading || actionLoading}
          className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <FiZap size={19} />
          Buy Now
        </button>
      </div>

      <button
        type="button"
        onClick={handleWishlist}
        className={`flex w-full items-center justify-center gap-2 rounded-xl border px-5 py-3 font-semibold transition ${
          isWishlisted
            ? "border-red-500 bg-red-50 text-red-500 dark:bg-red-500/10"
            : "border-[var(--border-color)] text-[var(--text-primary)] hover:border-red-400 hover:text-red-500"
        }`}
      >
        <FiHeart size={19} fill={isWishlisted ? "currentColor" : "none"} />

        {isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
      </button>
    </div>
  );
};

export default ProductActions;
