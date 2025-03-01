import { createSignal, createEffect, onCleanup } from "solid-js";
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
import { debounce } from "@utils/debounce";

export default function Register() {
  const [loading, setLoading] = createSignal(false);
  const [errors, setErrors] = createSignal({});
  const [formValues, setFormValues] = createSignal({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [usernameStatus, setUsernameStatus] = createSignal({
    checking: false,
    available: null,
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

  // Create a debounced function to check username availability
  const checkUsername = debounce(async (username) => {
    try {
      const response = await authService.checkUsername(username);

      // Only update if this is still the current username
      if (formValues().username === username) {
        setUsernameStatus({
          checking: false,
          available: response.available,
        });

        // Update errors if needed
        if (response.available === false) {
          setErrors((prev) => ({
            ...prev,
            username: "Username is already taken",
          }));
        } else if (response.available === true) {
          // Clear the username error if it was set due to availability
          setErrors((prev) => {
            const newErrors = { ...prev };
            if (newErrors.username === "Username is already taken") {
              delete newErrors.username;
            }
            return newErrors;
          });
        }
      }
    } catch (error) {
      console.error("Username check error:", error);

      if (formValues().username === username) {
        setUsernameStatus({
          checking: false,
          available: null,
        });
      }
    }
  }, 1000); // 1 second debounce

  // Track username changes for availability check
  const handleUsernameChange = (e) => {
    const username = e.target.value;
    handleChange(e);

    // Clear status immediately when typing or if username is too short
    if (username.length < 3) {
      setUsernameStatus({
        checking: false,
        available: null,
      });
      return;
    }

    // Set to checking state
    setUsernameStatus({
      checking: true,
      available: null,
    });

    // Use the debounced function
    checkUsername(username);
  };

  // Make sure to clean up the timer when component unmounts
  createEffect(() => {
    return () => {
      if (usernameCheckTimer) {
        clearTimeout(usernameCheckTimer);
      }
    };
  });

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

    // Check if username is already taken
    if (usernameStatus().available === false) {
      setErrors((prev) => ({ ...prev, username: "Username is already taken" }));
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

          <div>
            <div class="relative">
              <FormField
                label="Username"
                name="username"
                type="text"
                value={formValues().username}
                error={errors().username}
                onBlur={handleBlur}
                onInput={handleUsernameChange}
                placeholder="Choose a username"
              />

              {/* Status indicator icon with improved rendering logic */}
              {formValues().username.length >= 3 && (
                <div class="absolute right-3 top-[38px]">
                  {usernameStatus().checking ? (
                    <svg
                      class="animate-spin h-5 w-5 text-gray-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        class="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        stroke-width="4"
                      ></circle>
                      <path
                        class="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : usernameStatus().available === true ? (
                    <svg
                      class="h-5 w-5 text-green-500"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  ) : usernameStatus().available === false ? (
                    <svg
                      class="h-5 w-5 text-red-500"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  ) : null}
                </div>
              )}
            </div>
          </div>

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
      </form>
    </div>
  );
}
