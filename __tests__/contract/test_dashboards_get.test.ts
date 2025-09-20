/**
 * Contract Test: GET /dashboards
 *
 * Tests the contract for retrieving user dashboards.
 * This test MUST fail until the endpoint is implemented.
 */

import { NextRequest } from "next/server";

// Mock the dashboard API route
jest.mock("../../../src/app/api/dashboard/route", () => ({
    GET: jest.fn(),
}));

describe("GET /api/dashboard", () => {
    const baseURL = "http://localhost:3000";

    it("should return 200 status code", async () => {
        const response = await fetch(`${baseURL}/api/dashboard`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer test-token",
            },
        });

        expect(response.status).toBe(200);
    });

    it("should return dashboards array in response", async () => {
        const response = await fetch(`${baseURL}/api/dashboard`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer test-token",
            },
        });

        const data = await response.json();

        expect(data).toHaveProperty("dashboards");
        expect(Array.isArray(data.dashboards)).toBe(true);
        expect(data).toHaveProperty("total");
        expect(typeof data.total).toBe("number");
    });

    it("should return properly formatted dashboard objects", async () => {
        const response = await fetch(`${baseURL}/api/dashboard`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer test-token",
            },
        });

        const data = await response.json();

        if (data.dashboards.length > 0) {
            const dashboard = data.dashboards[0];

            expect(dashboard).toHaveProperty("id");
            expect(dashboard).toHaveProperty("userId");
            expect(dashboard).toHaveProperty("name");
            expect(dashboard).toHaveProperty("layout");
            expect(dashboard).toHaveProperty("createdAt");
            expect(dashboard).toHaveProperty("updatedAt");
            expect(dashboard).toHaveProperty("isActive");

            expect(typeof dashboard.id).toBe("string");
            expect(typeof dashboard.userId).toBe("string");
            expect(typeof dashboard.name).toBe("string");
            expect(typeof dashboard.isActive).toBe("boolean");
        }
    });

    it("should handle authentication errors", async () => {
        const response = await fetch(`${baseURL}/api/dashboard`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                // Missing Authorization header
            },
        });

        expect(response.status).toBe(401);
    });

    it("should handle malformed requests", async () => {
        const response = await fetch(`${baseURL}/api/dashboard`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer test-token",
                "X-Invalid-Header": "invalid",
            },
        });

        // Should still work despite extra headers
        expect(response.status).toBe(200);
    });
});