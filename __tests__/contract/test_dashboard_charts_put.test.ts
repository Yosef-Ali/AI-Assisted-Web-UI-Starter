/**
 * Contract Test: PUT /dashboards/{id}/charts/{chartId}
 *
 * Tests the contract for updating charts in a dashboard.
 * This test MUST fail until the endpoint is implemented.
 */

describe("PUT /api/dashboard/[id]/charts/[chartId]", () => {
    const baseURL = "http://localhost:3000";
    const testDashboardId = "test-dashboard-123";
    const testChartId = "test-chart-456";

    it("should update chart and return 200 status", async () => {
        const updatedChart = {
            type: "area",
            title: "Updated Revenue Chart",
            metric: "revenue",
            config: {
                colors: ["#ef4444"],
                showLegend: true,
                showGrid: false,
                animation: false,
                interactive: true,
            },
            position: { x: 0, y: 4 },
            size: { width: 8, height: 6 },
            refreshInterval: 120,
        };

        const response = await fetch(`${baseURL}/api/dashboard/${testDashboardId}/charts/${testChartId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer test-token",
            },
            body: JSON.stringify(updatedChart),
        });

        expect(response.status).toBe(200);
    });

    it("should return updated chart with new data", async () => {
        const updatedChart = {
            type: "pie",
            title: "Market Share",
            metric: "market_share",
            config: {
                colors: ["#f59e0b", "#10b981", "#3b82f6"],
                showLegend: true,
                showGrid: false,
                animation: true,
                interactive: true,
            },
            position: { x: 8, y: 0 },
            size: { width: 4, height: 4 },
            refreshInterval: 900,
        };

        const response = await fetch(`${baseURL}/api/dashboard/${testDashboardId}/charts/${testChartId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer test-token",
            },
            body: JSON.stringify(updatedChart),
        });

        const result = await response.json();

        expect(result.id).toBe(testChartId);
        expect(result.dashboardId).toBe(testDashboardId);
        expect(result.type).toBe(updatedChart.type);
        expect(result.title).toBe(updatedChart.title);
        expect(result.metric).toBe(updatedChart.metric);
        expect(result).toHaveProperty("lastUpdated");
    });

    it("should handle partial updates", async () => {
        const partialUpdate = {
            title: "Partially Updated Chart",
            refreshInterval: 180,
        };

        const response = await fetch(`${baseURL}/api/dashboard/${testDashboardId}/charts/${testChartId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer test-token",
            },
            body: JSON.stringify(partialUpdate),
        });

        expect(response.status).toBe(200);

        const result = await response.json();
        expect(result.title).toBe(partialUpdate.title);
        expect(result.refreshInterval).toBe(partialUpdate.refreshInterval);
    });

    it("should return 404 for non-existent chart", async () => {
        const updatedChart = {
            title: "Non-existent Chart",
        };

        const response = await fetch(`${baseURL}/api/dashboard/${testDashboardId}/charts/non-existent-chart`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer test-token",
            },
            body: JSON.stringify(updatedChart),
        });

        expect(response.status).toBe(404);
    });
});