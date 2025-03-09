import { Router } from "@solidjs/router";
import { AuthRoutes, DashboardRoutes } from "./routes";
import "solid-devtools";

function App() {
  return (
    <Router>
      {/* Auth route */}
      <AuthRoutes />
      {/* Dashboard route */}
      <DashboardRoutes />
    </Router>
  );
}

export default App;
