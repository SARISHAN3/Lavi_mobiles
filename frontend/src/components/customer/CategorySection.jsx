import React from "react";
import HomeSection from "./HomeSection";
import CategoryCarousel from "./CategoryCarousel";

const CategorySection = ({
  title = "Shop by Category",
  subtitle = "Explore our mobile categories",
  categories = [],
  loading = false,
  viewAllLink = "/mobiles",
  viewAllText = "View All",
  background = "default",
  maxItems = 10,
}) => {
  const visibleCategories = categories.slice(0, maxItems);

  return (
    <HomeSection
      title={title}
      subtitle={subtitle}
      viewAllLink={viewAllLink}
      viewAllText={viewAllText}
      background={background}
    >
      <CategoryCarousel categories={visibleCategories} loading={loading} />
    </HomeSection>
  );
};

export default CategorySection;
