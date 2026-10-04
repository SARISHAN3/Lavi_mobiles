import React from "react";

const ProductSpecifications = ({ product }) => {
  if (!product) return null;

  const specifications = [
    ["Brand", product.brand?.name || product.brand],
    ["Model", product.model],
    ["RAM", product.ram],
    ["Storage", product.storage],
    ["Operating System", product.OS || product.operatingSystem],
    ["Network", product.network],
    ["Screen Size", product.screenSize],
    ["Battery", product.battery],
    ["Processor", product.processor],
    ["Camera", product.camera],
    ["Connectivity", product.connectivity],
    ["Compatibility", product.compatibility],
    ["Water Resistance", product.waterResistance],
    ["Battery Life", product.batteryLife],
  ].filter(
    ([, value]) => value !== undefined && value !== null && value !== "",
  );

  if (specifications.length === 0) return null;

  return (
    <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5">
      <h2 className="mb-5 text-lg font-bold text-[var(--text-primary)]">
        Specifications
      </h2>

      <div className="divide-y divide-[var(--border-color)]">
        {specifications.map(([label, value]) => (
          <div
            key={label}
            className="grid grid-cols-1 gap-2 py-3 sm:grid-cols-3"
          >
            <span className="text-sm font-medium text-[var(--text-secondary)]">
              {label}
            </span>

            <span className="text-sm text-[var(--text-primary)] sm:col-span-2">
              {Array.isArray(value) ? value.join(", ") : value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductSpecifications;
