import React from "react";
import ProductSection from "./ProductSection";

const BestSellers = ({
  products = [],
  loading = false,
  title = "Best Sellers",
  subtitle = "Our most popular smartphones",
}) => {
  return (
    <ProductSection
      title={title}
      subtitle={subtitle}
      products={products}
      loading={loading}
      viewAllLink="/mobiles?sort=popular"
      viewAllText="View All"
      background="gray"
    />
  );
};

export default BestSellers;
