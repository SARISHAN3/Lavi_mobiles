import { useState } from "react";
import { Link } from "react-router-dom";
import AuthForm, { AuthInput } from "./AuthForm";

const ForgotPasswordForm = ({
  onSubmit,
  loading = false,
  error = "",
  success = "",
  className = "",
}) => {
  const [email, setEmail] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit?.(email, event);
  };

  return (
    <AuthForm
      title="Forgot Password?"
      subtitle="Enter your email and we'll help you reset your password."
      submitText="Send Reset Link"
      loading={loading}
      error={error}
      onSubmit={handleSubmit}
      className={className}
      footer={
        <Link
          to="/login"
          className="text-sm font-semibold text-orange-500 hover:text-orange-600"
        >
          Back to Login
        </Link>
      }
    >
      {success && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600 dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-400">
          {success}
        </div>
      )}

      <AuthInput
        label="Email"
        type="email"
        value={email}
        onChange={setEmail}
        placeholder="Enter your email"
        required
        autoComplete="email"
      />
    </AuthForm>
  );
};

export default ForgotPasswordForm;
