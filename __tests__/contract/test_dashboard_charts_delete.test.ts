/**
 * Contract Test: DELETE /dashboards/{id}/charts/{chartId}
 *
 * Tests the contract for deleting charts from a dashboard.
 * This test MUST fail until the endpoint is implemented.
 */

describe("DELETE /api/dashboard/[id]/charts/[chartId]", () => {
    const baseURL = "http://localhost:3000";
    const testDashboardId = "test-dashboard-123";
    const testChartId = "test-chart-456";

    it("should delete chart and return 204 status", async () => {
        const response = await fetch(`${baseURL}/api/dashboard/${testDashboardId}/charts/${testChartId}`, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer test-token",
            },
        });

        expect(response.status).toBe(204);
    });

    it("should return 404 for non-existent chart", async () => {
        const response = await fetch(`${baseURL}/api/dashboard/${testDashboardId}/charts/non-existent-chart`, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer test-token",
            },
        });

        expect(response.status).toBe(404);
    });

    it("should return 404 for non-existent dashboard", async () => {
        const response = await fetch(`${baseURL}/api/dashboard/non-existent-dashboard/charts/${testChartId}`, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer test-token",
            },
        });

        expect(response.status).toBe(404);
    });

    it("should require authentication", async () => {
        const response = await fetch(`${baseURL}/api/dashboard/${testDashboardId}/charts/${testChartId}`, {
            method: "DELETE",
            // No Authorization header
        });

        expect(response.status).toBe(401);
    });
});