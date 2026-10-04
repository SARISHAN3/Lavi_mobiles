import { Link } from "react-router-dom";
import { useState } from "react";
import AuthForm, { AuthInput } from "./AuthForm";

const RegisterForm = ({
  onSubmit,
  loading = false,
  error = "",
  className = "",
}) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [validationError, setValidationError] = useState("");

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    if (validationError) {
      setValidationError("");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (form.password.length < 6) {
      setValidationError("Password must contain at least 6 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setValidationError("Passwords do not match.");
      return;
    }

    onSubmit?.(form, event);
  };

  return (
    <AuthForm
      title="Create Account"
      subtitle="Join Lavi Mobile today"
      submitText="Create Account"
      loading={loading}
      error={validationError || error}
      onSubmit={handleSubmit}
      className={className}
      footer={
        <p className="text-sm text-[var(--text-secondary)]">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-orange-500 hover:text-orange-600"
          >
            Login
          </Link>
        </p>
      }
    >
      <AuthInput
        label="Full Name"
        value={form.name}
        onChange={(value) => updateField("name", value)}
        placeholder="Enter your full name"
        required
        autoComplete="name"
      />

      <AuthInput
        label="Email"
        type="email"
        value={form.email}
        onChange={(value) => updateField("email", value)}
        placeholder="Enter your email"
        required
        autoComplete="email"
      />

      <AuthInput
        label="Phone Number"
        type="tel"
        value={form.phone}
        onChange={(value) =>
          updateField("phone", value.replace(/\D/g, "").slice(0, 10))
        }
        placeholder="Enter your phone number"
        required
        autoComplete="tel"
      />

      <AuthInput
        label="Password"
        type="password"
        value={form.password}
        onChange={(value) => updateField("password", value)}
        placeholder="Create a password"
        required
        autoComplete="new-password"
      />

      <AuthInput
        label="Confirm Password"
        type="password"
        value={form.confirmPassword}
        onChange={(value) => updateField("confirmPassword", value)}
        placeholder="Confirm your password"
        required
        autoComplete="new-password"
      />
    </AuthForm>
  );
};

export default RegisterForm;
