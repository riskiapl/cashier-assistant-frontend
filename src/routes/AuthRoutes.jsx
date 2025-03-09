import { Route } from "@solidjs/router";
import { lazy } from "solid-js";
import { AuthLayout } from "@layouts";

const Login = lazy(() => import("@features/auth/pages/Login"));
const Register = lazy(() => import("@features/auth/pages/Register"));
const Otp = lazy(() => import("@features/auth/pages/Otp"));

function AuthRoutes() {
  return (
    <Route path="/auth" component={AuthLayout}>
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/otp" component={Otp} />
    </Route>
  );
}

export default AuthRoutes;
