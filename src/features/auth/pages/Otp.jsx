import { createSignal, onMount, createEffect, onCleanup } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { createForm } from "@modular-forms/solid";
import { authService } from "@services/authService";
import { alert } from "@lib/alert";

const Otp = () => {
  const [loading, setLoading] = createSignal(false);
  const [otpValues, setOtpValues] = createSignal(Array(6).fill(""));
  const [otpInputs, setOtpInputs] = createSignal([]);
  const [expiredAt, setExpiredAt] = createSignal(null);
  const [countdown, setCountdown] = createSignal({ minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = createSignal(false);
  const navigate = useNavigate();

  const [otpForm, { Form }] = createForm();

  onMount(() => {
    // Check if otpRequest exists in localStorage
    const otpRequest = JSON.parse(localStorage.getItem("otpRequest") || null);
    if (otpRequest) {
      setExpiredAt(new Date(otpRequest.expired_at).getTime());
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

  const handlePaste = (e) => {
    const pastedData = e.clipboardData.getData("text").trim();
    if (!/^\d+$/.test(pastedData)) return; // Only numbers

    const digits = pastedData.slice(0, 6).split("");

    // Fill available fields with pasted digits
    const newOtpValues = [...otpValues()];
    digits.forEach((digit, idx) => {
      if (idx < 6) newOtpValues[idx] = digit;
    });

    setOtpValues(newOtpValues);

    // Focus the next empty field or the last field
    const nextEmptyIndex = newOtpValues.findIndex((val) => val === "");
    if (nextEmptyIndex !== -1) {
      otpInputs()[nextEmptyIndex].focus();
    } else if (digits.length > 0) {
      // Focus last field if all filled
      otpInputs()[Math.min(digits.length - 1, 5)].focus();
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
      await authService.verifyOtp(otp);
      navigate("/", { replace: true });
    } catch (error) {
      console.error("OTP verification failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    // Call resend OTP API
    const otpEmail = JSON.parse(
      localStorage.getItem("otpRequest") || null
    )?.email;

    const res = await authService.resendOtp({ email: otpEmail });

    if (res?.success) {
      alert.success(res.success);
      localStorage.setItem(
        "otpRequest",
        JSON.stringify({ email: otpEmail, expired_at: res.expired_at })
      );
      setExpiredAt(new Date(res.expired_at).getTime());
    }
  };

  const handleBackToLogin = async () => {
    const otpEmail = JSON.parse(
      localStorage.getItem("otpRequest") || null
    )?.email;

    if (otpEmail) {
      const res = await authService.deletePendingMember(otpEmail);

      if (res?.success) {
        // Redirect to login page
        navigate("/auth/login", { replace: true });
        localStorage.removeItem("otpRequest");
      }
    } else {
      localStorage.removeItem("otpRequest");
    }
  };

  return (
    <div class="max-w-md w-full space-y-8">
      <div class={titleContainerClass}>
        <h1 class={titleClass}>Verify OTP</h1>
        <p class="text-gray-600">Enter the code sent to email</p>
      </div>

      <Form onSubmit={handleSubmit} class={formContainerClass}>
        <div class="space-y-5">
          <label class={labelClass}>OTP Code</label>

          <div class="flex justify-between gap-2" onPaste={handlePaste}>
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
            {isExpired()
              ? "OTP expired. Please request a new one."
              : `OTP expires in: ${String(countdown().minutes).padStart(
                  2,
                  "0"
                )}:${String(countdown().seconds).padStart(2, "0")}`}
          </p>
        </div>

        <button
          type="submit"
          class={submitButtonClass}
          disabled={
            loading() || (!isExpired() && otpValues().join("").length !== 6)
          }
        >
          {isExpired()
            ? "Get new OTP"
            : loading()
            ? "Verifying..."
            : "Verify OTP"}
        </button>

        <div class="text-center mt-4">
          <p class="text-sm text-gray-600">
            Didn't receive the code?{" "}
            <button
              type="button"
              onClick={handleResendOtp}
              class={resendButtonClass}
            >
              Resend OTP
            </button>
          </p>
        </div>

        <div class={backToLoginClass} onClick={handleBackToLogin}>
          Back to login
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
  "focus:border-blue-500 focus:outline-none",
].join(" ");

const submitButtonClass = [
  "w-full flex justify-center",
  "py-3 px-4 rounded-xl",
  "shadow-sm text-sm font-medium",
  "text-white bg-blue-600",
  "hover:bg-blue-700",
  "focus:outline-none focus:ring-2",
  "focus:ring-offset-2 focus:ring-blue-500",
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
