/**
 * Contract Test: PUT /dashboards/{id}
 *
 * Tests the contract for updating a dashboard.
 * This test MUST fail until the endpoint is implemented.
 */

describe("PUT /api/dashboard/[id]", () => {
    const baseURL = "http://localhost:3000";
    const testDashboardId = "test-dashboard-123";

    it("should update dashboard and return 200 status", async () => {
        const updateData = {
            name: "Updated Dashboard Name",
            description: "Updated description",
            layout: {
                columns: 4,
                rows: 3,
                gap: 20,
                responsive: true,
            },
            isActive: true,
        };

        const response = await fetch(`${baseURL}/api/dashboard/${testDashboardId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer test-token",
            },
            body: JSON.stringify(updateData),
        });

        expect(response.status).toBe(200);
    });

    it("should return updated dashboard object", async () => {
        const updateData = {
            name: "Updated Name",
            isActive: false,
        };

        const response = await fetch(`${baseURL}/api/dashboard/${testDashboardId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer test-token",
            },
            body: JSON.stringify(updateData),
        });

        const updatedDashboard = await response.json();

        expect(updatedDashboard.name).toBe(updateData.name);
        expect(updatedDashboard.isActive).toBe(updateData.isActive);
        expect(updatedDashboard).toHaveProperty("updatedAt");
    });

    it("should return 404 for non-existent dashboard", async () => {
        const updateData = {
            name: "Updated Name",
        };

        const response = await fetch(`${baseURL}/api/dashboard/non-existent-id`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer test-token",
            },
            body: JSON.stringify(updateData),
        });

        expect(response.status).toBe(404);
    });

    it("should validate partial updates", async () => {
        const partialUpdate = {
            description: "Only updating description",
        };

        const response = await fetch(`${baseURL}/api/dashboard/${testDashboardId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer test-token",
            },
            body: JSON.stringify(partialUpdate),
        });

        expect(response.status).toBe(200);

        const updatedDashboard = await response.json();
        expect(updatedDashboard.description).toBe(partialUpdate.description);
    });
});