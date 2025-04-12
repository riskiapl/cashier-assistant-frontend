import { createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { createForm, valiForm } from "@modular-forms/solid";
import { useAuth } from "@stores/authStore";
import FormField from "@components/FormField";
import { loginSchema } from "@utils/validationSchema";
import { authService } from "@services/authService";
import Spinner from "@components/Spinner";
import logoCashierly from "@assets/logo_only_color_cashierly.svg";
import { useTransContext, Trans } from "@mbarzda/solid-i18next";
import { alert } from "@lib/alert";
import { useDarkMode } from "@context/DarkModeContext";

const Login = () => {
  const [loading, setLoading] = createSignal(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const [t] = useTransContext();
  const { isDarkMode } = useDarkMode();

  // Create form with Valibot validation
  const [_, { Form, Field }] = createForm({
    validate: valiForm(loginSchema),
  });

  const handleSubmit = async (values) => {
    setLoading(true);

    try {
      const response = await authService.login(values);
      await login(response);
      navigate("/", { replace: true });
      // Show success login alert
      const successMessage = t("login.successMessage");
      alert.success(successMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="space-y-6 flex flex-col">
      <div class="text-center space-y-4 flex flex-col">
        <img src={logoCashierly} alt="Cashierly Logo" class="mx-auto h-48" />
        <span
          class={`text-4xl font-bold ${
            isDarkMode() ? "text-white" : "text-gray-900"
          }`}
        >
          Cashierly
        </span>
      </div>

      <Form onSubmit={handleSubmit} class={formContainerClass(isDarkMode())}>
        <div class="space-y-5">
          <Field name="userormail">
            {(field, props) => (
              <FormField
                {...props}
                value={field.value}
                error={field.error}
                label={<Trans key="login.username" />}
                type="text"
                placeholder={t("login.usernamePlaceholder")}
              />
            )}
          </Field>

          <Field name="password">
            {(field, props) => (
              <FormField
                {...props}
                value={field.value}
                error={field.error}
                label={<Trans key="login.password" />}
                type="password"
                placeholder={t("login.passwordPlaceholder")}
              />
            )}
          </Field>

          <div class="flex items-center justify-between">
            <div />
            <div class="text-sm">
              <a
                href="/auth/reset-password"
                class={
                  isDarkMode()
                    ? "font-medium text-blue-400 hover:text-blue-300"
                    : "font-medium text-blue-600 hover:text-blue-500"
                }
              >
                <Trans key="login.forgotPassword" />
              </a>
            </div>
          </div>
        </div>

        <button type="submit" class={submitButtonClass} disabled={loading()}>
          <div class="flex items-center gap-2">
            {loading() && <Spinner />}
            {loading() ? (
              <Trans key="login.signingIn" />
            ) : (
              <Trans key="login.signIn" />
            )}
          </div>
        </button>

        <div class="text-center mt-4">
          <p
            class={`text-sm ${
              isDarkMode() ? "text-gray-300" : "text-gray-600"
            }`}
          >
            <Trans key="login.noAccount" />{" "}
            <a
              href="/auth/register"
              class={
                isDarkMode()
                  ? "font-medium text-blue-400 hover:text-blue-300"
                  : "font-medium text-blue-600 hover:text-blue-500"
              }
            >
              <Trans key="login.signUp" />
            </a>
          </p>
        </div>
      </Form>
    </div>
  );
};

export default Login;

const formContainerClass = (isDark) =>
  [
    "mt-4 space-y-6",
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
