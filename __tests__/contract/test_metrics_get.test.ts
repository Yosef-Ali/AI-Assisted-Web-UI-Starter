/**
 * Contract Test: GET /metrics
 *
 * Tests the contract for retrieving available metrics.
 * This test MUST fail until the endpoint is implemented.
 */

describe("GET /api/metrics", () => {
    const baseURL = "http://localhost:3000";

    it("should return metrics list with 200 status", async () => {
        const response = await fetch(`${baseURL}/api/metrics`, {
            headers: {
                "Authorization": "Bearer test-token",
            },
        });

        expect(response.status).toBe(200);
    });

    it("should return array of metric definitions", async () => {
        const response = await fetch(`${baseURL}/api/metrics`, {
            headers: {
                "Authorization": "Bearer test-token",
            },
        });

        const metrics = await response.json();

        expect(Array.isArray(metrics)).toBe(true);

        if (metrics.length > 0) {
            const metric = metrics[0];
            expect(metric).toHaveProperty("id");
            expect(metric).toHaveProperty("name");
            expect(metric).toHaveProperty("description");
            expect(metric).toHaveProperty("type");
            expect(metric).toHaveProperty("unit");
            expect(metric).toHaveProperty("category");
        }
    });

    it("should support category filtering", async () => {
        const response = await fetch(`${baseURL}/api/metrics?category=financial`, {
            headers: {
                "Authorization": "Bearer test-token",
            },
        });

        expect(response.status).toBe(200);

        const metrics = await response.json();
        expect(Array.isArray(metrics)).toBe(true);

        // All metrics should be in the financial category
        metrics.forEach((metric: any) => {
            expect(metric.category).toBe("financial");
        });
    });

    it("should support search filtering", async () => {
        const response = await fetch(`${baseURL}/api/metrics?search=revenue`, {
            headers: {
                "Authorization": "Bearer test-token",
            },
        });

        expect(response.status).toBe(200);

        const metrics = await response.json();
        expect(Array.isArray(metrics)).toBe(true);

        // All metrics should contain "revenue" in name or description
        metrics.forEach((metric: any) => {
            const hasRevenue = metric.name.toLowerCase().includes("revenue") ||
                metric.description.toLowerCase().includes("revenue");
            expect(hasRevenue).toBe(true);
        });
    });

    it("should support pagination", async () => {
        const response = await fetch(`${baseURL}/api/metrics?page=1&limit=10`, {
            headers: {
                "Authorization": "Bearer test-token",
            },
        });

        expect(response.status).toBe(200);

        const result = await response.json();

        if (result.data) {
            expect(Array.isArray(result.data)).toBe(true);
            expect(result.data.length).toBeLessThanOrEqual(10);
            expect(result).toHaveProperty("total");
            expect(result).toHaveProperty("page");
            expect(result).toHaveProperty("limit");
        }
    });

    it("should require authentication", async () => {
        const response = await fetch(`${baseURL}/api/metrics`);

        expect(response.status).toBe(401);
    });
});