import React from "react";
import ProductSection from "./ProductSection";

const SmartWatchSection = ({
  products = [],
  loading = false,
  title = "Smart Watches",
  subtitle = "Stay connected and track your lifestyle",
}) => {
  return (
    <ProductSection
      title={title}
      subtitle={subtitle}
      products={products}
      loading={loading}
      viewAllLink="/mobiles?category=smart-watches"
      viewAllText="View All"
    />
  );
};

export default SmartWatchSection;
