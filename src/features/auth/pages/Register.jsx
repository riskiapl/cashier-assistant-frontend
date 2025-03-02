import { createSignal, onCleanup } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { createForm, valiForm } from "@modular-forms/solid";
import { useAuth } from "@stores/authStore";
import { alert } from "@lib/alert";
import { authService } from "@services/authService";
import FormField from "@components/FormField";
import { registerSchema } from "@utils/ValidationSchema";
import { debounce } from "@utils/debounce";
// Import solid-icons
import { BiRegularLoader } from "solid-icons/bi";
import { IoCheckmarkCircleSharp, IoCloseCircleSharp } from "solid-icons/io";

export default function Register() {
  const [loading, setLoading] = createSignal(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  // Create form with Valibot validation
  const [registerForm, { Form, Field }] = createForm({
    validate: valiForm(registerSchema),
  });

  const [usernameStatus, setUsernameStatus] = createSignal({
    checking: false,
    available: null,
  });

  // Create a debounced function to check username availability
  const checkUsername = debounce(async (username) => {
    // Skip validation for empty usernames
    if (!username || username.length < 3) return;

    // Now proceed with backend check
    try {
      setUsernameStatus({ checking: true, available: null });
      const response = await authService.checkUsername(username);

      setUsernameStatus({
        checking: false,
        available: response.available,
      });

      // Set form error if username is not available
      if (!response.available) {
        registerForm.setError("username", "Username is already taken");
      } else if (
        registerForm.errors?.username === "Username is already taken"
      ) {
        registerForm.clearError("username");
      }
    } catch (error) {
      alert.error(
        "Username check error: " +
          (error.message || "Failed to verify username availability")
      );

      setUsernameStatus({
        checking: false,
        available: null,
      });
    }
  }, 1000); // 1 second debounce

  // Custom handler for username field to check availability
  const handleUsernameInput = (e) => {
    const username = e.target.value;

    // Clear status immediately when typing or if username is too short
    if (username.length < 3) {
      setUsernameStatus({
        checking: false,
        available: null,
      });
      return;
    }

    // Use the debounced function
    checkUsername(username);
  };

  const handleSubmit = async (values) => {
    // Check if username is already taken
    if (usernameStatus().available === false) {
      alert.warning("Please choose a different username");
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

      // Handle server validation errors
      if (error.response?.status === 422 && error.response?.data?.errors) {
        const serverErrors = error.response.data.errors;
        Object.keys(serverErrors).forEach((key) => {
          registerForm.setError(key, serverErrors[key]);
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Clean up debounce on component unmount
  onCleanup(() => {
    if (checkUsername.cancel) {
      checkUsername.cancel();
    }
  });

  return (
    <div class="max-w-md w-full space-y-8">
      {/* Welcome Section */}
      <div class="text-center">
        <h1 class="text-4xl font-extrabold text-gray-900 mb-2">
          Create Account
        </h1>
        <p class="text-gray-600">Join us today and get started</p>
      </div>

      <Form
        onSubmit={handleSubmit}
        class="mt-8 space-y-6 bg-white p-8 rounded-2xl shadow-lg"
      >
        <div class="space-y-5">
          <Field name="email">
            {(field, props) => (
              <FormField
                {...props}
                value={field.value}
                error={field.error}
                label="Email"
                type="email"
                placeholder="Enter your email"
              />
            )}
          </Field>

          <div class="relative">
            <Field name="username" onInput={handleUsernameInput}>
              {(field, props) => (
                <div>
                  <FormField
                    {...props}
                    value={field.value}
                    error={field.error}
                    label="Username"
                    type="text"
                    placeholder="Choose a username"
                  />

                  {/* Username status indicator */}
                  {field.value?.length >= 3 && (
                    <div class="absolute right-3 top-[38px]">
                      {usernameStatus().checking ? (
                        <BiRegularLoader class="animate-spin h-5 w-5 text-gray-500" />
                      ) : usernameStatus().available === true ? (
                        <IoCheckmarkCircleSharp class="h-5 w-5 text-green-500" />
                      ) : usernameStatus().available === false ? (
                        <IoCloseCircleSharp class="h-5 w-5 text-red-500" />
                      ) : null}
                    </div>
                  )}
                </div>
              )}
            </Field>
          </div>

          <Field name="password">
            {(field, props) => (
              <FormField
                {...props}
                value={field.value}
                error={field.error}
                label="Password"
                type="password"
                placeholder="Create a password"
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
                placeholder="Confirm your password"
              />
            )}
          </Field>
        </div>

        <button
          type="submit"
          class="w-full flex justify-center py-3 px-4 rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          disabled={loading() || usernameStatus().checking}
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
      </Form>
    </div>
  );
}
