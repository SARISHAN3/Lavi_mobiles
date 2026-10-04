import React from "react";
import ProductSection from "./ProductSection";

const RecentlyViewed = ({
  products = [],
  loading = false,
  title = "Recently Viewed",
  subtitle = "Products you viewed recently",
}) => {
  if (!loading && products.length === 0) {
    return null;
  }

  return (
    <ProductSection
      title={title}
      subtitle={subtitle}
      products={products}
      loading={loading}
      viewAllLink="/mobiles"
      viewAllText="Explore More"
      background="gray"
    />
  );
};

export default RecentlyViewed;
