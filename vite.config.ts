import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { visualizer } from "rollup-plugin-visualizer";
import viteCompression from "vite-plugin-compression";
import path from "path";

export default defineConfig({
  plugins: [
    react(),

    // ✅ Bundle visualizer (only used locally, not in prod)
    visualizer({
      filename: "stats.html",
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),

    // ✅ Compress assets (gzip + brotli)
    viteCompression({
      algorithm: "brotliCompress",
      ext: ".br",
      deleteOriginFile: false,
      threshold: 1024, // compress only files > 1KB
    }),
    viteCompression({
      algorithm: "gzip",
      ext: ".gz",
      deleteOriginFile: false,
      threshold: 1024,
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
    esbuildOptions: {
      target: "es2017",
    },
  },

  build: {
    target: "es2017",
    sourcemap: false,
    cssMinify: true,
    cssCodeSplit: true, // ✅ only load CSS for visible pages
    minify: "terser", // ✅ better JS compression than esbuild
    outDir: "dist",
    emptyOutDir: true,
    assetsDir: "assets",

    rollupOptions: {
      input: path.resolve(__dirname, "index.html"),
      output: {
        entryFileNames: "assets/[name]-[hash].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]",
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("firebase")) return "vendor-firebase";
            if (id.includes("framer-motion")) return "vendor-motion";
            if (id.includes("react-router")) return "vendor-router";
            return "vendor";
          }
        },
      },
    },

    terserOptions: {
      compress: {
        passes: 3,
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ["console.log", "console.info", "console.debug"],
      },
      format: {
        comments: false,
      },
    },

    // ✅ Ensures proper CommonJS interop (for Firebase and third-party libs)
    commonjsOptions: {
      transformMixedEsModules: true,
    },

    reportCompressedSize: true,
    chunkSizeWarningLimit: 900, // optional: silence warnings
  },

  esbuild: {
    target: "es2017",
    drop: ["console", "debugger"],
  },
});
