import React from "react";
import { FiSearch } from "react-icons/fi";
import EmptyState from "./EmptyState";

const NoSearchResults = ({ searchTerm = "", onClear }) => {
  return (
    <EmptyState
      icon={<FiSearch size={34} />}
      title="No products found"
      message={
        searchTerm
          ? `We couldn't find any products matching "${searchTerm}". Try a different search term.`
          : "We couldn't find products matching your selected filters."
      }
      buttonText={onClear ? "Clear Search & Filters" : undefined}
      onButtonClick={onClear}
    />
  );
};

export default NoSearchResults;
