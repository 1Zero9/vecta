import { sites } from "@openai/sites-vite-plugin";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import vinext from "vinext";

export default defineConfig({
  plugins: [vinext(), sites()],
  resolve: {
    alias: {
      "@prisma/client": fileURLToPath(new URL("./lib/prismaClient.sites.ts", import.meta.url)),
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
