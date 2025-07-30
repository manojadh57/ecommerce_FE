import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      //  customer-side backend  →  http://localhost:8000
      "/api/customer": "http://localhost:8000",
      //  admin-side backend     →  http://localhost:8000
      "/api/admin": "http://localhost:8000",
    },
  },
});
