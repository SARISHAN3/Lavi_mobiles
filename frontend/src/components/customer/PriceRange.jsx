import { useEffect, useState } from "react";

const PriceRange = ({
  min = 0,
  max = 200000,
  value = [min, max],
  onChange,
  step = 1000,
}) => {
  const [localMin, setLocalMin] = useState(value[0]);
  const [localMax, setLocalMax] = useState(value[1]);

  useEffect(() => {
    setLocalMin(value[0]);
    setLocalMax(value[1]);
  }, [value]);

  const handleMinChange = (event) => {
    const nextValue = Math.min(Number(event.target.value), localMax);

    setLocalMin(nextValue);
    onChange?.([nextValue, localMax]);
  };

  const handleMaxChange = (event) => {
    const nextValue = Math.max(Number(event.target.value), localMin);

    setLocalMax(nextValue);
    onChange?.([localMin, nextValue]);
  };

  const handleMinInputChange = (event) => {
    const rawValue = event.target.value;

    if (rawValue === "") {
      setLocalMin("");
      return;
    }

    const nextValue = Math.min(Math.max(Number(rawValue), min), localMax);

    setLocalMin(nextValue);
  };

  const handleMaxInputChange = (event) => {
    const rawValue = event.target.value;

    if (rawValue === "") {
      setLocalMax("");
      return;
    }

    const nextValue = Math.max(Math.min(Number(rawValue), max), localMin);

    setLocalMax(nextValue);
  };

  const handleMinBlur = () => {
    const nextValue =
      localMin === ""
        ? min
        : Math.min(Math.max(Number(localMin), min), localMax);

    setLocalMin(nextValue);
    onChange?.([nextValue, localMax]);
  };

  const handleMaxBlur = () => {
    const nextValue =
      localMax === ""
        ? max
        : Math.max(Math.min(Number(localMax), max), localMin);

    setLocalMax(nextValue);
    onChange?.([localMin, nextValue]);
  };

  const formatPrice = (price) => `₹${Number(price).toLocaleString("en-IN")}`;

  return (
    <div className="space-y-4">
      {/* Range Slider */}
      <div className="space-y-3">
        <div className="relative h-5">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={localMin === "" ? min : localMin}
            onChange={handleMinChange}
            aria-label="Minimum price"
            className="pointer-events-none absolute left-0 top-1/2 z-20 h-1.5 w-full -translate-y-1/2 appearance-none bg-transparent accent-orange-500 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-orange-500"
          />

          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={localMax === "" ? max : localMax}
            onChange={handleMaxChange}
            aria-label="Maximum price"
            className="pointer-events-none absolute left-0 top-1/2 z-10 h-1.5 w-full -translate-y-1/2 appearance-none bg-transparent accent-orange-500 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-orange-500"
          />
        </div>

        <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
          <span>{formatPrice(localMin || min)}</span>
          <span>{formatPrice(localMax || max)}</span>
        </div>
      </div>

      {/* Manual Inputs */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label
            htmlFor="minimum-price"
            className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]"
          >
            Min Price
          </label>

          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[var(--text-muted)]">
              ₹
            </span>

            <input
              id="minimum-price"
              type="number"
              min={min}
              max={max}
              step={step}
              value={localMin}
              onChange={handleMinInputChange}
              onBlur={handleMinBlur}
              className="h-10 w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] pl-7 pr-2 text-sm text-[var(--text-primary)] outline-none transition focus:border-orange-500"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="maximum-price"
            className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]"
          >
            Max Price
          </label>

          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[var(--text-muted)]">
              ₹
            </span>

            <input
              id="maximum-price"
              type="number"
              min={min}
              max={max}
              step={step}
              value={localMax}
              onChange={handleMaxInputChange}
              onBlur={handleMaxBlur}
              className="h-10 w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] pl-7 pr-2 text-sm text-[var(--text-primary)] outline-none transition focus:border-orange-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceRange;
