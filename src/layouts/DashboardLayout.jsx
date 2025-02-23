import { useNavigate } from "@solidjs/router";
import { useAuth } from "../stores/authStore";
import { onMount } from "solid-js";

export default function DashboardLayout(props) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  onMount(() => {
    const auth = localStorage.getItem("auth");
    if (!auth) {
      navigate("/auth/login", { replace: true });
    }
  });

  return (
    <div class="h-screen bg-gray-50">
      <nav class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex-shrink-0 flex items-center">
              <h1 class="text-xl font-bold">Dashboard</h1>
            </div>
            <button
              onClick={handleLogout}
              class="ml-4 px-4 py-2 text-sm text-red-600 hover:text-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
      <main class="h-[calc(100vh-4rem)] max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {props.children}
      </main>
    </div>
  );
}
