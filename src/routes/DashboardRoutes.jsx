import { Route } from "@solidjs/router";
import { lazy } from "solid-js";
import { DashboardLayout } from "@layouts";
import NotFound from "@features/404";

const Home = lazy(() => import("@features/dashboard/pages/Home"));

function DashboardRoutes() {
  return (
    <Route path="/" component={DashboardLayout}>
      <Route path="/" component={Home} />
      {/* Not found route */}
      <Route path="*paramName" component={NotFound} />
    </Route>
  );
}

export default DashboardRoutes;
