import { Router } from "@solidjs/router";
import { AuthRoutes, DashboardRoutes } from "./routes";

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
