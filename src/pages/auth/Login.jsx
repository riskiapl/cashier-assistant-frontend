import { createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { createForm, valiForm } from "@modular-forms/solid";
import { useAuth } from "@stores/authStore";
import FormField from "@components/FormField";
import { loginSchema } from "@utils/validationSchema";
import { authService } from "@services/authService";
import Spinner from "@components/Spinner";
import logoCashierly from "@assets/logo_cashierly.png";
import { useTransContext, Trans } from "@mbarzda/solid-i18next";
import { alert } from "@lib/alert";

const Login = () => {
  const [loading, setLoading] = createSignal(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const [t] = useTransContext();

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
              <a href="/auth/reset-password" class={linkClass}>
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
          <p class="text-sm text-gray-600">
            <Trans key="login.noAccount" />{" "}
            <a href="/auth/register" class={linkClass}>
              <Trans key="login.signUp" />
            </a>
          </p>
        </div>
      </Form>
    </div>
  );
};

export default Login;

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
