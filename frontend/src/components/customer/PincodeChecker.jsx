import { useState } from "react";
import { FiCheckCircle, FiMapPin, FiXCircle } from "react-icons/fi";

const PincodeChecker = ({ onCheck, loading = false }) => {
  const [pincode, setPincode] = useState("");
  const [result, setResult] = useState(null);

  const handleChange = (event) => {
    const value = event.target.value.replace(/\D/g, "").slice(0, 6);

    setPincode(value);
    setResult(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (pincode.length !== 6) {
      setResult({
        success: false,
        message: "Please enter a valid 6-digit pincode.",
      });

      return;
    }

    try {
      if (onCheck) {
        const response = await onCheck(pincode);

        setResult(
          response || {
            success: true,
            message: "Delivery is available for this pincode.",
          },
        );

        return;
      }

      // Default frontend check.
      // The backend/API can be connected later without changing the UI.
      setResult({
        success: true,
        message: "Delivery is available for this pincode.",
      });
    } catch (error) {
      setResult({
        success: false,
        message: error?.message || "Unable to check delivery for this pincode.",
      });
    }
  };

  return (
    <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-4">
      <div className="flex items-center gap-2">
        <FiMapPin size={18} className="text-orange-500" />

        <h3 className="text-sm font-semibold text-[var(--text-primary)]">
          Check Delivery Availability
        </h3>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-3 flex flex-col gap-2 sm:flex-row"
      >
        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={pincode}
          onChange={handleChange}
          placeholder="Enter pincode"
          aria-label="Enter pincode"
          className="h-10 flex-1 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] px-3 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-orange-500"
        />

        <button
          type="submit"
          disabled={loading || pincode.length !== 6}
          className="h-10 rounded-lg bg-orange-500 px-5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Checking..." : "Check"}
        </button>
      </form>

      {result && (
        <div
          className={`mt-3 flex items-start gap-2 text-sm ${
            result.success
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"
          }`}
        >
          {result.success ? (
            <FiCheckCircle size={17} className="mt-0.5 shrink-0" />
          ) : (
            <FiXCircle size={17} className="mt-0.5 shrink-0" />
          )}

          <span>{result.message}</span>
        </div>
      )}
    </div>
  );
};

export default PincodeChecker;
