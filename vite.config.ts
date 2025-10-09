import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { visualizer } from "rollup-plugin-visualizer";
import viteCompression from "vite-plugin-compression";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: "stats.html",
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
    viteCompression({
      algorithm: "brotliCompress",
      ext: ".br",
      deleteOriginFile: false,
    }),
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      react: path.resolve(__dirname, "node_modules/react"),
      "react-dom": path.resolve(__dirname, "node_modules/react-dom"),
    },
    dedupe: ["react", "react-dom"],
  },

  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "framer-motion",
      "react-helmet-async",
    ],
  },

  build: {
    target: "es2017",
    sourcemap: false,
    cssMinify: true,
    minify: "esbuild",

    // ✅ single-page app mode (no library build)
    outDir: "dist",
    emptyOutDir: true,
    assetsDir: "assets",

    // ✅ ensures all src files are bundled, not emitted individually
    rollupOptions: {
      input: path.resolve(__dirname, "index.html"),
      output: {
        entryFileNames: "assets/[name]-[hash].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]",
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("firebase")) return "vendor-firebase";
            return "vendor";
          }
        },
      },
    },

    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },

  esbuild: {
    target: "es2017",
    drop: ["console", "debugger"],
  },
});
