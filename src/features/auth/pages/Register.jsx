import { createSignal, createEffect, onCleanup } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { createForm } from "@modular-forms/solid";
import { useAuth } from "@stores/authStore";
import { alert } from "@lib/alert";
import { authService } from "@services/authService";
import FormField from "@components/FormField";
import { registerSchema } from "@utils/zodSchemas";
import { debounce } from "@utils/debounce";
// Import solid-icons
import { BiRegularLoader } from "solid-icons/bi";
import { IoCheckmarkCircleSharp, IoCloseCircleSharp } from "solid-icons/io";

export default function Register() {
  const [loading, setLoading] = createSignal(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  // Create form with Zod validation
  const [registerForm, { Form, Field }] = createForm({
    initialValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
    validate: (values) => {
      try {
        registerSchema.parse(values);
        return {}; // No errors
      } catch (error) {
        // Convert Zod errors to the format expected by @modular-forms/solid
        const errors = {};
        if (error.errors) {
          error.errors.forEach((err) => {
            const field = err.path[0];
            errors[field] = err.message;
          });
        }
        return errors;
      }
    },
  });

  const [usernameStatus, setUsernameStatus] = createSignal({
    checking: false,
    available: null,
  });

  // Create a debounced function to check username availability
  const checkUsername = debounce(async (username) => {
    // First check if username contains only alphanumeric characters
    const isValidFormat = /^[a-zA-Z0-9]+$/.test(username);

    if (!isValidFormat) {
      setUsernameStatus({
        checking: false,
        available: false,
      });

      registerForm.setError("username", {
        message: "No spaces or symbols allowed",
      });
      return; // Stop here, don't check with backend
    }

    // Clear format errors
    if (registerForm.errors?.username === "No spaces or symbols allowed") {
      registerForm.clearError("username");
    }

    // Now proceed with backend check
    try {
      setUsernameStatus({ checking: true, available: null });
      const response = await authService.checkUsername(username);

      setUsernameStatus({
        checking: false,
        available: response.available,
      });

      // Set error if username is not available
      if (!response.available) {
        registerForm.setError("username", {
          message: "Username is already taken",
        });
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

  const handleUsernameInput = (e, setValue) => {
    const username = e.target.value;
    setValue(username);

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

      // Handle validation errors from server
      if (error.response?.status === 422 && error.response?.data?.errors) {
        // Set server validation errors
        const serverErrors = error.response.data.errors;
        Object.keys(serverErrors).forEach((key) => {
          registerForm.setError(key, { message: serverErrors[key] });
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
                label="Email"
                type="email"
                error={field.error}
                placeholder="Enter your email"
                value={field.value || ""}
                onInput={(e) => field.setValue(e.target.value)}
                {...props}
              />
            )}
          </Field>

          <div class="relative">
            <Field name="username">
              {(field, props) => (
                <div>
                  <FormField
                    label="Username"
                    type="text"
                    error={field.error}
                    placeholder="Choose a username"
                    value={field.value || ""}
                    onInput={(e) => handleUsernameInput(e, field.setValue)}
                    {...props}
                  />

                  {/* Status indicator icon with solid-icons */}
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
                label="Password"
                type="password"
                error={field.error}
                placeholder="Create a password"
                value={field.value || ""}
                onInput={(e) => field.setValue(e.target.value)}
                {...props}
              />
            )}
          </Field>

          <Field name="confirmPassword">
            {(field, props) => (
              <FormField
                label="Confirm Password"
                type="password"
                error={field.error}
                placeholder="Confirm your password"
                value={field.value || ""}
                onInput={(e) => field.setValue(e.target.value)}
                {...props}
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
