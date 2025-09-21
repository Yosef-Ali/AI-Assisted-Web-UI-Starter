import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: 'tests/e2e',
    timeout: 15_000,
    expect: { timeout: 5_000 },
    retries: 0,
    fullyParallel: true,
    reporter: [['list']],
    // Start Next.js dev server for e2e; assume app router root.
    webServer: {
        command: 'npm run dev',
        port: 3000,
        reuseExistingServer: true,
        timeout: 60_000,
    },
    use: {
        baseURL: 'http://localhost:3000',
    },
});
