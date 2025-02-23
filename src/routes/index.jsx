import { lazy } from "solid-js";
import { Route } from "@solidjs/router";
import AuthLayout from "@layouts/AuthLayout";

const Login = lazy(() => import("@features/auth/pages/Login"));

export default function AppRoutes() {
  return (
    <Route path="/" component={AuthLayout}>
      <Route path="/login" component={Login} />
    </Route>
  );
}
