import React from "react";
import HomeSection from "./HomeSection";
import ProductGrid from "./ProductGrid";

const BudgetSection = ({
  title = "Best Mobiles Under Budget",
  subtitle = "Great smartphones at great prices",
  products = [],
  loading = false,
  viewAllLink = "/mobiles",
  viewAllText = "View All",
  background = "gray",
  maxItems = 8,
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
      <ProductGrid
        products={visibleProducts}
        loading={loading}
        skeletonCount={8}
      />
    </HomeSection>
  );
};

export default BudgetSection;
