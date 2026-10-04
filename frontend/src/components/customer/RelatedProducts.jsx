import React from "react";
import ProductSection from "./ProductSection";

const RelatedProducts = ({
  products = [],
  loading = false,
  title = "You May Also Like",
  subtitle = "More products you may be interested in",
}) => {
  return (
    <ProductSection
      title={title}
      subtitle={subtitle}
      products={products}
      loading={loading}
      viewAllLink="/mobiles"
      viewAllText="View All"
    />
  );
};

export default RelatedProducts;
