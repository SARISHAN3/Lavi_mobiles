import { useEffect, useState } from "react";
import { FiMapPin, FiSave } from "react-icons/fi";

const initialAddress = {
  name: "",
  phone: "",
  street: "",
  city: "",
  state: "",
  pincode: "",
  type: "Home",
};

const AddressForm = ({
  address = null,
  onSubmit,
  onCancel,
  loading = false,
  error = "",
  className = "",
}) => {
  const [form, setForm] = useState(initialAddress);

  useEffect(() => {
    if (address) {
      setForm({
        ...initialAddress,
        ...address,
      });
    } else {
      setForm(initialAddress);
    }
  }, [address]);

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit?.(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5 sm:p-6 ${className}`}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
          <FiMapPin size={19} />
        </div>

        <div>
          <h2 className="text-lg font-bold text-[var(--text-primary)]">
            {address ? "Edit Address" : "Add New Address"}
          </h2>

          <p className="mt-0.5 text-xs text-[var(--text-muted)]">
            Enter your delivery details.
          </p>
        </div>
      </div>

      {error && (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field
          label="Full Name"
          value={form.name}
          onChange={(value) => updateField("name", value)}
          required
          disabled={loading}
        />

        <Field
          label="Phone Number"
          type="tel"
          value={form.phone}
          onChange={(value) =>
            updateField("phone", value.replace(/\D/g, "").slice(0, 10))
          }
          required
          disabled={loading}
        />

        <div className="sm:col-span-2">
          <Field
            label="Street Address"
            value={form.street}
            onChange={(value) => updateField("street", value)}
            required
            disabled={loading}
            placeholder="House / Flat / Street"
          />
        </div>

        <Field
          label="City"
          value={form.city}
          onChange={(value) => updateField("city", value)}
          required
          disabled={loading}
        />

        <Field
          label="State"
          value={form.state}
          onChange={(value) => updateField("state", value)}
          required
          disabled={loading}
        />

        <Field
          label="Pincode"
          value={form.pincode}
          onChange={(value) =>
            updateField("pincode", value.replace(/\D/g, "").slice(0, 6))
          }
          required
          disabled={loading}
        />

        <div>
          <label className="mb-1.5 block text-sm font-medium text-[var(--text-primary)]">
            Address Type
          </label>

          <select
            value={form.type}
            onChange={(event) => updateField("type", event.target.value)}
            disabled={loading}
            className="h-11 w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 text-sm text-[var(--text-primary)] outline-none focus:border-orange-500 disabled:opacity-60"
          >
            <option value="Home">Home</option>

            <option value="Work">Work</option>

            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 text-sm font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <FiSave size={17} />

          {loading ? "Saving..." : address ? "Update Address" : "Save Address"}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="h-11 rounded-xl border border-[var(--border-color)] px-5 text-sm font-semibold text-[var(--text-secondary)] transition hover:border-orange-500 hover:text-orange-500 disabled:opacity-60"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

const Field = ({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  disabled = false,
  placeholder = "",
}) => (
  <div>
    <label className="mb-1.5 block text-sm font-medium text-[var(--text-primary)]">
      {label}

      {required && <span className="ml-1 text-red-500">*</span>}
    </label>

    <input
      type={type}
      value={value || ""}
      onChange={(event) => onChange(event.target.value)}
      required={required}
      disabled={disabled}
      placeholder={placeholder}
      className="h-11 w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-orange-500 disabled:cursor-not-allowed disabled:opacity-60"
    />
  </div>
);

export default AddressForm;
