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
} from "@utils/authUtil";

export default function Register() {
  const [loading, setLoading] = createSignal(false);
  const [errors, setErrors] = createSignal({});
  const [formValues, setFormValues] = createSignal({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = createInputHandler(setFormValues, setErrors);
  const handleBlur = createBlurHandler(
    setFormValues,
    setErrors,
    "register",
    () => formValues()
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const values = formValues();
    const validationErrors = validateForm(values, "register");

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      alert.warning("Please fix the errors in the form");
      return;
    }

    setLoading(true);

    try {
      // Call register API
      await authService.register({
        email: values.email,
        username: values.username,
        password: values.password,
      });

      alert.success("Registration successful! Please log in");
      navigate("/auth/login", { replace: true });
    } catch (error) {
      alert.error(
        "Registration failed: " +
          (error.response?.data?.message || error.message)
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
          Create Account
        </h1>
        <p class="text-gray-600">Join us today and get started</p>
      </div>

      <form
        onSubmit={handleSubmit}
        class="mt-8 space-y-6 bg-white p-8 rounded-2xl shadow-lg"
      >
        <div class="space-y-5">
          <FormField
            label="Email"
            name="email"
            type="email"
            value={formValues().email}
            error={errors().email}
            onBlur={handleBlur}
            onInput={handleChange}
            placeholder="Enter your email"
          />

          <FormField
            label="Username"
            name="username"
            type="text"
            value={formValues().username}
            error={errors().username}
            onBlur={handleBlur}
            onInput={handleChange}
            placeholder="Choose a username"
          />

          <FormField
            label="Password"
            name="password"
            type="password"
            value={formValues().password}
            error={errors().password}
            onBlur={handleBlur}
            onInput={handleChange}
            placeholder="Create a password"
          />

          <FormField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formValues().confirmPassword}
            error={errors().confirmPassword}
            onBlur={handleBlur}
            onInput={handleChange}
            placeholder="Confirm your password"
          />
        </div>

        <button
          type="submit"
          class="w-full flex justify-center py-3 px-4 rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          disabled={loading()}
        >
          {loading() ? "Creating Account..." : "Create Account"}
        </button>

        <div class="text-center mt-4">
          <p class="text-sm text-gray-600">
            Already have an account?{" "}
            <a
              href="/auth/login"
              class="font-medium text-blue-600 hover:text-blue-500"
            >
              Sign in here
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}
