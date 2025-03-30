/* @refresh reload */
import "@unocss/reset/tailwind.css"; // Reset CSS
import "uno.css"; // UnoCSS styles
import { render } from "solid-js/web";
import { registerSW } from "virtual:pwa-register";

import "./index.css";
import App from "./App";

// Register service worker
const updateSW = registerSW({
  onNeedRefresh() {
    // Show a prompt to the user to refresh the app
    if (confirm("New content available. Reload?")) {
      updateSW();
    }
  },
  onOfflineReady() {
    console.log("App ready to work offline");
  },
});

const root = document.getElementById("root");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?"
  );
}

render(() => <App />, root);
