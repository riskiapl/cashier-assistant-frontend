import { Route } from "@solidjs/router";
import { lazy } from "solid-js";
import { DashboardLayout } from "@layouts";
import NotFound from "@pages/404";
import { PageRoute } from "@components/PageRoute.";

const Home = lazy(() => import("@pages/dashboard/Home"));
const Profile = lazy(() => import("@pages/dashboard/Profile"));
const Products = lazy(() => import("@pages/dashboard/Products"));

function DashboardRoutes() {
  return (
    <Route path="/" component={DashboardLayout}>
      <PageRoute path="/" title="Home" component={Home} />
      <PageRoute path="/profile" title="Profile" component={Profile} />
      <PageRoute path="/products" title="Products" component={Products} />
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
