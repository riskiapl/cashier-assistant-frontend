import { Router } from "@solidjs/router";
import { AuthRoutes, DashboardRoutes } from "./routes";
import { ProgressBar } from "./components/ProgressBar";
import { TransProvider } from "@mbarzda/solid-i18next";
import i18nextInstance from "./i18n";
import "solid-devtools";

function App() {
  return (
    <TransProvider instance={i18nextInstance}>
      <ProgressBar />
      <Router>
        {/* Auth route */}
        <AuthRoutes />
        {/* Dashboard route */}
        <DashboardRoutes />
      </Router>
    </TransProvider>
  );
}

export default App;
