import React from "react";
import HomeSection from "./HomeSection";
import ProductCarousel from "./ProductCarousel";

const ProductSection = ({
  title,
  subtitle,
  products = [],
  loading = false,
  viewAllLink = "",
  viewAllText = "View All",
  background = "default",
  maxItems = 10,
}) => {
  const visibleProducts = products.slice(0, maxItems);

  return (
    <HomeSection
      title={title}
      subtitle={subtitle}
      viewAllLink={viewAllLink}
      viewAllText={viewAllText}
      background={background}
    >
      <ProductCarousel products={visibleProducts} loading={loading} />
    </HomeSection>
  );
};

export default ProductSection;
