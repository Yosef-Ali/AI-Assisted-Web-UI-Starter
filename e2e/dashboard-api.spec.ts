import { test, expect } from '@playwright/test';

test.describe('Dashboard API Tests', () => {
    test('should load dashboard page', async ({ page }) => {
        await page.goto('/');
        await expect(page).toHaveTitle(/Dashboard/);
    });

    test('should have working health check endpoint', async ({ request }) => {
        const response = await request.get('/api/health');
        expect(response.ok()).toBeTruthy();

        const health = await response.json();
        expect(health).toHaveProperty('status');
        expect(health).toHaveProperty('timestamp');
        expect(health).toHaveProperty('version');
        expect(health.status).toBe('healthy');
    });

    test('should return dashboards list', async ({ request }) => {
        const response = await request.get('/api/dashboards');
        expect(response.ok()).toBeTruthy();

        const dashboards = await response.json();
        expect(Array.isArray(dashboards)).toBeTruthy();
    });

    test('should create new dashboard', async ({ request }) => {
        const newDashboard = {
            name: 'Test Dashboard',
            description: 'Created by Playwright test',
            isPublic: false,
        };

        const response = await request.post('/api/dashboards', {
            data: newDashboard,
        });

        expect(response.ok()).toBeTruthy();
        expect(response.status()).toBe(201);

        const created = await response.json();
        expect(created).toHaveProperty('id');
        expect(created.name).toBe(newDashboard.name);
        expect(created.description).toBe(newDashboard.description);
    });

    test('should get specific dashboard', async ({ request }) => {
        // Get existing dashboards first
        const listResponse = await request.get('/api/dashboards');
        expect(listResponse.ok()).toBeTruthy();

        const dashboards = await listResponse.json();
        expect(Array.isArray(dashboards)).toBeTruthy();
        expect(dashboards.length).toBeGreaterThan(0);

        // Use the first existing dashboard
        const existingDashboard = dashboards[0];

        // Then retrieve it by ID
        const response = await request.get(`/api/dashboards/${existingDashboard.id}`);
        expect(response.ok()).toBeTruthy();

        const dashboard = await response.json();
        expect(dashboard.id).toBe(existingDashboard.id);
        expect(dashboard.name).toBe(existingDashboard.name);
    });

    test('should return 404 for non-existent dashboard', async ({ request }) => {
        const response = await request.get('/api/dashboards/non-existent-id');
        expect(response.status()).toBe(404);
    });

    test('should get dashboard charts', async ({ request }) => {
        // Get first dashboard
        const dashboardsResponse = await request.get('/api/dashboards');
        const dashboards = await dashboardsResponse.json();

        if (dashboards.length > 0) {
            const firstDashboard = dashboards[0];
            const response = await request.get(`/api/dashboards/${firstDashboard.id}/charts`);
            expect(response.ok()).toBeTruthy();

            const charts = await response.json();
            expect(Array.isArray(charts)).toBeTruthy();
        }
    });

    test('should create chart in dashboard', async ({ request }) => {
        // Get first dashboard
        const dashboardsResponse = await request.get('/api/dashboards');
        const dashboards = await dashboardsResponse.json();

        if (dashboards.length > 0) {
            const firstDashboard = dashboards[0];
            const newChart = {
                type: 'line',
                title: 'Test Chart',
                metric: 'test_metric',
                position: { x: 0, y: 0 },
                size: { width: 6, height: 4 },
            };

            const response = await request.post(`/api/dashboards/${firstDashboard.id}/charts`, {
                data: newChart,
            });

            expect(response.ok()).toBeTruthy();
            expect(response.status()).toBe(201);

            const created = await response.json();
            expect(created).toHaveProperty('id');
            expect(created.type).toBe(newChart.type);
            expect(created.title).toBe(newChart.title);
        }
    });
});