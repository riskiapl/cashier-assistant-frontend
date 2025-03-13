import { onMount } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { useAuth } from "@stores/authStore";

function AuthLayout(props) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  onMount(() => {
    const otpRequest = JSON.parse(localStorage.getItem("otpRequest") || null);
    if (isAuthenticated()) {
      navigate("/", { replace: true });
    } else if (otpRequest) {
      // Check if OTP expiration hasn't passed yet
      const expirationTime = new Date(otpRequest.expired_at).getTime();
      if (expirationTime) {
        navigate("/auth/otp", { replace: true });
      }
    }
  });

  return (
    <div class="min-h-screen bg-gray-100 flex items-center justify-center">
      <div class="max-w-md w-full p-6">{props.children}</div>
    </div>
  );
}

export default AuthLayout;
