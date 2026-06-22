// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [
//     react({
//       babel: {
//         plugins: [['babel-plugin-react-compiler']],
//       },
//     }),
//   ],
// })

// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";

// // Replace 'open-network-frontend' with your repo name
// export default defineConfig({
//   plugins: [react()],
//   base: "/open-network-frontend/", // Important for GitHub Pages
// });

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: true,
      gzipSize: true,
      filename: "stats.html",
    }),
  ],

  base: "/open-network-frontend/",

  build: {
    chunkSizeWarningLimit: 1000,

    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
        },
      },
    },
  },
});