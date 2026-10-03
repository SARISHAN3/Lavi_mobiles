import { Link } from "react-router-dom";
import {
  FiPackage,
  FiShoppingCart,
  FiHeart,
  FiSearch,
  FiFileText,
  FiInbox,
  FiArrowRight,
} from "react-icons/fi";

const EmptyState = ({
  type = "default",
  title,
  message,
  buttonText,
  buttonLink,
  onButtonClick,
}) => {
  const configurations = {
    cart: {
      icon: FiShoppingCart,
      title: "Your cart is empty",
      message:
        "Looks like you haven't added anything to your cart yet. Start shopping and find something you love.",
      buttonText: "Start Shopping",
      buttonLink: "/mobiles",
    },

    wishlist: {
      icon: FiHeart,
      title: "Your wishlist is empty",
      message:
        "Save your favorite products here so you can easily find them later.",
      buttonText: "Explore Products",
      buttonLink: "/mobiles",
    },

    orders: {
      icon: FiPackage,
      title: "No orders yet",
      message:
        "You haven't placed any orders yet. Explore our products and place your first order.",
      buttonText: "Shop Now",
      buttonLink: "/mobiles",
    },

    search: {
      icon: FiSearch,
      title: "No products found",
      message:
        "We couldn't find any products matching your search. Try a different keyword or browse all products.",
      buttonText: "View All Products",
      buttonLink: "/mobiles",
    },

    products: {
      icon: FiInbox,
      title: "No products available",
      message: "There are currently no products available in this section.",
      buttonText: "Go to Mobile Phones",
      buttonLink: "/mobiles",
    },

    default: {
      icon: FiFileText,
      title: "Nothing here yet",
      message: "There is currently no information to display.",
      buttonText: "Go Home",
      buttonLink: "/home",
    },
  };

  const config = configurations[type] || configurations.default;

  const Icon = config.icon;

  const finalTitle = title || config.title;
  const finalMessage = message || config.message;
  const finalButtonText = buttonText || config.buttonText;
  const finalButtonLink =
    buttonLink !== undefined ? buttonLink : config.buttonLink;

  const handleButtonClick = () => {
    if (onButtonClick) {
      onButtonClick();
    }
  };

  return (
    <div className="flex w-full items-center justify-center px-4 py-12">
      <div className="flex max-w-md flex-col items-center text-center">
        {/* Icon */}
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 text-orange-500 dark:bg-orange-500/10 dark:text-orange-400">
          <Icon size={34} strokeWidth={1.7} />
        </div>

        {/* Text */}
        <h2 className="mt-6 text-xl font-bold text-[var(--text-primary)]">
          {finalTitle}
        </h2>

        <p className="mt-2 max-w-sm text-sm leading-6 text-[var(--text-secondary)]">
          {finalMessage}
        </p>

        {/* Button */}
        {(finalButtonLink || onButtonClick) && (
          <>
            {onButtonClick ? (
              <button
                type="button"
                onClick={handleButtonClick}
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
              >
                {finalButtonText}
                <FiArrowRight size={16} />
              </button>
            ) : (
              <Link
                to={finalButtonLink}
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
              >
                {finalButtonText}
                <FiArrowRight size={16} />
              </Link>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
