import { createSignal, onMount } from "solid-js";
import { useNavigate, useSearchParams } from "@solidjs/router";
import { createForm, valiForm } from "@modular-forms/solid";
import FormField from "@components/FormField";
import { authService } from "@services/authService";
import Spinner from "@components/Spinner";
import logoCashierly from "@assets/logo_cashierly.png";
import {
  forgotPasswordSchema,
  resetPasswordSchema,
} from "@utils/validationSchema";
import { alert } from "@lib/alert";
import { useTransContext, Trans } from "@mbarzda/solid-i18next";
import { useDarkMode } from "@context/DarkModeContext";

const ResetPassword = () => {
  const [loading, setLoading] = createSignal(false);
  const [success, setSuccess] = createSignal(false);
  const [layout, setLayout] = createSignal("email");
  const [email, setEmail] = createSignal(null);
  const [token, setToken] = createSignal(null);
  const navigate = useNavigate();
  const [t] = useTransContext();
  const { isDarkMode } = useDarkMode();

  // Check query params for change layout
  const [searchParams] = useSearchParams();

  onMount(() => {
    if (searchParams.token) {
      setLayout("password");
      setEmail(searchParams.email);
      setToken(searchParams.token);
    }
  });

  // Create form with Valibot validation
  const [_, { Form, Field }] = createForm({
    validate: (values) => {
      if (layout() === "password") {
        return valiForm(resetPasswordSchema)(values);
      } else {
        return valiForm(forgotPasswordSchema)(values);
      }
    },
  });

  const handleSubmit = async (values) => {
    setLoading(true);

    try {
      if (layout() === "email") {
        // For forgot password flow
        const res = await authService.resetPassword(values);
        alert.success(res?.success);
        setSuccess(true);
      } else if (layout() === "password") {
        // For password change flow
        const payload = {
          token: token(),
          newPassword: values.password,
        };
        const res = await authService.changePassword(payload);
        alert.success(res?.success);
        navigate("/auth/login");
      }
    } catch (error) {
      console.error("Password reset request failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="max-w-md w-full space-y-4">
      <div class="text-center">
        <img src={logoCashierly} alt="Cashierly Logo" class="mx-auto h-48" />
      </div>

      {success() ? (
        <div class={formContainerClass(isDarkMode())}>
          <h2 class={titleClass(isDarkMode())}>
            <Trans key="resetPassword.checkEmail" />
          </h2>
          <p
            class={`text-center ${
              isDarkMode() ? "text-gray-300" : "text-gray-600"
            } mb-4`}
          >
            <Trans key="resetPassword.emailSent" />
          </p>
          <button
            onClick={() => navigate("/auth/login")}
            class={submitButtonClass}
          >
            <Trans key="resetPassword.returnToLogin" />
          </button>
        </div>
      ) : (
        <Form onSubmit={handleSubmit} class={formContainerClass(isDarkMode())}>
          <h2 class={titleClass(isDarkMode())}>
            {layout() === "email" ? (
              <Trans key="resetPassword.title" />
            ) : (
              <Trans key="resetPassword.resetTitle" />
            )}
          </h2>
          <p
            class={`text-center ${
              isDarkMode() ? "text-gray-300" : "text-gray-600"
            } mb-4`}
          >
            {layout() === "email" ? (
              <Trans key="resetPassword.enterEmailInfo" />
            ) : (
              <Trans key="resetPassword.enterPasswordInfo" />
            )}
          </p>

          <div class="space-y-5">
            {layout() === "email" ? (
              <Field name="email">
                {(field, props) => (
                  <FormField
                    {...props}
                    value={field.value}
                    error={field.error}
                    label={<Trans key="resetPassword.email" />}
                    type="text"
                    placeholder={t("resetPassword.emailPlaceholder")}
                  />
                )}
              </Field>
            ) : (
              <>
                <Field name="password">
                  {(field, props) => (
                    <FormField
                      {...props}
                      value={field.value}
                      error={field.error}
                      label={<Trans key="resetPassword.newPassword" />}
                      type="password"
                      placeholder={t("resetPassword.newPasswordPlaceholder")}
                    />
                  )}
                </Field>
                <Field name="confirmPassword">
                  {(field, props) => (
                    <FormField
                      {...props}
                      value={field.value}
                      error={field.error}
                      label={<Trans key="resetPassword.confirmPassword" />}
                      type="password"
                      placeholder={t(
                        "resetPassword.confirmPasswordPlaceholder"
                      )}
                    />
                  )}
                </Field>
                <input type="hidden" name="email" value={email()} />
                <input type="hidden" name="token" value={token()} />
              </>
            )}
          </div>

          <button type="submit" class={submitButtonClass} disabled={loading()}>
            <div class="flex items-center gap-2">
              {loading() && <Spinner />}
              {loading() ? (
                <Trans key="resetPassword.sending" />
              ) : layout() === "email" ? (
                <Trans key="resetPassword.resetButton" />
              ) : (
                <Trans key="resetPassword.updateButton" />
              )}
            </div>
          </button>

          <div class="text-center mt-4">
            <p
              class={`text-sm ${
                isDarkMode() ? "text-gray-300" : "text-gray-600"
              }`}
            >
              <Trans key="resetPassword.rememberPassword" />{" "}
              <a href="/auth/login" class={linkClass}>
                <Trans key="resetPassword.signInHere" />
              </a>
            </p>
          </div>
        </Form>
      )}
    </div>
  );
};

export default ResetPassword;

const titleClass = (isDark) =>
  `text-2xl font-bold ${
    isDark ? "text-gray-100" : "text-gray-900"
  } text-center`;

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

const linkClass = ["font-medium", "text-blue-600", "hover:text-blue-500"].join(
  " "
);
