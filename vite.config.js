import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

import UnoCSS from "unocss/vite";

// import path from "node:path";
import { fileURLToPath } from "url";
// const __dirname = path.dirname(fileURLToPath(import.meta.url));

// import mockServer from "vite-plugin-mock-server";
// import { viteMockServe } from "vite-plugin-mock";

import path from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/luReactAdmin',
  plugins: [
    UnoCSS({
      configFile: "./uno.config.js",
    }),
    react(),
    createSvgIconsPlugin({
      iconDirs: [path.resolve(fileURLToPath(import.meta.url), '../src/assets/svgIcon')],
      symbolId: 'icon-[dir]-[name]',
    }),
    // viteMockServe(),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      // "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3009,
    // host: "192.168.1.218",
    open: false,
    hmr: true, //开启热更新
    proxy: {
      // "^/api": {
      //   target: "http://127.0.0.1:3008",
      //   changeOrigin: true,
      // },
      "^/react": {
        target: "http://127.0.0.1:3007",
        changeOrigin: true,
      },
    },
  },
});
