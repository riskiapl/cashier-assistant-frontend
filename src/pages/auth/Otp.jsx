import { createSignal, onMount, createEffect, onCleanup } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { createForm } from "@modular-forms/solid";
import { authService } from "@services/authService";
import { alert } from "@lib/alert";
import { useTransContext, Trans } from "@mbarzda/solid-i18next";
import { useDarkMode } from "@context/DarkModeContext";

const Otp = () => {
  const [loading, setLoading] = createSignal(false);
  const [otpValues, setOtpValues] = createSignal(Array(6).fill(""));
  const [otpInputs, setOtpInputs] = createSignal([]);
  const [expiredAt, setExpiredAt] = createSignal(null);
  const [countdown, setCountdown] = createSignal({ minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = createSignal(false);
  const [email, setEmail] = createSignal("");
  const navigate = useNavigate();
  const [t] = useTransContext();
  const { isDarkMode } = useDarkMode();

  const [_, { Form }] = createForm();

  onMount(() => {
    const otpRequest = JSON.parse(localStorage.getItem("otpRequest") || "null");
    if (otpRequest) {
      setExpiredAt(new Date(otpRequest.expired_at).getTime());
      setEmail(otpRequest.email);
    } else {
      navigate("/auth/login", { replace: true });
    }
  });

  createEffect(() => {
    const expiredTime = expiredAt();

    if (expiredTime) {
      const interval = setInterval(() => {
        const now = new Date().getTime();
        const timeLeft = expiredTime - now;

        if (timeLeft <= 0) {
          clearInterval(interval);
          setIsExpired(true);
          setCountdown({ minutes: 0, seconds: 0 });
        } else {
          const minutes = Math.floor(
            (timeLeft % (1000 * 60 * 60)) / (1000 * 60)
          );
          const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
          setCountdown({ minutes, seconds });
          setIsExpired(false);
        }
      }, 1000);

      onCleanup(() => clearInterval(interval));
    }
  });

  const handleChange = (e, index) => {
    const value = e.target.value;

    if (!/^\d*$/.test(value)) {
      return;
    }

    const newOtpValues = [...otpValues()];

    const lastChar = value.slice(-1);
    newOtpValues[index] = lastChar;

    setOtpValues(newOtpValues);

    if (lastChar && index < 5) {
      setTimeout(() => {
        const nextInput = otpInputs()[index + 1];

        if (nextInput) {
          nextInput.focus();
        }
      }, 0);
    }
  };

  const handleKeyDown = (e, index) => {
    if (
      !/^\d$/.test(e.key) &&
      !["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(e.key)
    ) {
      e.preventDefault();
    }

    if (e.key === "Backspace") {
      if (!otpValues()[index] && index > 0) {
        const newOtpValues = [...otpValues()];
        newOtpValues[index - 1] = "";
        setOtpValues(newOtpValues);
        otpInputs()[index - 1].focus();
      }
    }
  };

  const handleSubmit = async (e) => {
    const otp = otpValues().join("");

    if (isExpired()) {
      handleResendOtp();
      return;
    }

    if (otp.length !== 6) {
      return;
    }

    setLoading(true);

    try {
      const payload = { email: email(), otp_code: otp };
      const res = await authService.verifyOtp(payload);
      alert.success(res?.success);
      localStorage.removeItem("otpRequest");
      navigate("/auth/login", { replace: true });
    } catch (error) {
      console.error("OTP verification failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      const res = await authService.resendOtp({ email: email() });
      alert.success(res.success);
      localStorage.setItem(
        "otpRequest",
        JSON.stringify({ email: email(), expired_at: res.expired_at })
      );
      setExpiredAt(new Date(res.expired_at).getTime());
    } catch (err) {
      handleBackToLogin();
    }
  };

  const handleBackToLogin = async () => {
    if (email()) {
      await authService.deletePendingMember(email());
      navigate("/auth/login", { replace: true });
      localStorage.removeItem("otpRequest");
    } else {
      localStorage.removeItem("otpRequest");
    }
  };

  return (
    <div class="max-w-md w-full space-y-8">
      <div class={titleContainerClass}>
        <h1 class={titleClass(isDarkMode())}>
          <Trans key="otp.title" />
        </h1>
        <p class={`${isDarkMode() ? "text-gray-300" : "text-gray-600"}`}>
          <Trans key="otp.enterCode" />{" "}
          {email() &&
            `${email()[0]}****${email().split("@")[0].at(-1)}@${
              email().split("@")[1]
            }`}
        </p>
      </div>

      <Form onSubmit={handleSubmit} class={formContainerClass(isDarkMode())}>
        <div class="space-y-5">
          <label class={labelClass(isDarkMode())}>
            <Trans key="otp.otpCode" />
          </label>

          <div class="flex justify-between gap-2">
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  class={inputClass(isDarkMode())}
                  value={otpValues()[index]}
                  onInput={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onFocus={(e) => e.target.select()}
                  autocomplete="off"
                  ref={(el) => {
                    const inputs = otpInputs();
                    inputs[index] = el;
                    setOtpInputs(inputs);
                  }}
                />
              ))}
          </div>
        </div>

        <div class={countdownContainerClass}>
          <p class={isExpired() ? countdownExpiredClass : countdownActiveClass}>
            {isExpired() ? (
              <Trans key="otp.otpExpired" />
            ) : (
              t("otp.otpExpires", {
                minutes: String(countdown().minutes).padStart(2, "0"),
                seconds: String(countdown().seconds).padStart(2, "0"),
              })
            )}
          </p>
        </div>

        <button
          type="submit"
          class={submitButtonClass}
          disabled={
            loading() || (!isExpired() && otpValues().join("").length !== 6)
          }
        >
          {isExpired() ? (
            <Trans key="otp.getNewOtp" />
          ) : loading() ? (
            <Trans key="otp.verifying" />
          ) : (
            <Trans key="otp.verify" />
          )}
        </button>

        <div class="text-center mt-4">
          <p
            class={`text-sm ${
              isDarkMode() ? "text-gray-300" : "text-gray-600"
            }`}
          >
            <Trans key="otp.didntReceive" />{" "}
            <button
              type="button"
              onClick={handleResendOtp}
              class={resendButtonClass}
            >
              <Trans key="otp.resendOtp" />
            </button>
          </p>
        </div>

        <div class={backToLoginClass} onClick={handleBackToLogin}>
          <Trans key="otp.backToLogin" />
        </div>
      </Form>
    </div>
  );
};

export default Otp;

const titleContainerClass = "text-center";

const titleClass = (isDark) =>
  `text-4xl font-extrabold ${isDark ? "text-gray-100" : "text-gray-900"} mb-2`;

const formContainerClass = (isDark) =>
  [
    "mt-8 space-y-6",
    isDark ? "bg-gray-800 text-white" : "bg-white",
    "p-8",
    "rounded-2xl shadow-lg",
  ].join(" ");

const labelClass = (isDark) =>
  `block text-sm font-medium ${
    isDark ? "text-gray-200" : "text-gray-700"
  } mb-2`;

const inputClass = (isDark) =>
  [
    "w-12 h-12",
    "text-center text-xl font-semibold",
    isDark ? "bg-gray-700 text-white" : "bg-white text-gray-900",
    isDark ? "border-gray-600" : "border-gray-300",
    "border rounded-md",
    "focus:border-blue-500 focus:outline-none",
  ].join(" ");

const submitButtonClass = [
  "w-full flex justify-center",
  "py-3 px-4 rounded-xl",
  "shadow-sm text-sm font-medium",
  "text-white btn-primary",
].join(" ");

const resendButtonClass = [
  "font-medium",
  "text-blue-600",
  "hover:text-blue-500",
].join(" ");

const backToLoginClass = [
  "text-center mt-2 text-sm",
  "font-medium text-blue-600",
  "hover:text-blue-500 cursor-pointer",
].join(" ");

const countdownContainerClass = ["text-center my-4"].join(" ");

const countdownActiveClass = [
  "text-sm font-medium",
  "py-2 px-4",
  "bg-blue-50",
  "text-blue-700",
  "rounded-lg",
].join(" ");

const countdownExpiredClass = [
  "text-sm font-medium",
  "py-2 px-4",
  "bg-red-50",
  "text-red-700",
  "rounded-lg",
].join(" ");
