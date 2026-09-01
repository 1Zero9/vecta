import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: "node",
    include: ["tests/**/*.test.{ts,tsx}"],
    setupFiles: ["./tests/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary", "html"],
      include: [
        "lib/fitEngine.ts",
        "lib/jobFiltering.ts",
        "lib/pipeline.ts",
        "lib/profileCompletion.ts",
        "lib/resumeExtraction.ts",
        "lib/skillMatching.ts",
        "lib/storage.ts",
      ],
    },
  },
});
