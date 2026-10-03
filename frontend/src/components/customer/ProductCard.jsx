import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiHeart,
  FiShoppingCart,
  FiEye,
  FiStar,
  FiCheck,
} from "react-icons/fi";

import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";
import { getProductImage } from "../../config/image";

const ProductCard = ({ product }) => {
  const [addingToCart, setAddingToCart] = useState(false);

  const navigate = useNavigate();

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();

  if (!product) {
    return null;
  }

  const productId = product._id || product.id;

  const productName = product.name || "Mobile Phone";

  const image = getProductImage(product.images);

  const price = Number(product.price || 0);
  const mrp = Number(product.mrp || 0);

  const calculatedDiscount =
    mrp > price && price > 0 ? Math.round(((mrp - price) / mrp) * 100) : 0;

  const discount = Number(product.discount || 0) || calculatedDiscount;

  const rating = Number(product.rating || 0);
  const reviewCount = Number(product.reviewCount || 0);

  const stock = Number(product.stock || 0);

  const outOfStock = stock <= 0;

  const inWishlist = isInWishlist(productId);

  const handleWishlist = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!isAuthenticated) {
      navigate("/login", {
        state: {
          from: `/product/${productId}`,
        },
      });
      return;
    }

    try {
      await toggleWishlist(productId);
    } catch (error) {
      console.error("Wishlist error:", error);
    }
  };

  const handleAddToCart = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (outOfStock || addingToCart) {
      return;
    }

    if (!isAuthenticated) {
      navigate("/login", {
        state: {
          from: `/product/${productId}`,
        },
      });
      return;
    }

    try {
      setAddingToCart(true);
      await addToCart(productId, 1);
    } catch (error) {
      console.error("Add to cart error:", error);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleQuickView = (event) => {
    event.preventDefault();
    event.stopPropagation();

    navigate(`/product/${productId}`);
  };

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] shadow-[var(--shadow-card)] transition duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-hover)]">
      {/* Product Image */}
      <Link
        to={`/product/${productId}`}
        className="relative block overflow-hidden bg-white dark:bg-[#f5f5f5]"
      >
        <div className="aspect-square w-full p-4 sm:p-5">
          {image ? (
            <img
              src={image}
              alt={productName}
              className="h-full w-full object-contain transition duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-sm text-gray-400">No Image</span>
            </div>
          )}
        </div>

        {/* Discount Badge */}
        {discount > 0 && (
          <span className="absolute left-3 top-3 rounded-md bg-orange-500 px-2 py-1 text-[10px] font-bold text-white sm:text-xs">
            {discount}% OFF
          </span>
        )}

        {/* Stock Badge */}
        {outOfStock && (
          <span className="absolute bottom-3 left-3 rounded-md bg-red-500 px-2 py-1 text-[10px] font-semibold text-white sm:text-xs">
            Out of Stock
          </span>
        )}

        {!outOfStock && stock > 0 && stock <= 5 && (
          <span className="absolute bottom-3 left-3 rounded-md bg-amber-500 px-2 py-1 text-[10px] font-semibold text-white sm:text-xs">
            Only {stock} left
          </span>
        )}

        {/* Wishlist */}
        <button
          type="button"
          onClick={handleWishlist}
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md transition dark:bg-[#1d2125] ${
            inWishlist
              ? "text-red-500"
              : "text-gray-500 hover:text-red-500 dark:text-gray-300"
          }`}
        >
          <FiHeart size={18} fill={inWishlist ? "currentColor" : "none"} />
        </button>

        {/* Quick View */}
        <button
          type="button"
          onClick={handleQuickView}
          aria-label="View product"
          className="absolute bottom-3 right-3 hidden h-9 w-9 items-center justify-center rounded-full bg-white text-gray-600 opacity-0 shadow-md transition group-hover:flex group-hover:opacity-100 hover:text-orange-500 dark:bg-[#1d2125] dark:text-gray-300"
        >
          <FiEye size={17} />
        </button>
      </Link>

      {/* Product Information */}
      <div className="flex flex-1 flex-col p-3.5 sm:p-4">
        {/* Brand */}
        {product.brand && (
          <p className="text-[10px] font-semibold uppercase tracking-wide text-orange-500 sm:text-xs">
            {typeof product.brand === "object"
              ? product.brand.name
              : product.brand}
          </p>
        )}

        {/* Name */}
        <Link
          to={`/product/${productId}`}
          className="mt-1.5 line-clamp-2 min-h-[40px] text-sm font-semibold leading-5 text-[var(--text-primary)] transition hover:text-orange-500 sm:text-[15px]"
        >
          {productName}
        </Link>

        {/* Rating */}
        <div className="mt-2 flex min-h-[20px] items-center gap-1.5">
          {rating > 0 ? (
            <>
              <span className="inline-flex items-center gap-1 rounded bg-green-600 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                {rating.toFixed(1)}
                <FiStar size={9} fill="currentColor" />
              </span>

              {reviewCount > 0 && (
                <span className="text-[10px] text-[var(--text-muted)] sm:text-xs">
                  ({reviewCount})
                </span>
              )}
            </>
          ) : (
            <span className="text-[10px] text-[var(--text-muted)]">
              No ratings yet
            </span>
          )}
        </div>

        {/* Specifications */}
        <div className="mt-3 flex min-h-[22px] flex-wrap gap-1.5">
          {product.ram && (
            <span className="rounded bg-[var(--bg-primary)] px-2 py-1 text-[10px] text-[var(--text-secondary)]">
              {product.ram}
            </span>
          )}

          {product.storage && (
            <span className="rounded bg-[var(--bg-primary)] px-2 py-1 text-[10px] text-[var(--text-secondary)]">
              {product.storage}
            </span>
          )}

          {product.network && (
            <span className="rounded bg-[var(--bg-primary)] px-2 py-1 text-[10px] text-[var(--text-secondary)]">
              {product.network}
            </span>
          )}
        </div>

        {/* Price */}
        <div className="mt-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-lg font-bold text-[var(--text-primary)] sm:text-xl">
              ₹{price.toLocaleString("en-IN")}
            </span>

            {mrp > price && (
              <span className="text-xs text-[var(--text-muted)] line-through sm:text-sm">
                ₹{mrp.toLocaleString("en-IN")}
              </span>
            )}
          </div>

          {mrp > price && (
            <p className="mt-1 text-[10px] font-medium text-green-600 dark:text-green-400">
              Save ₹{(mrp - price).toLocaleString("en-IN")}
            </p>
          )}
        </div>

        {/* Add to Cart */}
        <button
          type="button"
          disabled={outOfStock || addingToCart}
          onClick={handleAddToCart}
          className={`mt-auto flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2.5 pt-3 text-xs font-semibold transition sm:text-sm ${
            outOfStock
              ? "cursor-not-allowed bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-500"
              : addingToCart
                ? "cursor-wait bg-orange-400 text-white"
                : "bg-orange-500 text-white hover:bg-orange-600"
          }`}
        >
          {addingToCart ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              Adding...
            </>
          ) : outOfStock ? (
            "Out of Stock"
          ) : (
            <>
              <FiShoppingCart size={16} />
              Add to Cart
            </>
          )}
        </button>

        {/* Added indicator */}
        {!addingToCart && !outOfStock && (
          <div className="mt-2 flex items-center justify-center gap-1 text-[10px] text-[var(--text-muted)]">
            <FiCheck size={11} className="text-green-500" />
            Secure shopping
          </div>
        )}
      </div>
    </article>
  );
};

export default ProductCard;
