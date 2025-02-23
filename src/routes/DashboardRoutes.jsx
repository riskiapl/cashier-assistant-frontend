import { Route } from "@solidjs/router";
import { lazy } from "solid-js";
import { DashboardLayout } from "@layouts";
import { useAuth } from "@stores/authStore";
import NotFound from "@features/404";

const Home = lazy(() => import("@features/dashboard/pages/Home"));

function DashboardRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Route
      path="/"
      component={DashboardLayout}
      guard={() => {
        if (!isAuthenticated()) return "/auth/login";
        return true;
      }}
    >
      <Route path="/" component={Home} />
      {/* Not found route */}
      <Route path="*paramName" component={NotFound} />
    </Route>
  );
}

export default DashboardRoutes;
