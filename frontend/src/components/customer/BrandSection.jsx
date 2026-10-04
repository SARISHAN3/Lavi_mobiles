import React from "react";
import HomeSection from "./HomeSection";
import BrandCarousel from "./BrandCarousel";

const BrandSection = ({
  title = "Shop by Brand",
  subtitle = "Choose from your favourite mobile brands",
  brands = [],
  loading = false,
  viewAllLink = "/mobiles",
  viewAllText = "View All",
  background = "default",
  maxItems = 12,
}) => {
  const visibleBrands = brands.slice(0, maxItems);

  return (
    <HomeSection
      title={title}
      subtitle={subtitle}
      viewAllLink={viewAllLink}
      viewAllText={viewAllText}
      background={background}
    >
      <BrandCarousel brands={visibleBrands} loading={loading} />
    </HomeSection>
  );
};

export default BrandSection;
