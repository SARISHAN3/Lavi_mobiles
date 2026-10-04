import React from "react";
import ProductSection from "./ProductSection";

const AccessoriesSection = ({
  products = [],
  loading = false,
  title = "Mobile Accessories",
  subtitle = "Everything you need for your devices",
}) => {
  return (
    <ProductSection
      title={title}
      subtitle={subtitle}
      products={products}
      loading={loading}
      viewAllLink="/mobiles?category=accessories"
      viewAllText="View All"
      background="gray"
    />
  );
};

export default AccessoriesSection;
