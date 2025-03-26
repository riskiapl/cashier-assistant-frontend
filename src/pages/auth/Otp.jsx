import { createSignal, onMount, createEffect, onCleanup } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { createForm } from "@modular-forms/solid";
import { authService } from "@services/authService";
import { alert } from "@lib/alert";
import { useTransContext, Trans } from "@mbarzda/solid-i18next";

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

  const [_, { Form }] = createForm();

  onMount(() => {
    // Check if otpRequest exists in localStorage
    const otpRequest = JSON.parse(localStorage.getItem("otpRequest") || "null");
    if (otpRequest) {
      setExpiredAt(new Date(otpRequest.expired_at).getTime());
      setEmail(otpRequest.email);
    } else {
      // No OTP request data found, redirect to login
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

      // Clean up the interval when component unmounts
      onCleanup(() => clearInterval(interval));
    }
  });

  const handleChange = (e, index) => {
    const value = e.target.value;

    // Allow only numbers
    if (!/^\d*$/.test(value)) {
      return;
    }

    // Update OTP values
    const newOtpValues = [...otpValues()];

    // Get only the last entered digit if multiple characters are entered
    const lastChar = value.slice(-1);
    newOtpValues[index] = lastChar;

    setOtpValues(newOtpValues);

    // Move focus to next input if a digit was entered
    if (lastChar && index < 5) {
      // Use setTimeout to ensure DOM updates before focusing
      setTimeout(() => {
        const nextInput = otpInputs()[index + 1];

        if (nextInput) {
          nextInput.focus();
        }
      }, 0);
    }
  };

  const handleKeyDown = (e, index) => {
    // Block non-numeric key inputs (except for control keys)
    if (
      !/^\d$/.test(e.key) &&
      !["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(e.key)
    ) {
      e.preventDefault();
    }

    // Handle backspace
    if (e.key === "Backspace") {
      if (!otpValues()[index] && index > 0) {
        // Focus previous input if current is empty
        const newOtpValues = [...otpValues()];
        newOtpValues[index - 1] = "";
        setOtpValues(newOtpValues);
        otpInputs()[index - 1].focus();
      }
    }
  };

  const handleSubmit = async (e) => {
    const otp = otpValues().join("");

    // If OTP is expired, call resend function instead
    if (isExpired()) {
      handleResendOtp();
      return;
    }

    // Validate if OTP is complete
    if (otp.length !== 6) {
      return;
    }

    setLoading(true);

    try {
      // Call OTP verification API
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
    // Call resend OTP API
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

      // Redirect to login page
      navigate("/auth/login", { replace: true });
      localStorage.removeItem("otpRequest");
    } else {
      localStorage.removeItem("otpRequest");
    }
  };

  return (
    <div class="max-w-md w-full space-y-8">
      <div class={titleContainerClass}>
        <h1 class={titleClass}>
          <Trans key="otp.title" />
        </h1>
        <p class="text-gray-600">
          <Trans key="otp.enterCode" />{" "}
          {email() &&
            `${email()[0]}****${email().split("@")[0].at(-1)}@${
              email().split("@")[1]
            }`}
        </p>
      </div>

      <Form onSubmit={handleSubmit} class={formContainerClass}>
        <div class="space-y-5">
          <label class={labelClass}>
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
                  class={inputClass}
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

        {/* OTP Countdown Timer */}
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
          <p class="text-sm text-gray-600">
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

const titleClass = "text-4xl font-extrabold text-gray-900 mb-2";

const formContainerClass = [
  "mt-8 space-y-6",
  "bg-white p-8",
  "rounded-2xl shadow-lg",
].join(" ");

const labelClass = "block text-sm font-medium text-gray-700 mb-2";

const inputClass = [
  "w-12 h-12",
  "text-center text-xl font-semibold",
  "border border-gray-300 rounded-md",
  "focus:border-primary-500 focus:outline-none",
].join(" ");

const submitButtonClass = [
  "w-full flex justify-center",
  "py-3 px-4 rounded-xl",
  "shadow-sm text-sm font-medium",
  "text-white bg-primary-500",
  "hover:bg-primary-400",
  "focus:outline-none focus:ring-2",
  "focus:ring-offset-2 focus:ring-primary-500",
  "transition-colors cursor-pointer",
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
