import { createSignal, createEffect } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { createForm } from "@modular-forms/solid";
import { authService } from "@services/authService";

export default function Otp() {
  const [loading, setLoading] = createSignal(false);
  const [otpValues, setOtpValues] = createSignal(Array(6).fill(""));
  const [otpInputs, setOtpInputs] = createSignal([]);
  const navigate = useNavigate();

  const [otpForm, { Form }] = createForm();

  createEffect(() => {
    const inputs = otpInputs();
    if (inputs.length > 0) {
      console.log("OTP inputs updated:", inputs);
    }
  });

  createEffect(() => {
    const values = otpValues();
    if (values.length > 0) {
      console.log("OTP values updated:", values);
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
        console.log(nextInput, "masuk nextInput");
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
    e.preventDefault();
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
    e.preventDefault();
    const otp = otpValues().join("");

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
    try {
      // Call resend OTP API
      await authService.resendOtp();
      // Show success message (add toast notification if available)
      console.log("OTP resent successfully");
    } catch (error) {
      console.error("Failed to resend OTP:", error);
    }
  };

  return (
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <h1 class="text-4xl font-extrabold text-gray-900 mb-2">Verify OTP</h1>
        <p class="text-gray-600">Enter the code sent to email</p>
      </div>

      <Form
        onSubmit={handleSubmit}
        class="mt-8 space-y-6 bg-white p-8 rounded-2xl shadow-lg"
      >
        <div class="space-y-5">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            OTP Code
          </label>

          <div class="flex justify-between gap-2" onPaste={handlePaste}>
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  class="w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
                  value={otpValues()[index]}
                  onInput={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onFocus={(e) => e.target.select()}
                  autocomplete="off"
                  ref={(el) => {
                    console.log(otpInputs(), "masuk ref");
                    const inputs = otpInputs();
                    inputs[index] = el;
                    setOtpInputs(inputs);
                  }}
                />
              ))}
          </div>
        </div>

        <button
          type="submit"
          class="w-full flex justify-center py-3 px-4 rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          disabled={loading() || otpValues().join("").length !== 6}
        >
          {loading() ? "Verifying..." : "Verify OTP"}
        </button>

        <div class="text-center mt-4">
          <p class="text-sm text-gray-600">
            Didn't receive the code?{" "}
            <button
              type="button"
              onClick={handleResendOtp}
              class="font-medium text-blue-600 hover:text-blue-500"
            >
              Resend OTP
            </button>
          </p>
        </div>

        <div class="text-center mt-2">
          <a
            href="/auth/login"
            class="text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            Back to login
          </a>
        </div>
      </Form>
    </div>
  );
}
