import { sites } from "@openai/sites-vite-plugin";
import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/postcss";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import vinext from "vinext";

export default defineConfig({
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  plugins: [
    vinext(),
    cloudflare({
      viteEnvironment: { name: "rsc", childEnvironments: ["ssr"] },
    }),
    sites(),
  ],
  resolve: {
    alias: {
      "@prisma/client": fileURLToPath(new URL("./lib/prismaClient.sites.ts", import.meta.url)),
      "@/lib/accountStore": fileURLToPath(new URL("./lib/accountStore.sites.ts", import.meta.url)),
      "@/lib/profileStore": fileURLToPath(new URL("./lib/profileStore.sites.ts", import.meta.url)),
      "@/lib/savedItemsStore": fileURLToPath(new URL("./lib/savedItemsStore.sites.ts", import.meta.url)),
      "@/lib/pipelineStore": fileURLToPath(new URL("./lib/pipelineStore.sites.ts", import.meta.url)),
      tailwindcss: fileURLToPath(new URL("./node_modules/tailwindcss/index.css", import.meta.url)),
    },
  },
  environments: {
    rsc: {
      build: {
        rolldownOptions: {
          output: {
            entryFileNames: "index.js",
          },
        },
      },
    },
  },
});
