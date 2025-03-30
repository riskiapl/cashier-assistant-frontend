import { Route } from "@solidjs/router";
import { createEffect } from "solid-js";

export default function PageRoute(props) {
  const { path, title, component } = props;

  const RouteComponent = (routeProps) => {
    createEffect(() => {
      document.title = `Cashierly${title ? " | " + title : ""}`;
    });

    const Component = component;
    return <Component {...routeProps} />;
  };

  return <Route path={path} component={RouteComponent} />;
}
