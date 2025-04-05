import { Router } from "@solidjs/router";
import { AuthRoutes, DashboardRoutes } from "./routes";
import { ProgressBar } from "./components/ProgressBar";
import { TransProvider } from "@mbarzda/solid-i18next";
import i18nextInstance from "./i18n";
import "solid-devtools";
import { DarkModeProvider } from "./context/DarkModeContext";

function App() {
  return (
    <DarkModeProvider>
      <TransProvider instance={i18nextInstance}>
        <ProgressBar />
        <Router>
          {/* Auth route */}
          <AuthRoutes />
          {/* Dashboard route */}
          <DashboardRoutes />
        </Router>
      </TransProvider>
    </DarkModeProvider>
  );
}

export default App;
