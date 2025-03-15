import { createSignal, onMount, createEffect } from "solid-js";
import { useNavigate, useSearchParams } from "@solidjs/router";
import { createForm, valiForm } from "@modular-forms/solid";
import FormField from "@components/FormField";
import { authService } from "@services/authService";
import Spinner from "@components/Spinner";
import logoCashierly from "@assets/logo_cashierly.png";
import {
  forgotPasswordSchema,
  resetPasswordSchema,
} from "@utils/validationSchema";
import { alert } from "@lib/alert";

const ResetPassword = () => {
  const [loading, setLoading] = createSignal(false);
  const [success, setSuccess] = createSignal(false);
  const [layout, setLayout] = createSignal("email");
  const [email, setEmail] = createSignal(null);
  const [token, setToken] = createSignal(null);
  const navigate = useNavigate();

  // Check query params for change layout
  const [searchParams] = useSearchParams();

  onMount(() => {
    if (searchParams.token) {
      setLayout("password");
      setEmail(searchParams.email);
      setToken(searchParams.token);
    }
  });

  // Create form with Valibot validation
  const [forgotPasswordForm, { Form, Field }] = createForm({
    validate: (values) => {
      if (layout() === "password") {
        return valiForm(resetPasswordSchema)(values);
      } else {
        return valiForm(forgotPasswordSchema)(values);
      }
    },
  });

  const handleSubmit = async (values) => {
    setLoading(true);

    try {
      if (layout() === "email") {
        // For forgot password flow
        const res = await authService.resetPassword(values);
        alert.success(res?.success);
        setSuccess(true);
      } else if (layout() === "password") {
        // For password change flow
        const payload = {
          token: token(),
          newPassword: values.password,
        };
        const res = await authService.changePassword(payload);
        alert.success(res?.success);
        navigate("/auth/login");
      }
    } catch (error) {
      console.error("Password reset request failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="max-w-md w-full space-y-4">
      <div class="text-center">
        <img src={logoCashierly} alt="Cashierly Logo" class="mx-auto h-48" />
      </div>

      {success() ? (
        <div class={formContainerClass}>
          <h2 class={titleClass}>Check your email</h2>
          <p class="text-center text-gray-600 mb-4">
            We've sent password reset instructions to your email address.
          </p>
          <button
            onClick={() => navigate("/auth/login")}
            class={submitButtonClass}
          >
            Return to login
          </button>
        </div>
      ) : (
        <Form onSubmit={handleSubmit} class={formContainerClass}>
          <h2 class={titleClass}>
            {layout() === "email" ? "Forgot Password" : "Reset Password"}
          </h2>
          <p class="text-center text-gray-600 mb-4">
            {layout() === "email"
              ? "Enter your username or email and we'll send you a link to reset your password."
              : "Enter your new password below."}
          </p>

          <div class="space-y-5">
            {layout() === "email" ? (
              <Field name="email">
                {(field, props) => (
                  <FormField
                    {...props}
                    value={field.value}
                    error={field.error}
                    label="Email"
                    type="text"
                    placeholder="Enter your email"
                  />
                )}
              </Field>
            ) : (
              <>
                <Field name="password">
                  {(field, props) => (
                    <FormField
                      {...props}
                      value={field.value}
                      error={field.error}
                      label="New Password"
                      type="password"
                      placeholder="Enter your new password"
                    />
                  )}
                </Field>
                <Field name="confirmPassword">
                  {(field, props) => (
                    <FormField
                      {...props}
                      value={field.value}
                      error={field.error}
                      label="Confirm Password"
                      type="password"
                      placeholder="Confirm your new password"
                    />
                  )}
                </Field>
                <input type="hidden" name="email" value={email()} />
                <input type="hidden" name="token" value={token()} />
              </>
            )}
          </div>

          <button type="submit" class={submitButtonClass} disabled={loading()}>
            <div class="flex items-center gap-2">
              {loading() && <Spinner />}
              {loading()
                ? "Sending..."
                : layout() === "email"
                ? "Reset Password"
                : "Update Password"}
            </div>
          </button>

          <div class="text-center mt-4">
            <p class="text-sm text-gray-600">
              Remember your password?{" "}
              <a href="/auth/login" class={linkClass}>
                Sign in here
              </a>
            </p>
          </div>
        </Form>
      )}
    </div>
  );
};

export default ResetPassword;

const titleClass = "text-2xl font-bold text-gray-900 text-center";

const formContainerClass = [
  "mt-4 space-y-6",
  "bg-white p-8",
  "rounded-2xl shadow-lg",
].join(" ");

const submitButtonClass = [
  "w-full flex justify-center",
  "py-3 px-4 rounded-xl",
  "shadow-sm text-sm font-medium",
  "text-white bg-blue-600",
  "hover:bg-blue-700",
  "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
  "transition-colors",
].join(" ");

const linkClass = ["font-medium", "text-blue-600", "hover:text-blue-500"].join(
  " "
);
