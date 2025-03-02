import { createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { createForm, required, minLength } from "@modular-forms/solid";
import { useAuth } from "@stores/authStore";
import { alert } from "@lib/alert";
import FormField from "@components/FormField";

export default function Login() {
  const [loading, setLoading] = createSignal(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  // Create form with validation - javascript version
  const [loginForm, { Form, Field }] = createForm();

  const handleSubmit = async (values) => {
    setLoading(true);

    try {
      await login(values.userormail, values.password);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      alert.error(
        "Login failed: " + (error.response?.data?.message || error.message)
      );

      // Handle invalid credentials directly in the component
      if (error.response?.status === 401) {
        loginForm.setError("password", "Invalid username/email or password");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <h1 class="text-4xl font-extrabold text-gray-900 mb-2">Welcome Back</h1>
        <p class="text-gray-600">Sign in to continue</p>
      </div>

      <Form
        onSubmit={handleSubmit}
        class="mt-8 space-y-6 bg-white p-8 rounded-2xl shadow-lg"
      >
        <div class="space-y-5">
          <Field
            name="userormail"
            validate={required("Please enter your username or email.")}
          >
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

          <Field
            name="password"
            validate={[
              required("Please enter your password."),
              minLength(8, "Password must be at least 8 characters."),
            ]}
          >
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
            <div class="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label for="remember-me" class="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div class="text-sm">
              <a
                href="/auth/forgot-password"
                class="font-medium text-blue-600 hover:text-blue-500"
              >
                Forgot password?
              </a>
            </div>
          </div>
        </div>

        <button
          type="submit"
          class="w-full flex justify-center py-3 px-4 rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          disabled={loading()}
        >
          {loading() ? "Signing in..." : "Sign in"}
        </button>

        <div class="text-center mt-4">
          <p class="text-sm text-gray-600">
            Don't have an account?{" "}
            <a
              href="/auth/register"
              class="font-medium text-blue-600 hover:text-blue-500"
            >
              Sign up here
            </a>
          </p>
        </div>
      </Form>
    </div>
  );
}
