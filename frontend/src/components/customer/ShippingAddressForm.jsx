import { FiMapPin } from "react-icons/fi";

const ShippingAddressForm = ({
  value = {},
  onChange,
  errors = {},
  disabled = false,
  className = "",
}) => {
  const address = {
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    ...value,
  };

  const updateField = (field, fieldValue) => {
    onChange?.({
      ...address,
      [field]: fieldValue,
    });
  };

  return (
    <section
      className={`rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5 sm:p-6 ${className}`}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
          <FiMapPin size={19} />
        </div>

        <div>
          <h2 className="text-lg font-bold text-[var(--text-primary)]">
            Delivery Address
          </h2>

          <p className="mt-0.5 text-xs text-[var(--text-muted)]">
            Where should we deliver your order?
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field
          label="Full Name"
          value={address.name}
          onChange={(value) => updateField("name", value)}
          error={errors.name}
          disabled={disabled}
          required
        />

        <Field
          label="Phone Number"
          value={address.phone}
          onChange={(value) => updateField("phone", value)}
          error={errors.phone}
          disabled={disabled}
          required
          type="tel"
        />

        <div className="sm:col-span-2">
          <Field
            label="Street Address"
            value={address.street}
            onChange={(value) => updateField("street", value)}
            error={errors.street}
            disabled={disabled}
            required
            placeholder="House / Flat / Street"
          />
        </div>

        <Field
          label="City"
          value={address.city}
          onChange={(value) => updateField("city", value)}
          error={errors.city}
          disabled={disabled}
          required
        />

        <Field
          label="State"
          value={address.state}
          onChange={(value) => updateField("state", value)}
          error={errors.state}
          disabled={disabled}
          required
        />

        <Field
          label="Pincode"
          value={address.pincode}
          onChange={(value) =>
            updateField("pincode", value.replace(/\D/g, "").slice(0, 6))
          }
          error={errors.pincode}
          disabled={disabled}
          required
          type="text"
          inputMode="numeric"
        />
      </div>
    </section>
  );
};

const Field = ({
  label,
  value,
  onChange,
  error,
  disabled,
  required = false,
  type = "text",
  placeholder = "",
  inputMode,
}) => {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-[var(--text-primary)]">
        {label}

        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <input
        type={type}
        value={value || ""}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        inputMode={inputMode}
        className={`h-11 w-full rounded-xl border bg-[var(--bg-primary)] px-3 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] disabled:cursor-not-allowed disabled:opacity-60 ${
          error
            ? "border-red-500 focus:border-red-500"
            : "border-[var(--border-color)] focus:border-orange-500"
        }`}
      />

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default ShippingAddressForm;
