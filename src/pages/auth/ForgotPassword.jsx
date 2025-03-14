import { createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { createForm, valiForm } from "@modular-forms/solid";
import FormField from "@components/FormField";
import { authService } from "@services/authService";
import Spinner from "@components/Spinner";
import logoCashierly from "@assets/logo_cashierly.png";
import { forgotPasswordSchema } from "@utils/validationSchema";

const ForgotPassword = () => {
  const [loading, setLoading] = createSignal(false);
  const [success, setSuccess] = createSignal(false);
  const navigate = useNavigate();

  // Create form with Valibot validation
  const [forgotPasswordForm, { Form, Field }] = createForm({
    validate: valiForm(forgotPasswordSchema),
  });

  const handleSubmit = async (values) => {
    setLoading(true);

    try {
      // Replace with actual forgot password service call
      await authService.forgotPassword(values);
      setSuccess(true);
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
          <h2 class={titleClass}>Forgot Password</h2>
          <p class="text-center text-gray-600 mb-4">
            Enter your username or email and we'll send you a link to reset your
            password.
          </p>

          <div class="space-y-5">
            <Field name="userormail">
              {(field, props) => (
                <FormField
                  {...props}
                  value={field.value}
                  error={field.error}
                  label="Username or Email"
                  type="text"
                  placeholder="Enter your username or email"
                />
              )}
            </Field>
          </div>

          <button type="submit" class={submitButtonClass} disabled={loading()}>
            <div class="flex items-center gap-2">
              {loading() && <Spinner />}
              {loading() ? "Sending..." : "Reset Password"}
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

export default ForgotPassword;

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
