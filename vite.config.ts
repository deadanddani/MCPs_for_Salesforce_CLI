

import { defineConfig } from "vite";

export default defineConfig({
  // In sandboxed environments, reading `.env` can be blocked (EPERM).
  // Point Vite/Vitest env loading to an empty directory so tests can start reliably.
  envDir: ".vitest-env",
  test: {
    environment: "node",
    // Avoid spawning forked child processes (can be blocked in sandboxed environments).
    pool: "threads",
    env: {
      NODE_ENV: "test",
    },
  },
});
