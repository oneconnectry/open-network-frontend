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

export default defineConfig({
  plugins: [react()],

  // GitHub Pages repository name
  base: "/open-network-frontend/",

  build: {
    // Increase warning limit (optional)
    chunkSizeWarningLimit: 1000,

    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],

          mediapipe: [
            "@mediapipe/tasks-vision",
          ],

          webcam: [
            "react-webcam",
          ],
        },
      },
    },
  },
});