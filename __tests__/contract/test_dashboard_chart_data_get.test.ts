/**
 * Contract Test: GET /dashboards/{id}/charts/{chartId}/data
 *
 * Tests the contract for retrieving chart data.
 * This test MUST fail until the endpoint is implemented.
 */

describe("GET /api/dashboard/[id]/charts/[chartId]/data", () => {
    const baseURL = "http://localhost:3000";
    const testDashboardId = "test-dashboard-123";
    const testChartId = "test-chart-456";

    it("should return chart data with 200 status", async () => {
        const response = await fetch(`${baseURL}/api/dashboard/${testDashboardId}/charts/${testChartId}/data`, {
            headers: {
                "Authorization": "Bearer test-token",
            },
        });

        expect(response.status).toBe(200);
    });

    it("should return array of data points", async () => {
        const response = await fetch(`${baseURL}/api/dashboard/${testDashboardId}/charts/${testChartId}/data`, {
            headers: {
                "Authorization": "Bearer test-token",
            },
        });

        const data = await response.json();

        expect(Array.isArray(data)).toBe(true);

        if (data.length > 0) {
            const dataPoint = data[0];
            expect(dataPoint).toHaveProperty("id");
            expect(dataPoint).toHaveProperty("metricId");
            expect(dataPoint).toHaveProperty("value");
            expect(dataPoint).toHaveProperty("timestamp");
            expect(dataPoint).toHaveProperty("quality");
        }
    });

    it("should support time range filtering", async () => {
        const startDate = "2024-01-01T00:00:00Z";
        const endDate = "2024-01-31T23:59:59Z";

        const response = await fetch(
            `${baseURL}/api/dashboard/${testDashboardId}/charts/${testChartId}/data?startDate=${startDate}&endDate=${endDate}`,
            {
                headers: {
                    "Authorization": "Bearer test-token",
                },
            }
        );

        expect(response.status).toBe(200);

        const data = await response.json();
        expect(Array.isArray(data)).toBe(true);

        // All data points should be within the specified range
        data.forEach((point: any) => {
            const pointTime = new Date(point.timestamp).getTime();
            const startTime = new Date(startDate).getTime();
            const endTime = new Date(endDate).getTime();

            expect(pointTime).toBeGreaterThanOrEqual(startTime);
            expect(pointTime).toBeLessThanOrEqual(endTime);
        });
    });

    it("should support data aggregation", async () => {
        const response = await fetch(
            `${baseURL}/api/dashboard/${testDashboardId}/charts/${testChartId}/data?aggregation=hourly`,
            {
                headers: {
                    "Authorization": "Bearer test-token",
                },
            }
        );

        expect(response.status).toBe(200);

        const data = await response.json();
        expect(Array.isArray(data)).toBe(true);
    });

    it("should return 404 for non-existent chart", async () => {
        const response = await fetch(`${baseURL}/api/dashboard/${testDashboardId}/charts/non-existent-chart/data`, {
            headers: {
                "Authorization": "Bearer test-token",
            },
        });

        expect(response.status).toBe(404);
    });

    it("should return 404 for non-existent dashboard", async () => {
        const response = await fetch(`${baseURL}/api/dashboard/non-existent-dashboard/charts/${testChartId}/data`, {
            headers: {
                "Authorization": "Bearer test-token",
            },
        });

        expect(response.status).toBe(404);
    });

    it("should require authentication", async () => {
        const response = await fetch(`${baseURL}/api/dashboard/${testDashboardId}/charts/${testChartId}/data`);

        expect(response.status).toBe(401);
    });
});