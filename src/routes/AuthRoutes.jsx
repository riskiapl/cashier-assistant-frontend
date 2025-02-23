import { Route } from "@solidjs/router";
import { lazy } from "solid-js";
import { AuthLayout } from "@layouts";
import { useAuth } from "@stores/authStore";

const Login = lazy(() => import("@features/auth/pages/Login"));
const Register = lazy(() => import("@features/auth/pages/Register")); // Add this import

function AuthRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Route
      path="/auth"
      component={AuthLayout}
      guard={() => {
        if (isAuthenticated()) return "/";
        return true;
      }}
    >
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
    </Route>
  );
}

export default AuthRoutes;
