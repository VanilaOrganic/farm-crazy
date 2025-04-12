import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true, // Provides global functions like `expect`
    environment: "jsdom", // Test in a simulated browser environment
  },
});
