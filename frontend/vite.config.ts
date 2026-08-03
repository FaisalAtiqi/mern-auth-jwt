import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@shared": path.resolve(__dirname, "../shared"),
    },
  },

  server: {
    fs: {
      // Allow serving files from one level up (the shared folder)
      allow: [".."],
    },

    /**
     * Proxy Configuration for API Requests
     *
     * PURPOSE:
     * - Forward all requests starting with '/api' to the backend server
     * - Avoid CORS errors during development (different origins)
     * - Keep frontend API calls clean (use '/api/*' instead of full backend URLs)
     *
     * WHY WE NEED THIS:
     * - Frontend runs on: http://localhost:5173 or http://192.168.137.2:5173
     * - Backend runs on: http://192.168.137.1:3000
     * - Without proxy: Browser blocks requests due to CORS policy (different origins)
     * - With proxy: Browser thinks requests go to the same origin, CORS issues disappear
     *
     * ALTERNATIVE WITHOUT PROXY:
     * - Would need CORS configuration on backend
     * - Would need to use full URLs in frontend API calls
     * - Would need to handle preflight OPTIONS requests
     * - Would need different cookie settings (sameSite: "none", secure: true)
     *
     * HOW IT WORKS:
     * - Frontend calls: fetch('/api/auth/login')
     * - Vite dev server intercepts and proxies to: http://192.168.137.1:3000/auth/login
     * - Browser never sees the actual backend address
     * - Response comes back as if from the same origin
     *
     * NOTE: This only works in development mode (vite dev)
     * Production uses environment variables and actual backend URLs
     */
    host: true,
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:3000", // Backend server address
        changeOrigin: true,
      },
    },
  },
});
