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
      "^/pdf/": {
        target: "http://127.0.0.1:3100",
        changeOrigin: true,
      },
    },
  },
  build: {
    target: ['es2015'],
    outDir: 'dist', // 指定输出路径
    assetsDir: 'static', // 指定生成静态文件目录
    assetsInlineLimit: 4096, // 小于此阈值的导入或引用资源将内联为 base64 编码
    cssCodeSplit: true, // 启用 CSS 代码拆分
    emptyOutDir: true, //打包前先清空原有打包文件
    // 在这里配置打包时的rollup配置
    rollupOptions: {
      output: {
        //静态资源分类打包
        chunkFileNames: 'static/js/[name]-[hash].js',
        entryFileNames: 'static/js/[name]-[hash].js',
        // assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
        assetFileNames: (chunkInfo) => {
          const extFileDirMap = {
            'png,gif,jpg,jpeg,svg': '/img',
          }
          const ext = chunkInfo?.name.match(/\.(\w+)$/)?.[1] || 'js'
          const dir =
            Object.keys(extFileDirMap)
              .filter((key) => key.split(',').includes(ext))
              .map((key) => extFileDirMap[key])?.[0] || '[ext]'
          return `static/${dir}/[name].[hash].[ext]`
        },
        // 添加 manualChunks 配置
        manualChunks: {
          react: ['react', 'react-dom'],
          // 可以根据需要添加更多的模块分组
        },
      },
    },
  },
});
