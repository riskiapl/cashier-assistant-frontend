import { defineConfig, loadEnv } from "vite";
import solidPlugin from "vite-plugin-solid";
import devtools from "solid-devtools/vite";
import UnoCSS from "unocss/vite";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const isDev = mode === "development";

  return {
    plugins: [
      UnoCSS(),
      devtools({ autoname: true }),
      solidPlugin(),
      VitePWA({
        registerType: "autoUpdate",
        includeAssets: [
          "favicon.ico",
          "apple-touch-icon.png",
          "masked-icon.svg",
        ],
        manifest: {
          name: "Cashierly",
          short_name: "Cashierly",
          description: "Cashier Assistant Application",
          theme_color: "#ffffff",
          icons: [
            {
              src: "pwa-192x192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "pwa-512x512.png",
              sizes: "512x512",
              type: "image/png",
            },
            {
              src: "pwa-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any maskable",
            },
          ],
        },
        devOptions: {
          enabled: true,
          type: "module",
        },
        workbox: {
          globDirectory: isDev ? "dev-dist" : "dist", // Ubah ke folder yang benar
          globPatterns: ["**/*.{js,css,html}"],
          globIgnores: ["**/node_modules/**/*", "sw.js", "workbox-*.js"],
        },
      }),
    ],
    server: {
      port: 3000,
      proxy: isDev
        ? {
            // Only apply proxy in development
            "/api": {
              target: "http://localhost:8000",
              changeOrigin: true,
              rewrite: (path) => path.replace(/^\/api/, ""),
            },
          }
        : undefined,
    },
    build: {
      target: "esnext",
    },
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
        "@pages": path.resolve(__dirname, "./src/pages"),
        "@hooks": path.resolve(__dirname, "./src/hooks"),
        "@layouts": path.resolve(__dirname, "./src/layouts"),
        "@lib": path.resolve(__dirname, "./src/lib"),
        "@locales": path.resolve(__dirname, "./src/locales"),
        "@routes": path.resolve(__dirname, "./src/routes"),
        "@services": path.resolve(__dirname, "./src/services"),
        "@stores": path.resolve(__dirname, "./src/stores"),
        "@styles": path.resolve(__dirname, "./src/styles"),
        "@utils": path.resolve(__dirname, "./src/utils"),
      },
    },
  };
});
