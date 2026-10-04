import React from "react";
import ProductSection from "./ProductSection";

const TrendingProducts = ({
  products = [],
  loading = false,
  title = "Trending Now",
  subtitle = "Smartphones everyone is talking about",
}) => {
  return (
    <ProductSection
      title={title}
      subtitle={subtitle}
      products={products}
      loading={loading}
      viewAllLink="/mobiles?sort=trending"
      viewAllText="View All"
    />
  );
};

export default TrendingProducts;
