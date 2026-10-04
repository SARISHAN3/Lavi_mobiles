import React from "react";
import ProductSection from "./ProductSection";

const NewArrivals = ({
  products = [],
  loading = false,
  title = "New Arrivals",
  subtitle = "Discover the latest smartphones",
}) => {
  return (
    <ProductSection
      title={title}
      subtitle={subtitle}
      products={products}
      loading={loading}
      viewAllLink="/mobiles?sort=newest"
      viewAllText="View All"
    />
  );
};

export default NewArrivals;
