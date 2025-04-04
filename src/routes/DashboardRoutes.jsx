import { Route } from "@solidjs/router";
import { lazy } from "solid-js";
import { DashboardLayout } from "@layouts";
import NotFound from "@pages/404";
import PageRoute from "@components/PageRoute.";
import Suspense from "@components/Suspense";

const Home = lazy(() => import("@pages/dashboard/Home"));
const Profile = lazy(() => import("@pages/dashboard/Profile"));
const Products = lazy(() => import("@pages/dashboard/Products"));

function DashboardRoutes() {
  return (
    <Route path="/" component={DashboardLayout}>
      <PageRoute path="/" title="Home" component={Suspense(Home)} />
      <PageRoute
        path="/profile"
        title="Profile"
        component={Suspense(Profile)}
      />
      <PageRoute
        path="/products"
        title="Products"
        component={Suspense(Products)}
      />
      {/* Not found route */}
      <PageRoute
        path="*paramName"
        title="Page not found"
        component={Suspense(NotFound)}
      />
    </Route>
  );
}

export default DashboardRoutes;
