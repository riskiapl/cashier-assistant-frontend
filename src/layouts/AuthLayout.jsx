import { onMount } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { useAuth } from "@stores/authStore";

function AuthLayout(props) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  onMount(() => {
    if (isAuthenticated()) {
      navigate("/", { replace: true });
    }
  });

  return (
    <div class="min-h-screen bg-gray-100 flex items-center justify-center">
      <div class="max-w-md w-full p-6">{props.children}</div>
    </div>
  );
}

export default AuthLayout;
