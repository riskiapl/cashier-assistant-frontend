import { createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { createForm, valiForm } from "@modular-forms/solid";
import { useAuth } from "@stores/authStore";
import FormField from "@components/FormField";
import { loginSchema } from "@utils/validationSchema";
import { authService } from "@services/authService";
import Spinner from "@components/Spinner";
import logoCashierly from "@assets/logo_cashierly.png";

const Login = () => {
  const [loading, setLoading] = createSignal(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  // Create form with Valibot validation
  const [loginForm, { Form, Field }] = createForm({
    validate: valiForm(loginSchema),
  });

  const handleSubmit = async (values) => {
    setLoading(true);

    try {
      const response = await authService.login(values);
      await login(response);
      navigate("/", { replace: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="max-w-md w-full space-y-4">
      <div class="text-center">
        <img src={logoCashierly} alt="Cashierly Logo" class="mx-auto h-48" />
      </div>

      <Form onSubmit={handleSubmit} class={formContainerClass}>
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

          <Field name="password">
            {(field, props) => (
              <FormField
                {...props}
                value={field.value}
                error={field.error}
                label="Password"
                type="password"
                placeholder="Enter your password"
              />
            )}
          </Field>

          <div class="flex items-center justify-between">
            <div />
            <div class="text-sm">
              <a href="/auth/forgot-password" class={linkClass}>
                Forgot password?
              </a>
            </div>
          </div>
        </div>

        <button type="submit" class={submitButtonClass} disabled={loading()}>
          <div class="flex items-center gap-2">
            {loading() && <Spinner />}
            {loading() ? "Signing in..." : "Sign in"}
          </div>
        </button>

        <div class="text-center mt-4">
          <p class="text-sm text-gray-600">
            Don't have an account?{" "}
            <a href="/auth/register" class={linkClass}>
              Sign up here
            </a>
          </p>
        </div>
      </Form>
    </div>
  );
};

export default Login;

const titleClass = "text-4xl font-extrabold text-gray-900 mb-2";

const formContainerClass = [
  "mt-4 space-y-6",
  "bg-white p-8",
  "rounded-2xl shadow-lg",
].join(" ");

const checkboxClass = [
  "h-4 w-4",
  "text-blue-600",
  "focus:ring-blue-500",
  "border-gray-300 rounded",
].join(" ");

const checkboxLabelClass = "ml-2 block text-sm text-gray-900";

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
