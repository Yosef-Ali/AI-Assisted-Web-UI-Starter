/**
 * Contract Test: GET /dashboards/{id}
 *
 * Tests the contract for retrieving a specific dashboard.
 * This test MUST fail until the endpoint is implemented.
 */

describe("GET /api/dashboard/[id]", () => {
    const baseURL = "http://localhost:3000";
    const testDashboardId = "test-dashboard-123";

    it("should return 200 status code for existing dashboard", async () => {
        const response = await fetch(`${baseURL}/api/dashboard/${testDashboardId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer test-token",
            },
        });

        expect(response.status).toBe(200);
    });

    it("should return dashboard object with all required fields", async () => {
        const response = await fetch(`${baseURL}/api/dashboard/${testDashboardId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer test-token",
            },
        });

        const dashboard = await response.json();

        expect(dashboard).toHaveProperty("id");
        expect(dashboard).toHaveProperty("userId");
        expect(dashboard).toHaveProperty("name");
        expect(dashboard).toHaveProperty("layout");
        expect(dashboard).toHaveProperty("createdAt");
        expect(dashboard).toHaveProperty("updatedAt");
        expect(dashboard).toHaveProperty("isActive");

        expect(dashboard.id).toBe(testDashboardId);
    });

    it("should return 404 for non-existent dashboard", async () => {
        const response = await fetch(`${baseURL}/api/dashboard/non-existent-id`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer test-token",
            },
        });

        expect(response.status).toBe(404);
    });

    it("should handle authentication errors", async () => {
        const response = await fetch(`${baseURL}/api/dashboard/${testDashboardId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                // Missing Authorization header
            },
        });

        expect(response.status).toBe(401);
    });
});