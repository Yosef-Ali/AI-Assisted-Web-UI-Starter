/**
 * Contract Test: GET /dashboards/{id}/charts
 *
 * Tests the contract for retrieving dashboard charts.
 * This test MUST fail until the endpoint is implemented.
 */

describe("GET /api/dashboard/[id]/charts", () => {
    const baseURL = "http://localhost:3000";
    const testDashboardId = "test-dashboard-123";

    it("should return 200 status code", async () => {
        const response = await fetch(`${baseURL}/api/dashboard/${testDashboardId}/charts`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer test-token",
            },
        });

        expect(response.status).toBe(200);
    });

    it("should return charts array in response", async () => {
        const response = await fetch(`${baseURL}/api/dashboard/${testDashboardId}/charts`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer test-token",
            },
        });

        const data = await response.json();

        expect(data).toHaveProperty("charts");
        expect(Array.isArray(data.charts)).toBe(true);
        expect(data).toHaveProperty("total");
        expect(typeof data.total).toBe("number");
    });

    it("should return properly formatted chart objects", async () => {
        const response = await fetch(`${baseURL}/api/dashboard/${testDashboardId}/charts`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer test-token",
            },
        });

        const data = await response.json();

        if (data.charts.length > 0) {
            const chart = data.charts[0];

            expect(chart).toHaveProperty("id");
            expect(chart).toHaveProperty("dashboardId");
            expect(chart).toHaveProperty("type");
            expect(chart).toHaveProperty("title");
            expect(chart).toHaveProperty("metric");
            expect(chart).toHaveProperty("config");
            expect(chart).toHaveProperty("position");
            expect(chart).toHaveProperty("size");
            expect(chart).toHaveProperty("refreshInterval");
            expect(chart).toHaveProperty("lastUpdated");

            expect(chart.dashboardId).toBe(testDashboardId);
        }
    });

    it("should return 404 for non-existent dashboard", async () => {
        const response = await fetch(`${baseURL}/api/dashboard/non-existent-id/charts`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer test-token",
            },
        });

        expect(response.status).toBe(404);
    });
});