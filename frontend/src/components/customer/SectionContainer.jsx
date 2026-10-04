import ResponsiveContainer from "./ResponsiveContainer";

const SectionContainer = ({
  children,
  className = "",
  containerClassName = "",
  spacing = "default",
  background = "none",
}) => {
  const spacingClasses = {
    none: "",
    small: "py-6 sm:py-8",
    default: "py-8 sm:py-10 lg:py-12",
    large: "py-10 sm:py-14 lg:py-16",
  };

  const backgroundClasses = {
    none: "",
    primary: "bg-[var(--bg-primary)]",
    secondary: "bg-[var(--bg-secondary)]",
    card: "bg-[var(--bg-card)]",
    orange: "bg-orange-50 dark:bg-orange-500/5",
  };

  return (
    <section
      className={`${spacingClasses[spacing] || spacingClasses.default} ${
        backgroundClasses[background] || ""
      } ${className}`}
    >
      <ResponsiveContainer className={containerClassName}>
        {children}
      </ResponsiveContainer>
    </section>
  );
};

export default SectionContainer;
