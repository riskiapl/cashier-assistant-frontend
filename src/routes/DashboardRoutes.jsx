import { Route } from "@solidjs/router";
import { lazy } from "solid-js";
import { DashboardLayout } from "@layouts";
import NotFound from "@pages/404";
import { PageRoute } from "@components/PageRoute.";

const Home = lazy(() => import("@pages/dashboard/Home"));

function DashboardRoutes() {
  return (
    <Route path="/" component={DashboardLayout}>
      <PageRoute path="/" title="Home" component={Home} />
      {/* Not found route */}
      <PageRoute
        path="*paramName"
        title="Page not found"
        component={NotFound}
      />
    </Route>
  );
}

export default DashboardRoutes;
