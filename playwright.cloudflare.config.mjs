import { defineConfig } from '@playwright/test';

// Remote smoke checks only. Do not boot the local Vite webServer.
export default defineConfig({
  testDir: './cloudflare/tests',
  timeout: 125_000,
  expect: { timeout: 40_000 },
  retries: 1,
  use: {
    baseURL: process.env.CABO_CF_PREVIEW_URL ||
      'https://cabo-solutions-edge-preview.cabo-solutions-za.workers.dev',
    headless: true,
  },
});
