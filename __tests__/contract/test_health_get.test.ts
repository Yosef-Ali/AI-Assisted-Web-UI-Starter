/**
 * Contract Test: GET /health
 *
 * Tests the contract for health check endpoint.
 * This test MUST fail until the endpoint is implemented.
 */

describe("GET /api/health", () => {
    const baseURL = "http://localhost:3000";

    it("should return health status with 200", async () => {
        const response = await fetch(`${baseURL}/api/health`);

        expect(response.status).toBe(200);
    });

    it("should return health check response", async () => {
        const response = await fetch(`${baseURL}/api/health`);

        const health = await response.json();

        expect(health).toHaveProperty("status");
        expect(health).toHaveProperty("timestamp");
        expect(health).toHaveProperty("version");
        expect(health).toHaveProperty("uptime");
    });

    it("should return healthy status", async () => {
        const response = await fetch(`${baseURL}/api/health`);

        const health = await response.json();

        expect(health.status).toBe("healthy");
    });

    it("should include service dependencies status", async () => {
        const response = await fetch(`${baseURL}/api/health`);

        const health = await response.json();

        expect(health).toHaveProperty("services");

        if (health.services) {
            expect(typeof health.services).toBe("object");

            // Check for expected services
            const expectedServices = ["database", "cache", "metrics"];
            expectedServices.forEach(service => {
                if (health.services[service]) {
                    expect(health.services[service]).toHaveProperty("status");
                    expect(["healthy", "unhealthy", "degraded"]).toContain(health.services[service].status);
                }
            });
        }
    });

    it("should include system information", async () => {
        const response = await fetch(`${baseURL}/api/health`);

        const health = await response.json();

        expect(health).toHaveProperty("system");

        if (health.system) {
            expect(health.system).toHaveProperty("memory");
            expect(health.system).toHaveProperty("cpu");

            if (health.system.memory) {
                expect(health.system.memory).toHaveProperty("used");
                expect(health.system.memory).toHaveProperty("total");
                expect(health.system.memory).toHaveProperty("percentage");
            }

            if (health.system.cpu) {
                expect(health.system.cpu).toHaveProperty("usage");
            }
        }
    });

    it("should handle detailed health check", async () => {
        const response = await fetch(`${baseURL}/api/health?detailed=true`);

        expect(response.status).toBe(200);

        const health = await response.json();

        // Detailed response should include more information
        expect(health).toHaveProperty("database");
        expect(health).toHaveProperty("cache");
        expect(health).toHaveProperty("externalServices");
    });
});