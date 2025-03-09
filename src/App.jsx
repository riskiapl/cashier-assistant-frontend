import { Router } from "@solidjs/router";
import { AuthRoutes, DashboardRoutes } from "./routes";
import { ProgressBar } from "./components/ProgressBar";
import "solid-devtools";

function App() {
  return (
    <>
      <ProgressBar />
      <Router>
        {/* Auth route */}
        <AuthRoutes />
        {/* Dashboard route */}
        <DashboardRoutes />
      </Router>
    </>
  );
}

export default App;
