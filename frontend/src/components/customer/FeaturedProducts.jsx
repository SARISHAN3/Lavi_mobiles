import React from "react";
import ProductSection from "./ProductSection";

const FeaturedProducts = ({
  products = [],
  loading = false,
  title = "Featured Mobiles",
  subtitle = "Handpicked smartphones for you",
}) => {
  return (
    <ProductSection
      title={title}
      subtitle={subtitle}
      products={products}
      loading={loading}
      viewAllLink="/mobiles?featured=true"
      viewAllText="View All"
      background="gray"
    />
  );
};

export default FeaturedProducts;
