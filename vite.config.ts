import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  
  // Set base path: '/' for local dev, '/Portfolio/' for GitHub Pages production
  base: command === 'serve' ? '/' : '/Portfolio/',

  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            { name: "three", test: /node_modules\/(three|three-stdlib)/ },
            {
              name: "react-three",
              test: /node_modules\/(@react-three\/fiber|@react-three\/drei)/,
            },
            { name: "gsap", test: /node_modules\/gsap/ },
            {
              name: "vendor",
              test: /node_modules\/(react|react-dom|react-router-dom)/,
            },
          ],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  optimizeDeps: {
    include: ["three", "gsap", "lenis"],
  },
}));