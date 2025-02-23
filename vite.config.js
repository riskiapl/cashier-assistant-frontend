import { defineConfig, loadEnv } from "vite";
import solidPlugin from "vite-plugin-solid";
import UnoCSS from "unocss/vite";
import path from "path";

export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [UnoCSS(), solidPlugin()],
    server: {
      port: 3000,
    },
    build: {
      target: "esnext",
    },
    // Expose env to your app
    define: {
      "process.env.VITE_API_URL": JSON.stringify(env.VITE_API_URL),
      "process.env.VITE_APP_ENV": JSON.stringify(env.VITE_APP_ENV),
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@assets": path.resolve(__dirname, "./src/assets"),
        "@components": path.resolve(__dirname, "./src/components"),
        "@config": path.resolve(__dirname, "./src/config"),
        "@features": path.resolve(__dirname, "./src/features"),
        "@hooks": path.resolve(__dirname, "./src/hooks"),
        "@layouts": path.resolve(__dirname, "./src/layouts"),
        "@lib": path.resolve(__dirname, "./src/lib"),
        "@routes": path.resolve(__dirname, "./src/routes"),
        "@stores": path.resolve(__dirname, "./src/stores"),
        "@styles": path.resolve(__dirname, "./src/styles"),
        "@utils": path.resolve(__dirname, "./src/utils"),
      },
    },
  };
});
