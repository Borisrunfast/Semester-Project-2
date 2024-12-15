import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  base: "/", // Ensures proper routing when deployed
  build: {
    target: "esnext", // Supports modern JavaScript features
    rollupOptions: {
      input: {
        // Map each entry HTML file to a route
        main: resolve(__dirname, "./index.html"),
        login: resolve(__dirname, "./auth/login/index.html"),
        register: resolve(__dirname, "./auth/register/index.html"),
        profile: resolve(__dirname, "./profile/index.html"),
        createListing: resolve(__dirname, "./listings/create/index.html"),
        editListing: resolve(__dirname, "./listings/edit/index.html"),
        viewListing: resolve(__dirname, "./listings/view/index.html"),
      },
    },
  },
});
