// Vitest configuration to scope tests to project sources and avoid running
// tests inside node_modules or build artifacts.
// This helps prevent failures from third-party test suites (e.g., entities, next telemetry).
module.exports = {
  test: {
    // Only include tests in the project source and tests folders
    include: ["tests/**/*.{test,spec}.{js,ts,tsx}", "src/**/*.{test,spec}.{js,ts,tsx}"],
    // Exclude node_modules and build artifacts from test discovery
    exclude: ["**/node_modules/**", "dist/**", "build/**"],
    environment: "jsdom",
    // Use existing setup file if present
    setupFiles: ["<rootDir>/tests/setup.ts"],
    globals: true,
    exclude: ["**/e2e/**", "**/tests/e2e/**"], 
  },
};
