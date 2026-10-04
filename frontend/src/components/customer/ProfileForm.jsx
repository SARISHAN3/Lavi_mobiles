import { useEffect, useState } from "react";
import { FiMail, FiPhone, FiSave, FiUser } from "react-icons/fi";

const ProfileForm = ({
  user,
  onSubmit,
  loading = false,
  error = "",
  success = "",
  className = "",
}) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (!user) return;

    setForm({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
    });
  }, [user]);

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
      <div className="mb-6">
        <h2 className="text-lg font-bold text-[var(--text-primary)]">
          Personal Information
        </h2>

        <p className="mt-1 text-xs text-[var(--text-muted)]">
          Update your account details.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600 dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-400">
          {success}
        </div>
      )}

      <div className="space-y-4">
        <Input
          label="Full Name"
          icon={FiUser}
          value={form.name}
          onChange={(value) => updateField("name", value)}
          required
          disabled={loading}
        />

        <Input
          label="Email"
          icon={FiMail}
          type="email"
          value={form.email}
          onChange={(value) => updateField("email", value)}
          required
          disabled={loading}
        />

        <Input
          label="Phone Number"
          icon={FiPhone}
          type="tel"
          value={form.phone}
          onChange={(value) =>
            updateField("phone", value.replace(/\D/g, "").slice(0, 10))
          }
          disabled={loading}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 text-sm font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <FiSave size={17} />

        {loading ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
};

const Input = ({
  label,
  icon: Icon,
  type = "text",
  value,
  onChange,
  required = false,
  disabled = false,
}) => (
  <div>
    <label className="mb-1.5 block text-sm font-medium text-[var(--text-primary)]">
      {label}

      {required && <span className="ml-1 text-red-500">*</span>}
    </label>

    <div className="relative">
      <Icon
        size={17}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
      />

      <input
        type={type}
        value={value || ""}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        disabled={disabled}
        className="h-11 w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] pl-10 pr-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-orange-500 disabled:cursor-not-allowed disabled:opacity-60"
      />
    </div>
  </div>
);

export default ProfileForm;
