import { Link } from "react-router-dom";
import { useState } from "react";
import AuthForm, { AuthInput } from "./AuthForm";

const LoginForm = ({
  onSubmit,
  loading = false,
  error = "",
  className = "",
}) => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = (event) => {
    onSubmit?.(form, event);
  };

  return (
    <AuthForm
      title="Welcome Back"
      subtitle="Login to your Lavi Mobile account"
      submitText="Login"
      loading={loading}
      error={error}
      onSubmit={handleSubmit}
      className={className}
      footer={
        <p className="text-sm text-[var(--text-secondary)]">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-orange-500 hover:text-orange-600"
          >
            Create Account
          </Link>
        </p>
      }
    >
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
        label="Password"
        type="password"
        value={form.password}
        onChange={(value) => updateField("password", value)}
        placeholder="Enter your password"
        required
        autoComplete="current-password"
      />

      <div className="flex justify-end">
        <Link
          to="/forgot-password"
          className="text-xs font-semibold text-orange-500 hover:text-orange-600"
        >
          Forgot Password?
        </Link>
      </div>
    </AuthForm>
  );
};

export default LoginForm;
