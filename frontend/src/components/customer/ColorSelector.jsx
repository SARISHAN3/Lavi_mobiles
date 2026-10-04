const ColorSelector = ({
  colors = [],
  selectedColor = "",
  onChange,
  disabled = false,
}) => {
  if (!colors || colors.length === 0) {
    return null;
  }

  const getColorValue = (color) => {
    if (typeof color === "string") {
      return color;
    }

    return color?.value || color?.name || "";
  };

  const getColorName = (color) => {
    if (typeof color === "string") {
      return color;
    }

    return color?.name || color?.value || "";
  };

  const getColorCode = (color) => {
    if (typeof color === "object" && color?.hex) {
      return color.hex;
    }

    const name = getColorName(color).toLowerCase().trim();

    const colorMap = {
      black: "#000000",
      white: "#ffffff",
      red: "#ef4444",
      blue: "#3b82f6",
      green: "#22c55e",
      yellow: "#eab308",
      orange: "#f97316",
      purple: "#a855f7",
      pink: "#ec4899",
      gray: "#6b7280",
      grey: "#6b7280",
      silver: "#c0c0c0",
      gold: "#d4af37",
      brown: "#92400e",
      navy: "#1e3a8a",
      beige: "#d6c6a5",
    };

    return colorMap[name] || "#d1d5db";
  };

  return (
    <div className="flex flex-wrap gap-3">
      {colors.map((color, index) => {
        const value = getColorValue(color);
        const name = getColorName(color);
        const colorCode = getColorCode(color);
        const isSelected = selectedColor === value;

        return (
          <button
            key={`${value}-${index}`}
            type="button"
            onClick={() => onChange?.(value)}
            disabled={disabled}
            title={name}
            aria-label={`Select ${name}`}
            aria-pressed={isSelected}
            className={`group relative flex h-10 w-10 items-center justify-center rounded-full border-2 transition ${
              isSelected
                ? "border-orange-500 ring-2 ring-orange-500/20"
                : "border-[var(--border-color)] hover:border-orange-400"
            } ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
          >
            <span
              className="h-7 w-7 rounded-full border border-black/10 dark:border-white/10"
              style={{
                backgroundColor: colorCode,
              }}
            />

            {isSelected && (
              <span className="absolute inset-0 flex items-center justify-center">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    ["white", "yellow", "silver", "beige"].includes(
                      name.toLowerCase(),
                    )
                      ? "bg-black"
                      : "bg-white"
                  }`}
                />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default ColorSelector;
