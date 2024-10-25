import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import postcss from "./postcss.config.js";

export default defineConfig({
    plugins: [react()],
    css: {
        postcss,
    },
    server: {
        watch: {
            usePolling: true,
        },
        host: true,
        strictPort: true,
        port : 5900
    }
});
