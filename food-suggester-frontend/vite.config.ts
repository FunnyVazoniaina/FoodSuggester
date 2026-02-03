import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "favicon.ico",
        "kitchen.png",
        "spoonfork.png",
        "vite.svg",
      ],
      manifest: {
        name: "Food Suggester",
        short_name: "FoodSuggester",
        description:
          "Trouvez des recettes avec les ingrédients que vous avez déjà",
        theme_color: "#ffffff",
        icons: [
          {
            src: "favicon.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "spoonfork.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});
