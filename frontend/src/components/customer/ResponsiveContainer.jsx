const ResponsiveContainer = ({
  children,
  className = "",
  size = "default",
}) => {
  const sizes = {
    small: "max-w-5xl",
    default: "max-w-7xl",
    large: "max-w-[1440px]",
    full: "max-w-none",
  };

  return (
    <div
      className={`mx-auto w-full px-4 sm:px-6 lg:px-8 ${
        sizes[size] || sizes.default
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default ResponsiveContainer;
