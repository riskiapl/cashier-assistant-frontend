import { createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { useAuth } from "@stores/authStore";
import { alert } from "@lib/alert";
import { authService } from "@services/authService";

export default function Login() {
  const [loading, setLoading] = createSignal(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.target);
      const userormail = formData.get("userormail");
      const password = formData.get("password");

      // Validasi input
      if (!userormail || !password) {
        alert.warning("Username/email and password are required");
        setLoading(false);
        return;
      }

      // Using login service instead of direct fetch
      const result = await authService.login({ userormail, password });

      console.log(userormail, password, result, "masuk login response");

      login({
        token: result.data.token,
        user: result.data.user,
      });

      alert.success("Login successful!");
      navigate("/", { replace: true });
    } catch (error) {
      console.log(error, "masuk error login");
      alert.error(
        "Login failed: " + (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="max-w-md w-full space-y-8">
      {/* Welcome Section */}
      <div class="text-center">
        <h1 class="text-4xl font-extrabold text-gray-900 mb-2">
          Welcome Back!
        </h1>
        <p class="text-gray-600">Please sign in to your account</p>
      </div>

      <form
        onSubmit={handleSubmit}
        class="mt-8 space-y-6 bg-white p-8 rounded-2xl shadow-lg"
      >
        <div class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Username or Email
            </label>
            <input
              name="userormail"
              type="text"
              class="block w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:border-blue-500 focus:outline-none transition-colors"
              placeholder="Enter your username or email"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              name="password"
              type="password"
              class="block w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:border-blue-500 focus:outline-none transition-colors"
              placeholder="Enter your password"
            />
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              class="h-4 w-4 text-blue-600 rounded border-gray-300"
            />
            <label for="remember-me" class="ml-2 text-sm text-gray-600">
              Remember me
            </label>
          </div>
          <a
            href="/auth/forgot-password"
            class="text-sm text-blue-600 hover:text-blue-500"
          >
            Forgot password?
          </a>
        </div>

        <button
          type="submit"
          class="w-full flex justify-center py-3 px-4 rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          disabled={loading()}
        >
          {loading() ? "Signing in..." : "Sign in"}
        </button>

        <div class="text-center mt-4">
          <p class="text-sm text-gray-600">
            Don't have an account?{" "}
            <a
              href="/auth/register"
              class="font-medium text-blue-600 hover:text-blue-500"
            >
              Register here
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}
