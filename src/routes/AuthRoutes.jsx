import { Route } from "@solidjs/router";
import { lazy } from "solid-js";
import { AuthLayout } from "@layouts";
import { PageRoute } from "@components/PageRoute.";

const Login = lazy(() => import("@pages/auth/Login"));
const Register = lazy(() => import("@pages/auth/Register"));
const Otp = lazy(() => import("@pages/auth/Otp"));
const ResetPassword = lazy(() => import("@pages/auth/ResetPassword"));

function AuthRoutes() {
  return (
    <Route path="/auth" component={AuthLayout}>
      <PageRoute path="/login" title="Login" component={Login} />
      <PageRoute path="/register" title="Register" component={Register} />
      <PageRoute path="/otp" title="OTP confirmation" component={Otp} />
      <PageRoute
        path="/reset-password"
        title="Reset Password"
        component={ResetPassword}
      />
    </Route>
  );
}

export default AuthRoutes;
