import React from "react";
import SectionContainer from "./SectionContainer";
import SectionTitle from "./SectionTitle";

const HomeSection = ({
  title,
  subtitle,
  children,
  viewAllLink = "",
  viewAllText = "View All",
  className = "",
  background = "default",
}) => {
  const backgroundClasses = {
    default: "bg-transparent",
    white: "bg-white dark:bg-[#181b1f]",
    gray: "bg-gray-50 dark:bg-[#111315]",
  };

  return (
    <SectionContainer
      className={`${backgroundClasses[background] || backgroundClasses.default} ${className}`}
    >
      <SectionTitle
        title={title}
        subtitle={subtitle}
        viewAllLink={viewAllLink}
        viewAllText={viewAllText}
      />

      {children}
    </SectionContainer>
  );
};

export default HomeSection;
