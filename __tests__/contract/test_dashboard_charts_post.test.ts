/**
 * Contract Test: POST /dashboards/{id}/charts
 *
 * Tests the contract for adding charts to a dashboard.
 * This test MUST fail until the endpoint is implemented.
 */

describe("POST /api/dashboard/[id]/charts", () => {
    const baseURL = "http://localhost:3000";
    const testDashboardId = "test-dashboard-123";

    it("should create chart and return 201 status", async () => {
        const newChart = {
            type: "line",
            title: "Revenue Over Time",
            metric: "revenue",
            config: {
                colors: ["#3b82f6"],
                showLegend: true,
                showGrid: true,
                animation: true,
                interactive: true,
            },
            position: { x: 0, y: 0 },
            size: { width: 6, height: 4 },
            refreshInterval: 300,
        };

        const response = await fetch(`${baseURL}/api/dashboard/${testDashboardId}/charts`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer test-token",
            },
            body: JSON.stringify(newChart),
        });

        expect(response.status).toBe(201);
    });

    it("should return created chart with generated ID", async () => {
        const newChart = {
            type: "bar",
            title: "User Growth",
            metric: "users",
            config: {
                colors: ["#10b981"],
                showLegend: false,
                showGrid: true,
                animation: true,
                interactive: true,
            },
            position: { x: 6, y: 0 },
            size: { width: 6, height: 4 },
            refreshInterval: 600,
        };

        const response = await fetch(`${baseURL}/api/dashboard/${testDashboardId}/charts`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer test-token",
            },
            body: JSON.stringify(newChart),
        });

        const createdChart = await response.json();

        expect(createdChart).toHaveProperty("id");
        expect(createdChart.dashboardId).toBe(testDashboardId);
        expect(createdChart.type).toBe(newChart.type);
        expect(createdChart.title).toBe(newChart.title);
        expect(createdChart.metric).toBe(newChart.metric);
        expect(createdChart).toHaveProperty("lastUpdated");
    });

    it("should validate required fields", async () => {
        const invalidChart = {
            // Missing required fields
            title: "Test Chart",
        };

        const response = await fetch(`${baseURL}/api/dashboard/${testDashboardId}/charts`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer test-token",
            },
            body: JSON.stringify(invalidChart),
        });

        expect(response.status).toBe(400);
    });

    it("should validate chart type", async () => {
        const invalidChart = {
            type: "invalid_type",
            title: "Test Chart",
            metric: "test",
            config: {},
            position: { x: 0, y: 0 },
            size: { width: 6, height: 4 },
            refreshInterval: 300,
        };

        const response = await fetch(`${baseURL}/api/dashboard/${testDashboardId}/charts`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer test-token",
            },
            body: JSON.stringify(invalidChart),
        });

        expect(response.status).toBe(400);
    });
});