import { createSignal, onCleanup } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { createForm, valiForm } from "@modular-forms/solid";
import { useAuth } from "@stores/authStore";
import { alert } from "@lib/alert";
import { authService } from "@services/authService";
import FormField from "@components/FormField";
import { registerSchema } from "@utils/validationSchema";
import { debounce } from "@utils/debounce";
// Import solid-icons
import { IoCheckmarkCircleSharp, IoCloseCircleSharp } from "solid-icons/io";
import Spinner from "@components/Spinner";
import { useTransContext, Trans } from "@mbarzda/solid-i18next";
import { useDarkMode } from "@context/DarkModeContext";

const Register = () => {
  const [loading, setLoading] = createSignal(false);
  const navigate = useNavigate();
  const { register } = useAuth();
  const [t] = useTransContext();
  const { isDarkMode } = useDarkMode();

  // Create form with Valibot validation
  const [_, { Form, Field }] = createForm({
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
    } catch (error) {
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
    }

    // Use the debounced function
    checkUsername(username);
  };

  const handleSubmit = async (values) => {
    // Check if username is already taken
    if (usernameStatus().available === false) {
      alert.warning(messages.chooseDifferentUsername);
      return;
    }

    setLoading(true);

    try {
      // Call register API
      const res = await authService.register({
        email: values.email,
        username: values.username,
        password: values.password,
      });

      localStorage.setItem(
        "otpRequest",
        JSON.stringify({ email: values.email, expired_at: res.expired_at })
      );
      alert.success(res?.success);
      navigate("/auth/otp", { replace: true });
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
      <div class="text-center">
        <h1 class={titleClass(isDarkMode())}>
          <Trans key="register.createAccount" />
        </h1>
        <p class={`${isDarkMode() ? "text-gray-300" : "text-gray-600"}`}>
          <Trans key="register.joinUs" />
        </p>
      </div>

      <Form onSubmit={handleSubmit} class={formContainerClass(isDarkMode())}>
        <div class="space-y-5">
          <Field name="email">
            {(field, props) => (
              <FormField
                {...props}
                value={field.value}
                error={field.error}
                label={<Trans key="register.email" />}
                type="email"
                placeholder={t("register.emailPlaceholder")}
              />
            )}
          </Field>

          <div class="relative">
            <Field name="username">
              {(field, props) => {
                return (
                  <div>
                    <FormField
                      {...props}
                      value={field.value}
                      error={field.error}
                      label={<Trans key="register.username" />}
                      type="text"
                      placeholder={t("register.usernamePlaceholder")}
                      onInput={(e) => {
                        props.onInput(e);
                        handleUsernameInput(e);
                      }}
                    />

                    {/* Username status indicator */}
                    {field.value?.length >= 3 && (
                      <div class="absolute right-3 top-[38px]">
                        {usernameStatus().checking ? (
                          <Spinner color="primary-500" />
                        ) : usernameStatus().available === true ? (
                          <IoCheckmarkCircleSharp class="h-5 w-5 text-green-500" />
                        ) : usernameStatus().available === false ? (
                          <IoCloseCircleSharp class="h-5 w-5 text-red-500" />
                        ) : null}
                      </div>
                    )}
                  </div>
                );
              }}
            </Field>
          </div>

          <Field name="password">
            {(field, props) => (
              <FormField
                {...props}
                value={field.value}
                error={field.error}
                label={<Trans key="register.password" />}
                type="password"
                placeholder={t("register.passwordPlaceholder")}
              />
            )}
          </Field>

          <Field name="confirmPassword">
            {(field, props) => (
              <FormField
                {...props}
                value={field.value}
                error={field.error}
                label={<Trans key="register.confirmPassword" />}
                type="password"
                placeholder={t("register.confirmPasswordPlaceholder")}
              />
            )}
          </Field>
        </div>

        <button
          type="submit"
          class={submitButtonClass}
          disabled={loading() || usernameStatus().checking}
        >
          <div class="flex items-center gap-2">
            {loading() && <Spinner />}
            {loading() ? (
              <Trans key="register.creatingAccount" />
            ) : (
              <Trans key="register.createAccountButton" />
            )}
          </div>
        </button>

        <div class="text-center mt-4">
          <p
            class={`text-sm ${
              isDarkMode() ? "text-gray-300" : "text-gray-600"
            }`}
          >
            <Trans key="register.alreadyHaveAccount" />{" "}
            <a href="/auth/login" class={linkClass(isDarkMode())}>
              <Trans key="register.signInHere" />
            </a>
          </p>
        </div>
      </Form>
    </div>
  );
};

export default Register;

// Add these constants at the bottom of the file
const titleClass = (isDark) =>
  `text-4xl font-extrabold ${isDark ? "text-gray-100" : "text-gray-900"} mb-2`;

const formContainerClass = (isDark) =>
  [
    "mt-8 space-y-6",
    isDark ? "bg-gray-800 text-white" : "bg-white",
    "p-8",
    "rounded-2xl shadow-lg",
  ].join(" ");

const submitButtonClass = [
  "w-full flex justify-center",
  "py-3 px-4 rounded-xl",
  "shadow-sm text-sm font-medium",
  "text-white btn-primary",
].join(" ");

const linkClass = (isDark) =>
  [
    "font-medium",
    isDark
      ? "text-blue-400 hover:text-blue-300"
      : "text-blue-600 hover:text-blue-500",
  ].join(" ");
