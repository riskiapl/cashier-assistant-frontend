import { createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { useAuth } from "@stores/authStore";
import { alert } from "@lib/alert";
import { authService } from "@services/authService";
import FormField from "@components/FormField";
import {
  validateForm,
  createInputHandler,
  createBlurHandler,
} from "@utils/authValidation";

export default function Login() {
  const [loading, setLoading] = createSignal(false);
  const [errors, setErrors] = createSignal({});
  const [formValues, setFormValues] = createSignal({
    userormail: "",
    password: "",
  });
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = createInputHandler(setFormValues, setErrors);
  const handleBlur = createBlurHandler(setFormValues, setErrors, "login", () =>
    formValues()
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    const values = formValues();
    const validationErrors = validateForm(values, "login");

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      alert.warning("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      const result = await authService.login(values);
      login(result);

      alert.success("Login successful!");
      navigate("/", { replace: true });
    } catch (error) {
      alert.error(
        "Login failed: " + (error.response?.data?.message || error.message)
      );

      // Handle validation errors from server
      if (error.response?.status === 422 && error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="max-w-md w-full space-y-8">
      {/* Welcome Section */}
      <div class="text-center">
        <h1 class="text-4xl font-extrabold text-gray-900 mb-2">
          Welcome Back!
        </h1>
        <p class="text-gray-600">Please sign in to your account</p>
      </div>

      <form
        onSubmit={handleSubmit}
        class="mt-8 space-y-6 bg-white p-8 rounded-2xl shadow-lg"
      >
        <div class="space-y-5">
          <FormField
            label="Username or Email"
            name="userormail"
            type="text"
            value={formValues().userormail}
            error={errors().userormail}
            onBlur={handleBlur}
            onInput={handleChange}
            placeholder="Enter your username or email"
          />

          <FormField
            label="Password"
            name="password"
            type="password"
            value={formValues().password}
            error={errors().password}
            onBlur={handleBlur}
            onInput={handleChange}
            placeholder="Enter your password"
          />
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              class="h-4 w-4 text-blue-600 rounded border-gray-300"
            />
            <label for="remember-me" class="ml-2 text-sm text-gray-600">
              Remember me
            </label>
          </div>
          <a
            href="/auth/forgot-password"
            class="text-sm text-blue-600 hover:text-blue-500"
          >
            Forgot password?
          </a>
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
              Register here
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}
