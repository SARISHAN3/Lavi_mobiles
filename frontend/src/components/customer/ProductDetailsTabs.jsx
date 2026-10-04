import React, { useState } from "react";
import ProductHighlights from "./ProductHighlights";
import ProductSpecifications from "./ProductSpecifications";

const ProductDetailsTabs = ({
  product,
  warranty = "",
  reviewsContent = null,
  faqContent = null,
}) => {
  const [activeTab, setActiveTab] = useState("highlights");

  const tabs = [
    { id: "highlights", label: "Highlights" },
    { id: "specifications", label: "Specifications" },
    { id: "warranty", label: "Warranty" },
    { id: "reviews", label: "Reviews" },
    { id: "faq", label: "FAQs" },
  ];

  return (
    <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)]">
      <div className="overflow-x-auto border-b border-[var(--border-color)]">
        <div className="flex min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-5 py-4 text-sm font-semibold transition ${
                activeTab === tab.id
                  ? "text-orange-500"
                  : "text-[var(--text-secondary)] hover:text-orange-500"
              }`}
            >
              {tab.label}

              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="p-5">
        {activeTab === "highlights" && (
          <ProductHighlights highlights={product?.highlights} />
        )}

        {activeTab === "specifications" && (
          <ProductSpecifications product={product} />
        )}

        {activeTab === "warranty" && (
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-[var(--text-primary)]">
              Warranty
            </h3>

            <p className="text-sm leading-6 text-[var(--text-secondary)]">
              {warranty ||
                "Warranty information will be provided with the product. Please check the product details before purchase."}
            </p>
          </div>
        )}

        {activeTab === "reviews" && (
          <div>
            {reviewsContent || (
              <p className="text-sm text-[var(--text-secondary)]">
                Customer reviews will appear here.
              </p>
            )}
          </div>
        )}

        {activeTab === "faq" && (
          <div>
            {faqContent || (
              <p className="text-sm text-[var(--text-secondary)]">
                Frequently asked questions will appear here.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsTabs;
